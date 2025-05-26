"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { TbLockExclamation } from "react-icons/tb";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function ResetPassword({ searchParams }) {
  const token = searchParams.token;
  const router = useRouter();
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();
  const [tokenData, setTokenData] = useState({
    isTokenValid: false,
    email: null,
    resMsg: null,
  });
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      const response = await axiosPublic.put("reset-password", {
        token,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      reset({ newPassword: "", confirmPassword: "" });
      setIsPageLoading(false);
    }
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern") || errorTypes.includes("validate"))
      toast.error("Please provide valid information.");
    else if (
      errorTypes.includes("notMatchingWithConfirm") ||
      errorTypes.includes("notMatchingWithNew")
    )
      toast.error("Passwords do not match.");
    else toast.error("Something went wrong. Please try again.");
  };

  useEffect(() => {
    setValue("email", tokenData.email);
  }, [tokenData, setValue]);

  useEffect(() => {
    const validateToken = async () => {
      setIsPageLoading(true);

      try {
        const response = await axiosPublic.put("/validate-reset-token", {
          token,
        });

        setTokenData({
          isTokenValid: response.data.success,
          email: response.data.email,
          resMsg: response.data.message,
        });
      } catch (error) {
        setTokenData({
          isTokenValid: false,
          email: null,
          resMsg: error.response.data.message,
        });
      } finally {
        setIsPageLoading(false);
      }
    };

    validateToken();
  }, [axiosPublic, setIsPageLoading, token]);

  return (
    <main
      className={`relative -mt-[calc(256*4px)] text-sm text-neutral-500 max-sm:-mt-[calc(256*2px)] md:text-base [&_h2]:uppercase [&_h2]:text-neutral-700 ${tokenData.isTokenValid ? "bg-neutral-50" : "bg-white font-semibold"}`}
    >
      {/* Left Mesh Gradient */}
      <div
        className={`sticky left-[5%] top-1/2 animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden ${!tokenData.isTokenValid ? "opacity-0" : "opacity-100"}`}
      />
      {/* Middle-Left Mesh Gradient */}
      <div
        className={`sticky left-[30%] top-[20%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s] max-sm:left-[5%] ${!tokenData.isTokenValid ? "opacity-0" : "opacity-100"}`}
      />
      {/* Middle-Right Mesh Gradient */}
      <div
        className={`sticky left-[55%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] max-sm:left-3/4 ${!tokenData.isTokenValid ? "opacity-0" : "opacity-100"}`}
      />
      {/* Right Mesh Gradient */}
      <div
        className={`sticky left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:2s] max-sm:hidden ${!tokenData.isTokenValid ? "opacity-0" : "opacity-100"}`}
      />
      {tokenData.isTokenValid ? (
        <div className="pt-header-h-full-section-pb relative flex min-h-dvh w-full items-center justify-center px-5 pb-[var(--section-padding)] sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
          <section className="w-full max-w-md rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-[height] duration-300 ease-in-out">
            <h2 className="text-base font-semibold md:text-lg">
              Reset Your Password
            </h2>
            <p className="mb-8 mt-2 text-sm">
              Please fill in the form below to reset your password.
            </p>
            <form
              className="space-y-4 read-only:[&_input]:border-0 read-only:[&_input]:bg-neutral-50 read-only:[&_input]:text-neutral-400"
              onSubmit={handleSubmit(onSubmit, onError)}
              noValidate
            >
              {/* Email Input Field */}
              <div className="w-full space-y-2 font-semibold">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  {...register("email", {
                    readOnly: true,
                    required: {
                      value: true,
                      message: "Email is required.",
                    },
                  })}
                  className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-regular)] focus:bg-white/75 md:text-[13px]"
                  readOnly
                  required
                />
                {errors.email && (
                  <p className="text-xs font-semibold text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* New Password Input Field */}
              <div className="w-full space-y-2 font-semibold">
                <label htmlFor="new-password">Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={isNewPasswordVisible ? "text" : "password"}
                    placeholder="••••••••••••••"
                    {...register("newPassword", {
                      pattern: {
                        value: /^.{8,}$/,
                        message: "Password must contain at least 8 characters.",
                      },
                      required: {
                        value: true,
                        message: "Password is required.",
                      },
                      validate: {
                        notMatchingWithConfirm: (fieldValue) => {
                          if (fieldValue === confirmPassword)
                            clearErrors("confirmPassword");

                          return (
                            !confirmPassword ||
                            confirmPassword === fieldValue ||
                            "Passwords do not match."
                          );
                        },
                      },
                    })}
                    className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-regular)] focus:bg-white/75 md:text-[13px]"
                    required
                  />
                  <div
                    className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setIsNewPasswordVisible((prevState) => !prevState)
                    }
                  >
                    {isNewPasswordVisible ? (
                      <AiOutlineEye className="text-neutral-700" />
                    ) : (
                      <AiOutlineEyeInvisible className="text-neutral-400" />
                    )}
                  </div>
                </div>
                {errors.newPassword && (
                  <p className="text-xs font-semibold text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              {/* Confirm Password Input Field */}
              <div className="w-full space-y-2 font-semibold">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="••••••••••••••"
                    {...register("confirmPassword", {
                      pattern: {
                        value: /^.{8,}$/,
                        message: "Password must contain at least 8 characters.",
                      },
                      required: {
                        value: true,
                        message: "Confirm password is required.",
                      },
                      validate: {
                        notMatchingWithNew: (fieldValue) => {
                          if (fieldValue === newPassword)
                            clearErrors("newPassword");

                          return (
                            !newPassword ||
                            newPassword === fieldValue ||
                            "Passwords do not match."
                          );
                        },
                      },
                    })}
                    className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-regular)] focus:bg-white/75 md:text-[13px]"
                    required
                  />
                  <div
                    className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                    onClick={() =>
                      setIsConfirmPasswordVisible((prevState) => !prevState)
                    }
                  >
                    {isConfirmPasswordVisible ? (
                      <AiOutlineEye className="text-neutral-700" />
                    ) : (
                      <AiOutlineEyeInvisible className="text-neutral-400" />
                    )}
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs font-semibold text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {/* Form Submission Button  */}
              <button className="relative z-[1] !mt-8 w-full rounded-lg bg-[var(--color-primary-regular)] py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[var(--color-primary-dark)] md:text-sm">
                Reset Password
              </button>
            </form>
          </section>
        </div>
      ) : (
        <div className="pt-header-h-full-section-pb flex min-h-dvh flex-col items-center justify-center pb-[var(--section-padding)] [&>*]:w-fit">
          <TbLockExclamation className="size-24 text-[var(--color-secondary-regular)]" />
          <p className="mt-2 text-neutral-400">{tokenData.resMsg}</p>
          <TransitionLink
            href="/"
            className="mt-9 block rounded-lg bg-[var(--color-primary-regular)] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-dark)]"
          >
            Return to Home
          </TransitionLink>
        </div>
      )}
    </main>
  );
}

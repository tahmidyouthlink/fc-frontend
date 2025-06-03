"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLoading } from "@/app/contexts/loading";

export default function LoginForm({ setModalContent, setIsAuthModalOpen }) {
  const { setIsPageLoading } = useLoading();
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);

  const {
    register: registerForLogin,
    handleSubmit: handleSubmitForLogin,
    reset: resetForLogin,
    resetField: resetFieldForLogin,
    formState: { errors: errorsForLogin },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // Function that handles form submission (user sign in)
  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      const result = await signIn("credentials-frontend", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        resetFieldForLogin("password");
        return toast.error(result?.error);
      } else {
        toast.success("Successfully signed in.");
      }

      resetForLogin(); // Reset form
      setIsAuthModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      setIsPageLoading(false);
    }
  };

  // Function that handles form submission error (displays error messages)
  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide valid information.");
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmitForLogin(onSubmit, onError)}
      className="space-y-3"
    >
      {/* Email Input Field */}
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="john.doe@gmail.com"
          autoComplete="email"
          {...registerForLogin("email", {
            pattern: {
              value:
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/,
              message: "Email is not valid.",
            },
            required: {
              value: true,
              message: "Email is required.",
            },
          })}
          className="h-11 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white md:text-[13px]"
          required
        />
        {/* Email Error Message */}
        {errorsForLogin.email && (
          <p className="text-xs font-semibold text-red-500">
            {errorsForLogin.email?.message}
          </p>
        )}
      </div>
      {/* Password Input Field */}
      <div className="w-full space-y-2 font-semibold">
        <div className="flex items-center justify-between">
          <label htmlFor="name">Password</label>
          <button
            type="button"
            onClick={() => setModalContent("forgotPassword")}
            className="text-xs font-semibold text-[var(--color-primary-900)] transition-[color] duration-300 ease-in-out hover:text-[var(--color-primary-800)]"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••"
            {...registerForLogin("password", {
              required: {
                value: true,
                message: "Password is required.",
              },
            })}
            className="h-11 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white md:text-[13px]"
            required
          />
          {/* Password Visibility Toggle Icon */}
          <div
            className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
            onClick={() => SetIsPasswordVisible((preState) => !preState)}
          >
            {isPasswordVisible ? (
              <AiOutlineEye className="text-neutral-700" />
            ) : (
              <AiOutlineEyeInvisible className="text-neutral-400" />
            )}
          </div>
        </div>
        {/* Password Error Message */}
        {errorsForLogin.password && (
          <p className="text-xs font-semibold text-red-500">
            {errorsForLogin.password?.message}
          </p>
        )}
      </div>
      {/* Sign In Button */}
      <button
        type="submit"
        className="!mt-7 w-full rounded-lg bg-[var(--color-primary-500)] py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)] md:text-sm"
      >
        Sign in
      </button>
      {/* Register page link if user doesn't have an account */}
      <p className="mt-7 text-xs md:text-sm">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="font-semibold text-[var(--color-primary-900)] transition-[color] duration-300 ease-in-out hover:text-[var(--color-primary-800)]"
          onClick={() => setModalContent("register")}
        >
          Register
        </button>
      </p>
    </form>
  );
}

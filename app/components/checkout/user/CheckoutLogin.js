import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CheckoutForgotPassword from "./CheckoutForgotPassword";
import GoogleSignInButton from "../../layout/header/auth/GoogleSignInButton";

export default function CheckoutLogin({
  onError,
  setIsPageLoading,
  setIsRegisterModalOpen,
}) {
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);

  const {
    register: registerForLogin,
    handleSubmit: handleSubmitForLogin,
    reset: resetForLogin,
    resetField: resetFieldForLogin,
    formState: { errors: errorsForLogin },
  } = useForm({
    defaultValues: {
      loginEmail: "",
      loginPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmitForLogin = async (data) => {
    setIsPageLoading(true);

    try {
      const result = await signIn("credentials-frontend", {
        redirect: false,
        email: data.loginEmail,
        password: data.loginPassword,
      });

      if (result?.error) {
        resetFieldForLogin("loginPassword");
        return toast.error(result?.error);
      } else {
        toast.success("Successfully signed in.");
      }

      resetForLogin(); // Reset login fields
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      setIsPageLoading(false);
    }
  };

  return (
    <section className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-[height] duration-300 ease-in-out">
      <h2 className="text-base font-semibold md:text-lg">
        Access Your Account
      </h2>
      <form
        className="space-y-4 read-only:[&_input]:border-0 read-only:[&_input]:bg-neutral-50 read-only:[&_input]:text-neutral-400"
        onSubmit={handleSubmitForLogin(onSubmitForLogin, onError)}
        noValidate
      >
        <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
          {/* Email Input Field */}
          <div className="w-full space-y-2 font-semibold">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="john.doe@gmail.com"
              autoComplete="email"
              {...registerForLogin("loginEmail", {
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
              className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white/75 md:text-[13px]"
              required
            />
            {errorsForLogin.loginEmail && (
              <p className="text-xs font-semibold text-red-500">
                {errorsForLogin.loginEmail?.message}
              </p>
            )}
          </div>
          {/* Password Input Field with Forgot Password */}
          <div className="w-full space-y-2 font-semibold">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password">Password</label>
              <CheckoutForgotPassword setIsPageLoading={setIsPageLoading} />
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••••••••••"
                {...registerForLogin("loginPassword", {
                  required: {
                    value: true,
                    message: "Password is required.",
                  },
                })}
                className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white/75 md:text-[13px]"
                required
              />
              <div
                className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                onClick={() => SetIsPasswordVisible((prevState) => !prevState)}
              >
                {isPasswordVisible ? (
                  <AiOutlineEye className="text-neutral-700" />
                ) : (
                  <AiOutlineEyeInvisible className="text-neutral-400" />
                )}
              </div>
            </div>
            {errorsForLogin.loginPassword && (
              <p className="text-xs font-semibold text-red-500">
                {errorsForLogin.loginPassword?.message}
              </p>
            )}
          </div>
        </div>
        {/* Login Button with Google Authentication */}
        <div className="max-sm:space-y-4 sm:flex sm:items-end sm:gap-x-4">
          <button
            type="submit"
            className="block h-fit w-full self-end rounded-lg bg-[var(--color-primary-500)] py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
          >
            Sign in
          </button>
          <GoogleSignInButton ctaText="Sign in with Google" />
        </div>
        {/* Register Modal Button */}
        <div className="w-full font-semibold">
          <p className="text-xs font-semibold">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="font-semibold text-[var(--color-primary-900)] transition-[color] duration-300 ease-in-out hover:text-[var(--color-primary-800)]"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Sign up now!
            </button>
          </p>
        </div>
      </form>
    </section>
  );
}

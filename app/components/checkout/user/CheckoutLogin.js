import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { auth } from "@/firebase.config";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import createErrorMessage from "@/app/utils/createErrorMessage";
import CheckoutForgotPassword from "./CheckoutForgotPassword";
import GoogleSignIn from "../../layout/header/auth/GoogleSignIn";

export default function CheckoutLogin({
  setUserData,
  onError,
  setIsPageLoading,
  setIsRegisterModalOpen,
}) {
  const axiosPublic = useAxiosPublic();
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);

  const {
    register: registerForLogin,
    handleSubmit: handleSubmitForLogin,
    reset: resetForLogin,
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
      await signInWithEmailAndPassword(
        auth,
        data.loginEmail,
        data.loginPassword,
      );
      toast.success("Successfully logged in.");

      const res = await axiosPublic.get(
        `/customerDetailsViaEmail/${data.loginEmail}`,
      );
      if (!res?.data) return toast.error("Failed to fetch user data.");

      const currentUserData = res?.data;

      const localWishlist = JSON.parse(localStorage.getItem("wishlistItems"));
      const localCart = JSON.parse(localStorage.getItem("cartItems"));
      const updatedWishlist = !!localWishlist?.length ? localWishlist : [];
      const updatedCartItems = !!localCart?.length ? localCart : [];

      try {
        const updatedUserData = {
          ...currentUserData,
          wishlistItems: updatedWishlist,
          cartItems: updatedCartItems,
        };

        const response = await axiosPublic.put(
          `/updateUserInformation/${currentUserData?._id}`,
          updatedUserData,
        );

        if (!!response?.data?.modifiedCount || !!response?.data?.matchedCount) {
          setUserData(updatedUserData);
        }
      } catch (error) {
        toast.error("Unable to update user data to server.");
      }

      resetForLogin(); // Reset login fields
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
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
              className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
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
                className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white/75 md:text-[13px]"
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
            className="block h-fit w-full self-end rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
          >
            Sign in
          </button>
          <GoogleSignIn isConnected={false} buttonText="Sign in" />
        </div>
        {/* Register Modal Button */}
        <div className="w-full font-semibold">
          <p className="text-xs font-semibold">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
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

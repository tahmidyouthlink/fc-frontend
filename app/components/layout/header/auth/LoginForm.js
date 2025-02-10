"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { auth } from "@/firebase.config";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import createErrorMessage from "@/app/utils/createErrorMessage";

export default function LoginForm({ setModalContent, setIsAuthModalOpen }) {
  const axiosPublic = useAxiosPublic();
  const { setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);

  const {
    register: registerForLogin,
    handleSubmit: handleSubmitForLogin,
    reset: resetForLogin,
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
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Successfully logged in.");

      const res = await axiosPublic.get(
        `/customerDetailsViaEmail/${data.email}`,
      );
      if (!res?.data) return toast.error("Failed to fetch user data.");

      const currentUserData = res?.data;

      const localWishlist = JSON.parse(localStorage.getItem("wishlistItems"));
      const localCart = JSON.parse(localStorage.getItem("cartItems"));
      const updatedWishlist = !!localWishlist?.length
        ? localWishlist
        : !!currentUserData?.wishlistItems?.length
          ? currentUserData?.wishlistItems
          : [];
      const updatedCartItems = !!localCart?.length
        ? localCart
        : !!currentUserData?.cartItems?.length
          ? currentUserData?.cartItems
          : [];

      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("storageWishlist"));
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      window.dispatchEvent(new Event("storageCart"));

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

      resetForLogin(); // Reset form
      setIsAuthModalOpen(false);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
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
          className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
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
            className="text-xs font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
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
            className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
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
        className="!mt-7 w-full rounded-lg bg-[#d4ffce] py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm"
      >
        Sign in
      </button>
      {/* Register page link if user doesn't have an account */}
      <p className="mt-7 text-xs md:text-sm">
        Don't have an account?{" "}
        <button
          type="button"
          className="font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
          onClick={() => setModalContent("register")}
        >
          Register
        </button>
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Checkbox } from "@nextui-org/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import generateCustomerId from "@/app/utils/generateCustomerId";

export default function RegisterForm({
  setModalContent,
  setIsAuthModalOpen,
  legalPolicyPdfLinks,
}) {
  const axiosPublic = useAxiosPublic();
  const { setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, SetIsConfirmPasswordVisible] =
    useState(false);
  const [isPoliciesCheckboxSelected, setIsPoliciesCheckboxSelected] =
    useState(true);
  const [isNewsletterCheckboxSelected, setIsNewsletterCheckboxSelected] =
    useState(true);

  const {
    register: registerForRegister,
    handleSubmit: handleSubmitForRegister,
    watch: watchForRegister,
    reset: resetForRegister,
    clearErrors: clearErrorsForRegister,
    formState: { errors: errorsForRegister },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const password = watchForRegister("password");
  const confirmPassword = watchForRegister("confirmPassword");

  // Function that handles form submission (user registration)
  const onSubmit = async (data) => {
    if (!isPoliciesCheckboxSelected)
      return toast.error(
        "You must first agree to the terms & conditions and privacy policy.",
      );

    setIsPageLoading(true);

    try {
      const { data: customerList } = await axiosPublic.get(
        "/allCustomerDetails",
      );
      const allCustomerIds = customerList?.map(
        (customer) => customer.userInfo?.customerId,
      );

      const newUserData = {
        email: data.email,
        password: data.password,
        isLinkedWithCredentials: true,
        isLinkedWithGoogle: false,
        userInfo: {
          customerId: generateCustomerId(allCustomerIds),
          personalInfo: {
            customerName: data.name,
            email: data.email,
            phoneNumber: "",
            phoneNumber2: "",
            hometown: "",
          },
          deliveryAddresses: [],
          savedDeliveryAddress: null,
          score: 0,
        },
        wishlistItems: [],
        cartItems: [],
      };

      // Register user
      const response = await axiosPublic.post("/customer-signup", newUserData);

      if (response?.data?.insertedId) {
        toast.success("Account created successfully.");

        setUserData(response?.data);

        // Login user with the credentials
        const result = await signIn("credentials-frontend", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          toast.error(result?.error);
        }
      } else {
        resetForRegister(
          {
            password: "",
            confirmPassword: "",
          },
          { keepValues: true },
        );
        return toast.error(response?.data?.message);
      }

      const { data: subscribedUsers } =
        await axiosPublic.get("/allNewsletters");
      const isAlreadySubscribed = subscribedUsers?.some(
        (subscribedUser) => subscribedUser.email === data.email,
      );

      if (isNewsletterCheckboxSelected && !isAlreadySubscribed) {
        try {
          const newsletterData = {
            email: data.email,
          };

          const response = await axiosPublic.post(
            "/addNewsletter",
            newsletterData,
          );
          if (!response?.data?.insertedId)
            toast.error("Unable to subscribe to newsletter.");
        } catch (error) {
          console.log("Unable to subscribe to newsletter.", error);
        }
      }

      resetForRegister(); // Reset form
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
    else if (
      errorTypes.includes("notMatchingWithConfirm") ||
      errorTypes.includes("notMatchingWithNew")
    )
      toast.error("Passwords do not match.");
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmitForRegister(onSubmit, onError)}
      className="space-y-3"
    >
      {/* Full Name Input Field */}
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          {...registerForRegister("name", {
            pattern: {
              value: /^[a-zA-Z\s'-]{3,}$/,
              message: "Full name is not valid.",
            },
            required: {
              value: true,
              message: "Full name is required.",
            },
          })}
          className="h-11 w-full rounded-[4px] border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white md:text-[13px]"
          required
        />
        {/* Full Name Error Message */}
        {errorsForRegister.name && (
          <p className="text-xs font-semibold text-red-500">
            {errorsForRegister.name?.message}
          </p>
        )}
      </div>
      {/* Email Input Field */}
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="john.doe@gmail.com"
          {...registerForRegister("email", {
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
          className="h-11 w-full rounded-[4px] border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white md:text-[13px]"
          required
        />
        {/* Email Error Message */}
        {errorsForRegister.email && (
          <p className="text-xs font-semibold text-red-500">
            {errorsForRegister.email?.message}
          </p>
        )}
      </div>
      {/* Password Input Field */}
      <div className="w-full space-y-2 font-semibold">
        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="••••••••••••••"
            {...registerForRegister("password", {
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
                    clearErrorsForRegister("confirmPassword");
                  return (
                    !confirmPassword ||
                    confirmPassword === fieldValue ||
                    "Passwords do not match."
                  );
                },
              },
            })}
            className="h-11 w-full rounded-[4px] border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white md:text-[13px]"
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
        {/* Email Error Message */}
        {errorsForRegister.password && (
          <p className="text-xs font-semibold text-red-500">
            {errorsForRegister.password?.message}
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
            {...registerForRegister("confirmPassword", {
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
                  if (fieldValue === password)
                    clearErrorsForRegister("password");
                  return (
                    !password ||
                    password === fieldValue ||
                    "Passwords do not match."
                  );
                },
              },
            })}
            className="h-11 w-full rounded-[4px] border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white md:text-[13px]"
            required
          />
          {/* Confirm Password Visibility Toggle Icon */}
          <div
            className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
            onClick={() => SetIsConfirmPasswordVisible((preState) => !preState)}
          >
            {isConfirmPasswordVisible ? (
              <AiOutlineEye className="text-neutral-700" />
            ) : (
              <AiOutlineEyeInvisible className="text-neutral-400" />
            )}
          </div>
        </div>
        {/* Confirm Password Error Message */}
        {errorsForRegister.confirmPassword && (
          <p className="text-xs font-semibold text-red-500">
            {errorsForRegister.confirmPassword?.message}
          </p>
        )}
      </div>
      <div className="!mt-7 space-y-4">
        {/* Terms & Conditions and Privacy Agreements */}
        <div
          className={`flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-[color] [&_a]:duration-300 [&_a]:ease-in-out [&_span]:text-xs lg:[&_span]:text-[13px] ${isPoliciesCheckboxSelected ? "[&_a]:text-[var(--color-primary-900)] hover:[&_a]:text-[var(--color-primary-800)]" : "[&_a]:text-[#f31260]"}`}
        >
          <Checkbox
            className="[&_span::after]:rounded-[3px] [&_span::before]:rounded-[3px] [&_span:has(svg):after]:bg-[var(--color-primary-500)] [&_span:has(svg)]:text-neutral-700 [&_span]:rounded-[3px]"
            defaultSelected
            isRequired
            isSelected={isPoliciesCheckboxSelected}
            onValueChange={setIsPoliciesCheckboxSelected}
            isInvalid={!isPoliciesCheckboxSelected}
          >
            I agree to the{" "}
            <Link target="_blank" href={legalPolicyPdfLinks?.terms || "#"}>
              Terms & Conditions
            </Link>
            {" and "}
            <Link target="_blank" href={legalPolicyPdfLinks?.privacy || "#"}>
              Privacy Policy
            </Link>
          </Checkbox>
        </div>
        {/* Newsletter Agreement */}
        <div className="flex gap-x-2 [&_span]:text-xs lg:[&_span]:text-[13px]">
          <Checkbox
            className="[&_span::after]:rounded-[3px] [&_span::before]:rounded-[3px] [&_span:has(svg):after]:bg-[var(--color-primary-500)] [&_span:has(svg)]:text-neutral-700 [&_span]:rounded-[3px]"
            isSelected={isNewsletterCheckboxSelected}
            onValueChange={setIsNewsletterCheckboxSelected}
          >
            Be the first to know more about our trending & newest products, and
            exclusive deals
          </Checkbox>
        </div>
        {/* Register Button */}
        <button
          type="submit"
          className="w-full rounded-[4px] bg-[var(--color-primary-500)] py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)] md:text-sm"
        >
          Sign up
        </button>
        {/* Login page link if user already has an account */}
        <p className="mt-7 text-xs md:text-sm">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[var(--color-primary-900)] transition-[color] duration-300 ease-in-out hover:text-[var(--color-primary-800)]"
            onClick={() => setModalContent("login")}
          >
            Login
          </button>
        </p>
      </div>
    </form>
  );
}

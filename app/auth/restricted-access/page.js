"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { signIn } from "next-auth/react";
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import { useRouter } from 'next/navigation';
import { RxCheck, RxCross1, RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';

const RestrictedAccessLoginPage = () => {

  const { register: registerForLogin, handleSubmit: handleSubmitForLogin, formState: { errors: errorsForLogin } } = useForm();
  const [isPasswordVisible, SetIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill("")); // 6-digit OTP
  const [finalOtp, setFinalOtp] = useState(""); // Store the combined OTP
  const inputRefs = useRef([...Array(6)].map(() => React.createRef())); // Initialize refs properly
  const [otpError, setOtpError] = useState(false); // Error state
  const [resendOtpText, setResendOtpText] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false); // Track resend state
  const [timer, setTimer] = useState(30); // Timer state for countdown
  const router = useRouter();

  useEffect(() => {
    if (otpRequested && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Start the countdown when OTP is requested
    let interval;
    if (otpRequested && isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false); // Enable resend after 30 seconds
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Countdown every second
    }

    return () => clearInterval(interval); // Clean up the interval on component unmount or when OTP is reset
  }, [otpRequested, isResendDisabled]);

  const handleChange = (index, e) => {
    let value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Ensure only numbers are entered

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setFinalOtp(newOtp.join(""));

    // Always move to next input after entering a digit
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select(); // Auto-select for easy editing
    }

    // Remove error automatically when OTP reaches 6 digits
    if (newOtp.join("").length === 6) {
      setOtpError(false);
    }
  };

  const handleClick = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].select(); // Selects the existing text
    }

    if (index > 0 && !otp[index - 1]) {
      const firstEmptyIndex = otp.findIndex((char) => char === "");
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  const handlePaste = (index, e) => {
    e.preventDefault(); // Prevent default paste behavior

    const pastedData = e.clipboardData.getData("Text"); // Get the pasted text
    const cleanedData = pastedData.replace(/\D/g, ""); // Remove any non-digit characters

    // Ensure the pasted data is no longer than 6 digits
    const maxDigits = 6;
    const dataToFill = cleanedData.slice(0, maxDigits - index); // Only fill the remaining empty inputs

    let newOtp = [...otp];
    dataToFill.split("").forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit; // Fill the OTP inputs with the pasted digits
      }
    });

    setOtp(newOtp);
    setFinalOtp(newOtp.join("")); // Update the final OTP value

    // Move focus to the last filled input after pasting
    const lastFilledIndex = Math.min(index + dataToFill.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
    inputRefs.current[lastFilledIndex]?.select(); // Select the last filled input for easy editing
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const resendOtp = async (data) => {

    if (isResendDisabled) {
      toast.error("You can only resend OTP after 30 seconds.");
      return;
    }

    setError(null); // Clear any previous errors
    setOtp(new Array(6).fill("")); // Reset OTP input fields
    setFinalOtp(""); // Clear stored OTP

    try {
      const result = await signIn("credentials", {
        redirect: false,
        emailOrUsername: data.emailOrUsername,
        password: data.password,
        otp: "",
      });

      if (result?.error) {
        if (result.error === "OTP has been sent to your email. Please enter the OTP to complete login.") {
          toast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
            >
              <div className="pl-6">
                <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
              </div>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-base font-bold text-gray-900">
                      Check your email! ✉️
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      A new OTP has been sent to your email. Enter it to continue logging in.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-text-700 focus:outline-none text-2xl"
                >
                  <RxCross2 />
                </button>
              </div>
            </div>
          ), {
            position: "bottom-right",
            duration: 5000
          });
          setResendOtpText(true);
          setIsResendDisabled(true); // Disable resend button
          setTimer(30); // Reset timer
          return;
        }
        setError(result.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    setError(null);

    if (otpRequested && finalOtp.length < 6) {
      setOtpError(true);
      return; // Prevent further execution
    }

    try {
      const result = await signIn("credentials-backend", {
        redirect: false,
        emailOrUsername: data.emailOrUsername,
        password: data.password,
        otp: otpRequested ? finalOtp : "",
      });

      if (result?.error) {

        if (result.error === "OTP has been sent to your email. Please enter the OTP to complete login.") {
          setOtpRequested(true);
          toast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
            >
              <div className="pl-6">
                <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
              </div>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-base font-bold text-gray-900">
                      Check your email! ✉️
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      We’ve sent an OTP to your email. Enter it to continue logging in.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-text-700 focus:outline-none text-2xl"
                >
                  <RxCross2 />
                </button>
              </div>
            </div>
          ), {
            position: "bottom-right",
            duration: 5000
          });
          return;
        }
        else if (result.error === "Your account setup is incomplete. Please set up your password before logging in.") {
          setError("You haven't set up your password. Please complete your account setup.");
        } else if (result.error === "No account found with this email or username.") {
          setError("No account found. Please check your details.");
        } else if (result.error === "Incorrect password. Please try again.") {
          setError("Wrong password. Try again.");
        }
        else if (result.error === "OTP expired or not found. Please try logging in again.") {
          setError("OTP expired or not found. Please try logging in again.")
        }
        else if (result.error === "OTP has expired. Please try logging in again.") {
          setError("OTP has expired. Please try logging in again.")
        }
        else if (result.error === "Invalid OTP. Please try again.") {
          setError("Invalid OTP. Please try again.")
        }
        else if (result.error === "Error sending OTP email. Please try again later.") {
          setError("Error sending OTP email. Please try again later.")
        }
        else {
          setError("An unexpected error occurred. Please try again later.");
        }
        return;
      }

      // If no error and OTP was already requested, proceed with login success
      if (otpRequested && result.ok) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
          >
            <div className="pl-6">
              <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
            </div>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-gray-900">
                    Login successful! 🎉
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    You&apos;re now logged into the dashboard. Manage your products, orders, and more!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-text-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        });

        router.push("/dash-board"); // Redirect after login
      }

    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>

      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat left-[45%] lg:left-[60%] -top-[138px]'
      />

      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-2 md:top-0 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />

      <div className="max-w-[600px] mx-auto px-6 pt-28 lg:pt-48 relative">

        {/* Email and password login section */}
        <form noValidate onSubmit={handleSubmitForLogin(onSubmit)}>

          {!otpRequested ? (

            <div>

              {/* Heading */}
              <h1 className="text-4xl font-semibold">
                Login
              </h1>

              <p className={`${error ? "mb-5" : "mb-10"} mt-2`}>
                Enter your credentials to access your account.
              </p>

              {error && (
                <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-5">
                  <RxCross1 className="text-red-700 w-5 h-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                {/* Email or Username Input Field */}
                <div className="w-full space-y-2 font-semibold">
                  <label htmlFor="emailOrUsername">Email or Username</label>
                  <input
                    id="emailOrUsername"
                    type="text"
                    placeholder="Email or Username"
                    autoComplete="emailOrUsername"
                    {...registerForLogin("emailOrUsername", {
                      required: {
                        value: true,
                        message: "This field is required.",
                      },
                    })}
                    className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
                    required
                  />
                  {/* Email Error Message */}
                  {errorsForLogin.emailOrUsername && (
                    <p className="text-xs font-semibold text-red-500">
                      {errorsForLogin.emailOrUsername?.message}
                    </p>
                  )}
                </div>

                {/* Password Input Field */}
                <div className="w-full space-y-2 font-semibold">
                  <div className="flex items-center justify-between">
                    <label htmlFor="name">Password</label>
                    {/* <button
                type="button"
                onClick={() => setModalContent("forgotPassword")}
                className="text-xs font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
              >
                Forgot password?
              </button> */}
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
                        minLength: { value: 8, message: "Password must be at least 8 characters." },
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
              </div>

            </div>

          ) : (
            <>

              <div className="flex flex-col w-full space-y-3 border p-10 rounded-lg">

                {/* Heading */}
                <h2 className="text-3xl font-semibold text-neutral-950">Enter Your OTP</h2>
                <hr />
                <p className="text-neutral-700 pb-2">Enter the 6 digit code that you received on your email.</p>


                {/* OTP Input Boxes */}
                <div className="flex items-center justify-center space-x-3 md:space-x-7">
                  {otp?.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={(input) => (inputRefs.current[index] = input)}
                      value={value}
                      onChange={(e) => handleChange(index, e)}
                      onClick={() => handleClick(index)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePaste(index, e)} // Attach handlePaste here
                      maxLength={1}
                      className="w-8 h-8 text-lg font-bold text-center border border-gray-300 rounded-lg outline-none transition-all duration-200 shadow-sm focus:border-[#F4D3BA] focus:ring-[#F4D3BA] focus:ring-2 focus:bg-white md:w-14 md:h-14"
                    />
                  ))}
                </div>

                {/* Error Message */}
                {otpError && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    OTP must be exactly 6 digits.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={finalOtp?.length < 6}
                  className={`!mt-7 w-full rounded-lg ${finalOtp?.length === 6 ? "bg-[#d4ffce] hover:bg-[#bdf6b4]" : "cursor-not-allowed bg-gray-200 text-[#191838]"} py-4 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 md:text-base`}
                >
                  Verify
                </button>

                {error && (
                  <div className="text-red-700 py-2 rounded-lg mb-5">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className='flex flex-col items-center pt-4'>
                  <p>Not receive a code?</p>
                  <button
                    type="button"
                    disabled={isResendDisabled}
                    onClick={() => handleSubmitForLogin(resendOtp)()}
                    className={`mt-2 text-sm font-medium ${isResendDisabled ? "cursor-not-allowed text-gray-500" : "text-orange-500 hover:underline"}`}
                  >
                    RESEND OTP {isResendDisabled && `(${timer}s)`}
                  </button>
                </div>
                {/* Resend Link */}
                {resendOtpText && <p className='text-green-600 text-center'>A new OTP has been sent to your email.</p>}
              </div>

            </>
          )}

          {!otpRequested && <button
            type="submit"
            className="!mt-7 w-full rounded-lg bg-[#d4ffce] py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm"
          >
            Login
          </button>}

        </form>

      </div>

    </div>
  );
};

export default RestrictedAccessLoginPage;
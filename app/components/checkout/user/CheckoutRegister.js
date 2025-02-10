import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Checkbox,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { auth } from "@/firebase.config";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import useCustomers from "@/app/hooks/useCustomers";
import generateCustomerId from "@/app/utils/generateCustomerId";
import createErrorMessage from "@/app/utils/createErrorMessage";
import TransitionLink from "../../ui/TransitionLink";
import GoogleSignIn from "../../layout/header/auth/GoogleSignIn";

export default function CheckoutRegister({
  setUserData,
  onError,
  setIsPageLoading,
  isRegisterModalOpen,
  setIsRegisterModalOpen,
}) {
  const axiosPublic = useAxiosPublic();
  const [customerList, isCustomerListLoading, customerRefetch] = useCustomers();
  const [subscribedEmails, setSubscribedEmails] = useState(null);
  const [isNewPasswordVisible, SetIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, SetIsConfirmPasswordVisible] =
    useState(false);
  const [isPoliciesCheckboxSelected, setIsPoliciesCheckboxSelected] =
    useState(true);
  const [isNewsletterCheckboxSelected, setIsNewsletterCheckboxSelected] =
    useState(true);

  const {
    register: registerForRegister,
    handleSubmit: handleSubmitForRegister,
    reset: resetForRegister,
    watch: watchForRegister,
    clearErrors: clearErrorsForRegister,
    formState: { errors: errorsForRegister },
  } = useForm({
    defaultValues: {
      registerFullName: "",
      registerEmail: "",
      registerPassword: "",
      registerConfirmPassword: "",
    },
    mode: "onBlur",
  });

  const registerPassword = watchForRegister("registerPassword");
  const registerConfirmPassword = watchForRegister("registerConfirmPassword");

  useEffect(() => {
    setIsPageLoading(isCustomerListLoading || !customerList?.length);

    return () => setIsPageLoading(false);
  }, [isCustomerListLoading, customerList]);

  const onSubmitForRegister = async (data) => {
    if (!isPoliciesCheckboxSelected)
      return toast.error(
        "You must first agree to the terms & conditions and privacy policy.",
      );

    setIsPageLoading(true);

    try {
      // Attempt to create user account with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.registerEmail,
        data.registerPassword,
      );

      toast.success("Registered Successfully.");

      // Update user profile with the given name
      await updateProfile(userCredential?.user, {
        displayName: data.registerFullName,
      });

      const localWishlist = JSON.parse(localStorage.getItem("wishlistItems"));
      const localCart = JSON.parse(localStorage.getItem("cartItems"));
      const allCustomerIds = customerList?.map(
        (customer) => customer.userInfo?.customerId,
      );

      const newUserData = {
        email: data.registerEmail,
        userInfo: {
          customerId: generateCustomerId(allCustomerIds),
          personalInfo: {
            customerName: data.registerFullName,
            email: data.registerEmail,
            phoneNumber: "",
            phoneNumber2: "",
            hometown: "",
            dob: null,
          },
          deliveryAddresses: [],
          savedDeliveryAddress: null,
          score: 0,
        },
        wishlistItems: !!localWishlist?.length ? localWishlist : [],
        cartItems: !!localCart?.length ? localCart : [],
      };

      // Store user data to server
      const response = await axiosPublic.post(
        "/addCustomerDetails",
        newUserData,
      );
      if (response?.data?.insertedId) setUserData(response?.data);
      else toast.error("Unable to store user data to server.");

      if (
        isNewsletterCheckboxSelected &&
        !subscribedEmails?.includes(data.registerEmail)
      ) {
        try {
          const newsletterData = {
            email: data.registerEmail,
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

      resetForRegister(); // reset register form
      setIsRegisterModalOpen(false);
    } catch (error) {
      toast.error(createErrorMessage(error));
    }
    setIsPageLoading(false);
  };

  useEffect(() => {
    const getSubscribedEmails = async () => {
      try {
        const response = await axiosPublic.get("allNewsletters");
        setSubscribedEmails(
          response?.data?.map((item) => item.email).filter((email) => !!email),
        );
      } catch (error) {
        console.log("Error fetching subscribed emails.", error);
      }
    };

    getSubscribedEmails();
  }, []);

  return (
    <Modal
      isOpen={isRegisterModalOpen}
      onOpenChange={setIsRegisterModalOpen}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="uppercase">Sign up</ModalHeader>
            <ModalBody className="-mt-5">
              <p className="mb-4 text-sm text-neutral-500">
                After you sign up, you can continue to checkout.
              </p>
              {/* Register Form */}
              <form
                className="space-y-4 read-only:[&_input]:border-0 read-only:[&_input]:bg-neutral-50 read-only:[&_input]:text-neutral-400"
                onSubmit={handleSubmitForRegister(onSubmitForRegister, onError)}
                noValidate
              >
                <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                  {/* Full Name Input Field */}
                  <div className="w-full space-y-2 font-semibold">
                    <label htmlFor="register-full-name">Full Name</label>
                    <input
                      id="register-full-name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      {...registerForRegister("registerFullName", {
                        pattern: {
                          value: /^[a-zA-Z\s'-]{3,}$/,
                          message: "Full name is not valid.",
                        },
                        required: {
                          value: true,
                          message: "Full name is required.",
                        },
                      })}
                      className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                      required
                    />
                    {errorsForRegister.registerFullName && (
                      <p className="text-xs font-semibold text-red-500">
                        {errorsForRegister.registerFullName?.message}
                      </p>
                    )}
                  </div>
                  {/* Email Input Field */}
                  <div className="w-full space-y-2 font-semibold">
                    <label htmlFor="register-email">Email</label>
                    <input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      placeholder="john.doe@gmail.com"
                      {...registerForRegister("registerEmail", {
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
                      className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                      required
                    />
                    {errorsForRegister.registerEmail && (
                      <p className="text-xs font-semibold text-red-500">
                        {errorsForRegister.registerEmail?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                  {/* Password Input Field */}
                  <div className="w-full space-y-2 font-semibold">
                    <label htmlFor="register-password">Password</label>
                    <div className="relative">
                      <input
                        id="register-password"
                        type={isNewPasswordVisible ? "text" : "password"}
                        placeholder="••••••••••••••"
                        {...registerForRegister("registerPassword", {
                          pattern: {
                            value: /^.{8,}$/,
                            message:
                              "Password must contain at least 8 characters.",
                          },
                          required: {
                            value: true,
                            message: "Password is required.",
                          },
                          validate: {
                            notMatchingWithConfirm: (fieldValue) => {
                              if (fieldValue === registerConfirmPassword)
                                clearErrorsForRegister(
                                  "registerConfirmPassword",
                                );

                              return (
                                !registerConfirmPassword ||
                                registerConfirmPassword === fieldValue ||
                                "Passwords do not match."
                              );
                            },
                          },
                        })}
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                        required
                      />
                      <div
                        className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          SetIsNewPasswordVisible((prevState) => !prevState)
                        }
                      >
                        {isNewPasswordVisible ? (
                          <AiOutlineEye className="text-neutral-700" />
                        ) : (
                          <AiOutlineEyeInvisible className="text-neutral-400" />
                        )}
                      </div>
                    </div>
                    {errorsForRegister.registerPassword && (
                      <p className="text-xs font-semibold text-red-500">
                        {errorsForRegister.registerPassword?.message}
                      </p>
                    )}
                  </div>
                  {/* Confirm Password Input Field */}
                  <div className="w-full space-y-2 font-semibold">
                    <label htmlFor="register-confirm-password">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="register-confirm-password"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        placeholder="••••••••••••••"
                        {...registerForRegister("registerConfirmPassword", {
                          pattern: {
                            value: /^.{8,}$/,
                            message:
                              "Password must contain at least 8 characters.",
                          },
                          required: {
                            value: true,
                            message: "Confirm password is required.",
                          },
                          validate: {
                            notMatchingWithNew: (fieldValue) => {
                              if (fieldValue === registerPassword)
                                clearErrorsForRegister("registerPassword");

                              return (
                                !registerPassword ||
                                registerPassword === fieldValue ||
                                "Passwords do not match."
                              );
                            },
                          },
                        })}
                        className="h-10 w-full rounded-lg border-2 border-neutral-200 px-3 text-xs text-neutral-700 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] md:text-[13px]"
                        required
                      />
                      <div
                        className="absolute right-3 top-1/2 w-4 -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          SetIsConfirmPasswordVisible((prevState) => !prevState)
                        }
                      >
                        {isConfirmPasswordVisible ? (
                          <AiOutlineEye className="text-neutral-700" />
                        ) : (
                          <AiOutlineEyeInvisible className="text-neutral-400" />
                        )}
                      </div>
                    </div>
                    {errorsForRegister.registerConfirmPassword && (
                      <p className="text-xs font-semibold text-red-500">
                        {errorsForRegister.registerConfirmPassword?.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Policy Agreements */}
                <div
                  className={`!mt-7 flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-[color] [&_a]:duration-300 [&_a]:ease-in-out [&_span]:text-xs lg:[&_span]:text-[13px] ${isPoliciesCheckboxSelected ? "[&_a]:text-[#57944e] hover:[&_a]:text-[#6cb461]" : "[&_a]:text-[#f31260]"}`}
                >
                  <Checkbox
                    className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
                    defaultSelected
                    isRequired
                    isSelected={isPoliciesCheckboxSelected}
                    onValueChange={setIsPoliciesCheckboxSelected}
                    isInvalid={!isPoliciesCheckboxSelected}
                  >
                    I agree to the{" "}
                    <TransitionLink href="/terms-and-conditions">
                      Terms & Conditions
                    </TransitionLink>
                    {" and "}
                    <TransitionLink href="/privacy-policy">
                      Privacy Policy
                    </TransitionLink>
                  </Checkbox>
                </div>
                {/* Newsletter Agreement */}
                <div className="flex gap-x-2 [&_span]:text-xs lg:[&_span]:text-[13px]">
                  <Checkbox
                    className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
                    isSelected={isNewsletterCheckboxSelected}
                    onValueChange={setIsNewsletterCheckboxSelected}
                  >
                    Be the first to know more about our trending & newest
                    products, and exclusive deals
                  </Checkbox>
                </div>
                {/* Register Button */}
                <div className="!mb-4 !mt-8 max-sm:space-y-4 sm:flex sm:items-end sm:gap-x-4">
                  <button
                    type="submit"
                    className="block h-fit w-full self-end rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
                  >
                    Sign up
                  </button>
                  <GoogleSignIn isConnected={false} buttonText="Sign up" />
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

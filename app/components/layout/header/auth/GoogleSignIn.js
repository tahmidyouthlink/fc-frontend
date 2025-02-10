"use client";

import { useEffect } from "react";
import { linkWithPopup, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { LuCheck } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "@/firebase.config";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import useCustomers from "@/app/hooks/useCustomers";
import generateCustomerId from "@/app/utils/generateCustomerId";
import createErrorMessage from "@/app/utils/createErrorMessage";

export default function GoogleSignIn({
  isConnected,
  buttonText,
  isAuthModalOpen,
  setIsAuthModalOpen,
}) {
  const { user, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();
  const [customerList, isCustomerListLoading, customerRefetch] = useCustomers();

  useEffect(() => {
    setIsPageLoading(isCustomerListLoading || !customerList?.length);

    return () => setIsPageLoading(false);
  }, [isCustomerListLoading, customerList]);

  const handleGoogleSignIn = async () => {
    setIsPageLoading(true);

    try {
      if (!user) {
        // Sign in, if user is not logged in
        const userCredential = await signInWithPopup(auth, googleProvider);
        const userEmail = userCredential?.user?.email;
        const userName = userCredential?.user?.displayName;

        const { data } = await axiosPublic.get("/allCustomerDetails");
        const doesUserHaveAccount = data.some(
          (userData) => userData.email === userEmail,
        );

        if (doesUserHaveAccount) {
          if (isAuthModalOpen) setIsAuthModalOpen(false);
          toast.success("Successfully logged in.");
        } else {
          toast.success("Account created successfully.");

          setIsPageLoading(true);

          try {
            const localWishlist = JSON.parse(
              localStorage.getItem("wishlistItems"),
            );
            const localCart = JSON.parse(localStorage.getItem("cartItems"));
            const allCustomerIds = customerList?.map(
              (customer) => customer.userInfo?.customerId,
            );

            const newUserData = {
              email: userEmail,
              userInfo: {
                customerId: generateCustomerId(allCustomerIds),
                personalInfo: {
                  customerName: userName,
                  email: userEmail,
                  phoneNumber: "",
                  phoneNumber2: "",
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
            if (response?.data?.insertedId) {
              setUserData(response?.data);
              if (isAuthModalOpen) setIsAuthModalOpen(false);
            } else toast.error("Unable to store user data to server.");
          } catch (error) {
            toast.error("Unable to store user data to server.");
          }

          setIsPageLoading(false);
        }
      } else {
        // Link to Google, if logged in with password provider
        await linkWithPopup(user, googleProvider);
        toast.success("Successfully connected.");
      }
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-neutral-200"
      onClick={() =>
        isConnected
          ? toast.success("Already connected to Google account.")
          : handleGoogleSignIn()
      }
    >
      <FcGoogle size={20} />
      {buttonText + `${!isConnected ? " with Google" : ""}`}
      {isConnected && <LuCheck className="size-5 text-green-600" />}
    </button>
  );
}

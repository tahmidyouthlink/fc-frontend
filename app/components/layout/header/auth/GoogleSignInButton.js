"use client";

import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { LuCheck } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import generateCustomerId from "@/app/utils/generateCustomerId";

export default function GoogleSignInButton({
  isLinkedWithGoogle,
  ctaText,
  isAuthModalOpen,
  setIsAuthModalOpen,
}) {
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();

  const popupCenter = (url, title) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = width / window.screen.availWidth;

    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 550) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      title,
      `width=${500 / systemZoom},
      height=${550 / systemZoom},
      top=${top},
      left=${left}`,
    );

    newWindow?.focus();
    return newWindow;
  };

  const handleGoogleSignIn = () => {
    setIsPageLoading(true);

    const popup = popupCenter(
      "/login/google",
      `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | ` + ctaText,
    );

    const interval = setInterval(async () => {
      if (!popup || popup.closed) {
        clearInterval(interval);

        try {
          const updatedSession = await getSession();

          if (updatedSession) {
            const { data: customerList } = await axiosPublic.get(
              "/allCustomerDetails",
            );
            const doesUserHaveAccount = customerList.some(
              (customer) => customer.email === updatedSession?.user?.email,
            );

            if (doesUserHaveAccount) {
              if (isAuthModalOpen) setIsAuthModalOpen(false);
              toast.success("Signed in successfully.");
            } else {
              const allCustomerIds = customerList?.map(
                (customer) => customer.userInfo?.customerId,
              );

              const newUserData = {
                email: updatedSession?.user?.email,
                password: null,
                isLinkedWithCredentials: false,
                isLinkedWithGoogle: true,
                userInfo: {
                  customerId: generateCustomerId(allCustomerIds),
                  personalInfo: {
                    customerName: updatedSession?.user?.name,
                    email: updatedSession?.user?.email,
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

              const response = await axiosPublic.post(
                "/addCustomerDetails",
                newUserData,
              );

              if (response?.data?.insertedId) {
                if (isAuthModalOpen) setIsAuthModalOpen(false);
                toast.success("Account created successfully.");
              } else {
                toast.error(response?.data?.message);
              }
            }
          } else {
            toast.error(
              `Failed to ${ctaText.toLowerCase()}. Please try again.`,
            );
          }
        } catch (error) {
          console.log("Failed to sync user data.", error);
        } finally {
          setIsPageLoading(false);
        }
      }
    }, 500);
  };

  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-neutral-100 py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-neutral-200"
      onClick={() =>
        isLinkedWithGoogle
          ? toast.success("Already connected to a Google account.")
          : handleGoogleSignIn()
      }
    >
      <FcGoogle size={20} />
      {ctaText}
      {isLinkedWithGoogle && <LuCheck className="size-5 text-green-600" />}
    </button>
  );
}

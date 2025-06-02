import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import { LuCheckCircle2 } from "react-icons/lu";
import { useAuth } from "@/app/contexts/auth";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import NotifyMeModal from "./NotifyMeModal";

export default function NotifyMeButton({
  productId,
  productVariantSku,
  selectedOptions,
  isNotifyMeModalOpen,
  setIsNotifyMeModalOpen,
  isUserSubscribed,
  setIsUserSubscribed,
}) {
  const { userData } = useAuth();
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (!selectedOptions?.size || productVariantSku !== 0) return;
    if (!userData) return setIsUserSubscribed(false);

    const debounceTimeout = setTimeout(() => {
      const checkIfUserIsSubscribed = async () => {
        try {
          const { data: allUsersNotifiedList } = await axiosPublic.get(
            "/get-all-availability-notifications",
          );

          const correspondingVariant = allUsersNotifiedList.find(
            (variant) =>
              variant.productId === productId &&
              variant.size === selectedOptions?.size &&
              variant.colorCode === selectedOptions?.color.color,
          );

          const isInNotifiedList = correspondingVariant?.emails?.some(
            (user) => user.email === userData.email && !user.notified,
          );

          setIsUserSubscribed(isInNotifiedList);
        } catch (error) {
          console.error(error?.response?.data?.message || error.message);
        }
      };

      checkIfUserIsSubscribed();
    }, 25);

    return () => clearTimeout(debounceTimeout);
  }, [
    axiosPublic,
    productId,
    productVariantSku,
    selectedOptions?.color.color,
    selectedOptions?.size,
    setIsUserSubscribed,
    userData,
  ]);

  return (
    <>
      {!isUserSubscribed ? (
        <button
          onClick={() => setIsNotifyMeModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-tertiary-500)] px-3 py-2.5 text-[13px]/[1] font-semibold text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-tertiary-600)]"
          // alternative bg colors: normal:ededed, hover:neutral-200
        >
          Notify Me
          <FaRegBell size={13} />
        </button>
      ) : (
        <div className="flex w-fit items-center gap-1 font-semibold text-[#45963a]">
          <LuCheckCircle2 size={20} />
          <p className="text-xs">You&apos;ll be notifed upon availability</p>
        </div>
      )}
      <NotifyMeModal
        userData={userData}
        axiosPublic={axiosPublic}
        setIsUserSubscribed={setIsUserSubscribed}
        isNotifyMeModalOpen={isNotifyMeModalOpen}
        setIsNotifyMeModalOpen={setIsNotifyMeModalOpen}
        notifyMeProduct={{
          productId: productId,
          size: selectedOptions?.size,
          colorCode: selectedOptions?.color.color,
        }}
      />
    </>
  );
}

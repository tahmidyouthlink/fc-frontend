import { FaRegBell } from "react-icons/fa6";
import { LuCheckCircle2 } from "react-icons/lu";
import { useAuth } from "@/app/contexts/auth";
import NotifyMeModal from "./NotifyMeModal";

export default function NotifyMeButton({
  notifyVariants,
  productId,
  productVariantSku,
  selectedOptions,
  isNotifyMeModalOpen,
  setIsNotifyMeModalOpen,
}) {
  const { userData } = useAuth();
  let isUserSubscribed;

  if (!selectedOptions?.size || productVariantSku !== 0) return;
  if (!userData) {
    isUserSubscribed = false;
  } else {
    const correspondingVariant = notifyVariants?.find(
      (variant) =>
        variant.productId === productId &&
        variant.size === selectedOptions?.size &&
        variant.colorCode === selectedOptions?.color.color,
    );

    isUserSubscribed = correspondingVariant?.emails?.some(
      (user) => user.email === userData.email && !user.notified,
    );
  }

  return (
    <>
      {!isUserSubscribed ? (
        <button
          onClick={() => setIsNotifyMeModalOpen(true)}
          className="flex items-center gap-1.5 rounded-[4px] bg-[var(--color-tertiary-500)] px-3 py-2.5 text-[13px]/[1] font-semibold text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-tertiary-600)]"
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

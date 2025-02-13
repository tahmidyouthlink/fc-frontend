import { useState } from "react";
import { LuBadge } from "react-icons/lu";
import { TiStarOutline } from "react-icons/ti";
import DiscountModal from "../ui/DiscountModal";

export default function ProductSpecialOfferButton({
  discountTitle,
  discountAmount,
  isEligibleForSpecialOffer,
  savedAmount,
  discountMinAmount,
  discountMaxAmount,
}) {
  const [isSpecialOfferModalOpen, setIsSpecialOfferModalOpen] = useState(false);

  return (
    <>
      {/* Special Offer Button */}
      <button
        className="flex h-9 items-center gap-1.5 rounded-lg bg-[#a138b1] px-2 font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color] duration-300 ease-in-out hover:bg-[#852c93] xl:hidden"
        onClick={() => setIsSpecialOfferModalOpen(true)}
      >
        <div className="relative h-9 w-6">
          <LuBadge className="h-full w-full object-contain" />
          <TiStarOutline className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
        </div>
        <p className="text-nowrap text-[13px]">Special Offer Available!</p>
      </button>
      {/* Special Offer Modal */}
      <DiscountModal
        isDiscountModalOpen={isSpecialOfferModalOpen}
        setIsDiscountModalOpen={setIsSpecialOfferModalOpen}
        discountTitle={discountTitle}
        isEligibleForDiscount={isEligibleForSpecialOffer}
        discountAmount={discountAmount}
        savedAmount={savedAmount}
        discountMinAmount={discountMinAmount}
        discountMaxAmount={discountMaxAmount}
      />
    </>
  );
}

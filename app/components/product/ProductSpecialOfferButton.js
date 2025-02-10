import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { LuBadge } from "react-icons/lu";
import { TiStarOutline } from "react-icons/ti";

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
      <Modal
        className="xl:hidden"
        isOpen={isSpecialOfferModalOpen}
        onOpenChange={setIsSpecialOfferModalOpen}
        size="md"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-base font-semibold uppercase text-neutral-700">
                {discountTitle}
              </ModalHeader>
              <ModalBody className="-mt-5 mb-3">
                <div>
                  <hr className="mb-2.5 mt-0.5 h-0.5 w-full bg-neutral-100" />
                  <div className="space-y-3.5 text-neutral-600">
                    <div className="flex items-center gap-x-1.5">
                      <svg
                        width={isEligibleForSpecialOffer ? "60px" : "44px"}
                        height={isEligibleForSpecialOffer ? "60px" : "44px"}
                        viewBox="0 0 24 24"
                        id="magicoon-Filled"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#57944e"
                      >
                        <g strokeWidth="0"></g>
                        <g strokeLinecap="round" strokeLinejoin="round"></g>
                        <g>
                          <title>discount</title>
                          <g>
                            <path d="M20.62,9.869l-.58-.58a1.5,1.5,0,0,1-.44-1.06v-.82A3.013,3.013,0,0,0,16.59,4.4h-.82a1.458,1.458,0,0,1-1.06-.44l-.58-.58a3.024,3.024,0,0,0-4.26,0l-.58.58a1.458,1.458,0,0,1-1.06.44H7.41A3.013,3.013,0,0,0,4.4,7.409v.82a1.458,1.458,0,0,1-.44,1.06l-.58.58a3.018,3.018,0,0,0,0,4.26l.58.58a1.458,1.458,0,0,1,.44,1.06v.82A3.013,3.013,0,0,0,7.41,19.6h.82a1.458,1.458,0,0,1,1.06.44l.58.58a3.018,3.018,0,0,0,4.26,0l.58-.58a1.458,1.458,0,0,1,1.06-.44h.82a3.013,3.013,0,0,0,3.01-3.01v-.82a1.5,1.5,0,0,1,.44-1.06l.58-.58a3.018,3.018,0,0,0,0-4.26ZM9.5,8.249A1.25,1.25,0,1,1,8.25,9.5,1.25,1.25,0,0,1,9.5,8.249Zm5,7.5a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,14.5,15.749Zm1.21-6.04-6,6A1.024,1.024,0,0,1,9,16a1.042,1.042,0,0,1-.71-.29,1.008,1.008,0,0,1,0-1.42l6-6a1,1,0,1,1,1.42,1.42Z"></path>
                          </g>
                        </g>
                      </svg>
                      <div>
                        <p className="text-lg/[1] font-bold text-[#57944e]">
                          Save {discountAmount}
                        </p>
                        {isEligibleForSpecialOffer && (
                          <p className="text-[13px] font-semibold text-[#57944e]">
                            Kudos! You&apos;ve saved ৳{" "}
                            {savedAmount?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {(!!discountMinAmount || !!discountMaxAmount) && (
                      <div>
                        <p className="mb-1 text-[13px] font-semibold">
                          Terms & Conditions:
                        </p>
                        <ul className="text-[13px]">
                          {!!discountMaxAmount && (
                            <li>
                              Discount up to ৳{" "}
                              {Number(discountMaxAmount)?.toLocaleString()}*
                            </li>
                          )}
                          {!!discountMinAmount && (
                            <li>
                              Valid for a minimum order of ৳{" "}
                              {Number(discountMinAmount)?.toLocaleString()}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

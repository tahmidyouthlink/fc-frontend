import { Tooltip } from "@nextui-org/react";

export default function CheckoutDiscountTooptip({
  discountTitle,
  discountAmount,
  isEligibleForSpecialOffer,
  savedAmount,
  discountMinAmount,
  discountMaxAmount,
  children,
}) {
  return (
    <Tooltip
      classNames={{
        content: ["p-4 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]"],
      }}
      motionProps={{
        variants: {
          exit: {
            opacity: 0,
            transition: {
              duration: 0.3,
              ease: "easeIn",
            },
          },
          enter: {
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
        },
      }}
      shouldFlip
      placement="bottom-start"
      content={
        <div>
          <h4 className="font-semibold uppercase text-neutral-700">
            {discountTitle}
          </h4>
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
                <p className="text-lg/[1] font-bold text-[var(--color-primary-900)]">
                  Save {discountAmount}
                </p>
                {isEligibleForSpecialOffer && (
                  <p className="text-[13px] font-semibold text-[var(--color-primary-900)]">
                    Kudos! You`&apos;`ve saved ৳ {savedAmount?.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            {(!!discountMinAmount || !!discountMaxAmount) && (
              <div className="text-[13px]">
                <p className="mb-1 font-semibold">Terms & Conditions:</p>
                <ul>
                  {discountMaxAmount && (
                    <li>
                      Discount up to ৳ {discountMaxAmount?.toLocaleString()}*
                    </li>
                  )}
                  {discountMinAmount && (
                    <li>
                      Valid for a minimum order of ৳{" "}
                      {discountMinAmount?.toLocaleString()}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
}

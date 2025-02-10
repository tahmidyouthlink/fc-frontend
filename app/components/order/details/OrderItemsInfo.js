import DiscountTooptip from "../../ui/DiscountTooltip";

export default function OrderItemsInfo({
  totalSpecialOfferDiscount,
  promoInfo,
  subtotal,
  shippingCharge,
  total,
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h5 className="text-neutral-400">Subtotal</h5>
        <span>৳ {subtotal?.toLocaleString()}</span>
      </div>
      {!!totalSpecialOfferDiscount && (
        <div className="flex justify-between">
          <h5 className="text-neutral-400">Special Offer</h5>
          <span className="text-right text-red-600">
            - ৳ {totalSpecialOfferDiscount?.toLocaleString()}
          </span>
        </div>
      )}
      {!!promoInfo && (
        <div className="flex justify-between">
          <h5 className="text-neutral-400">
            Promo (
            <DiscountTooptip
              discountTitle={promoInfo?.promoCode}
              discountAmount={
                promoInfo?.promoDiscountType === "Percentage"
                  ? promoInfo?.promoDiscountValue + "%"
                  : "৳ " + promoInfo?.promoDiscountValue
              }
              isEligibleForSpecialOffer={true}
              savedAmount={promoInfo?.appliedPromoDiscount}
            >
              <span className="cursor-default text-[#57944e] underline underline-offset-2">
                {promoInfo?.promoCode}
              </span>
            </DiscountTooptip>
            )
          </h5>
          <span className="text-right text-red-600">
            - ৳{" "}
            {`${promoInfo?.appliedPromoDiscount?.toLocaleString()}${
              promoInfo?.discountType === "percentage"
                ? ` (${promoInfo?.discountAmount?.toLocaleString()}%)`
                : ""
            }`}
          </span>
        </div>
      )}
      <div className="flex justify-between">
        <h5 className="text-neutral-400">Shipping Charge</h5>
        <span>৳ {shippingCharge?.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm text-neutral-700 md:text-base">
        <h5>Paid Amount</h5>
        <span>৳ {total?.toLocaleString()}</span>
      </div>
    </div>
  );
}

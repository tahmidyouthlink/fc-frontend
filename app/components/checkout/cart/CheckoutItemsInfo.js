import { useEffect } from "react";
import { useLoading } from "@/app/contexts/loading";
import {
  calculatePromoDiscount,
  calculateShippingCharge,
  calculateSubtotal,
  calculateTotalSpecialOfferDiscount,
  getProductSpecialOffer,
} from "@/app/utils/orderCalculations";
import useShippingZones from "@/app/hooks/useShippingZones";
import DiscountTooptip from "../../ui/DiscountTooltip";

export default function CheckoutItemsInfo({
  productList,
  cartItems,
  specialOffers,
  userPromoCode,
  isPromoCodeValid,
  selectedCity,
  selectedDeliveryType,
}) {
  const { setIsPageLoading } = useLoading();
  const [shippingZones, isShippingZonesLoading, shippingZonesRefetch] =
    useShippingZones();
  const subtotal = calculateSubtotal(productList, cartItems, specialOffers);
  const totalSpecialOfferDiscount = calculateTotalSpecialOfferDiscount(
    productList,
    cartItems,
    specialOffers,
  );
  const promoDiscount = calculatePromoDiscount(
    productList,
    cartItems,
    userPromoCode,
    specialOffers,
  );
  const shippingCharge = calculateShippingCharge(
    selectedCity,
    selectedDeliveryType,
    shippingZones,
  );
  const total =
    subtotal -
    totalSpecialOfferDiscount -
    promoDiscount +
    (selectedCity === "Dhaka" && selectedDeliveryType === "STANDARD"
      ? 0
      : shippingCharge);

  const allSpecialOfferValues = [
    ...new Set(
      cartItems.map((cartItem) => {
        const product = productList?.find(
          (product) => product._id === cartItem?._id,
        );
        const specialOffer = getProductSpecialOffer(
          product,
          specialOffers,
          subtotal,
        );

        if (specialOffer) {
          if (specialOffer.offerDiscountType === "Percentage") {
            return specialOffer.offerDiscountValue + "%";
          } else {
            return "৳ " + specialOffer.offerDiscountValue;
          }
        }
      }),
    ),
  ]
    ?.filter((value) => !!value)
    ?.join(", ");

  useEffect(() => {
    setIsPageLoading(isShippingZonesLoading || !shippingZones?.length);

    return () => setIsPageLoading(false);
  }, [isShippingZonesLoading, setIsPageLoading, shippingZones]);

  return (
    <div className="space-y-2.5 [&>div>*]:z-[1] [&>div>span]:text-right [&>div]:flex [&>div]:justify-between">
      <div>
        <h5 className="text-neutral-500">Subtotal</h5>
        <span>৳ {subtotal.toLocaleString()}</span>
      </div>
      {!!totalSpecialOfferDiscount && (
        <div>
          <h5 className="text-neutral-500">
            Special Offer
            {/* {allSpecialOfferValues.includes(",") ? "s" : ""} */}
            {/* {" "}({allSpecialOfferValues}) */}
          </h5>
          <span className="text-red-600">{`- ৳ ${totalSpecialOfferDiscount.toLocaleString()}`}</span>
        </div>
      )}
      {isPromoCodeValid && (
        <div>
          <h5 className="text-neutral-500">
            Promo (
            <DiscountTooptip
              discountTitle={userPromoCode?.promoCode}
              discountAmount={
                userPromoCode?.promoDiscountType === "Percentage"
                  ? userPromoCode?.promoDiscountValue + "%"
                  : "৳ " + userPromoCode?.promoDiscountValue
              }
              discountMinAmount={userPromoCode?.minAmount}
              discountMaxAmount={userPromoCode?.maxAmount}
            >
              <span className="cursor-default text-[#57944e] underline underline-offset-2">
                {userPromoCode?.promoCode}
              </span>
            </DiscountTooptip>
            )
          </h5>
          <span className="text-red-600">
            - ৳{" "}
            {`${Number(promoDiscount).toLocaleString()}${
              userPromoCode?.promoDiscountType === "Percentage"
                ? ` (${Number(userPromoCode?.promoDiscountValue)?.toLocaleString()}%)`
                : ""
            }`}
          </span>
        </div>
      )}
      {!!selectedCity &&
        (selectedCity !== "Dhaka" || !!selectedDeliveryType) && (
          <div>
            <h5 className="text-neutral-500">Shipping Charge</h5>
            <span>
              {selectedCity === "Dhaka" &&
              selectedDeliveryType === "STANDARD" ? (
                <>
                  <span className="relative h-fit before:absolute before:-left-0.5 before:top-1/2 before:h-0.5 before:w-[calc(100%+4px)] before:bg-neutral-400 before:content-['']">{`৳ ${shippingCharge?.toLocaleString()}`}</span>
                  <span className="ml-1.5">FREE</span>
                </>
              ) : (
                `৳ ${shippingCharge?.toLocaleString()}`
              )}
            </span>
          </div>
        )}
      {!!selectedCity &&
        (selectedCity !== "Dhaka" || !!selectedDeliveryType) && (
          <div className="text-sm text-neutral-700 md:text-base">
            <h5>Payable Amount</h5>
            <span>৳ {total.toLocaleString()}</span>
          </div>
        )}
    </div>
  );
}

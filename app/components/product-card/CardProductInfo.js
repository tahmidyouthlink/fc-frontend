import {
  calculateFinalPrice,
  checkIfOnlyRegularDiscountIsAvailable,
} from "@/app/utils/orderCalculations";
import TransitionLink from "../ui/TransitionLink";

export default function CardProductInfo({
  product,
  specialOffers,
  needsWhiteBackgroundText,
}) {
  const isOnlyRegularDiscountAvailable = checkIfOnlyRegularDiscountIsAvailable(
    product,
    specialOffers,
  );

  return (
    <TransitionLink
      href={`/product/${product.productTitle.split(" ").join("-").toLowerCase()}`}
      className="block pt-3"
    >
      <div
        className={`flex w-fit gap-x-2 text-sm xl:text-base [&_p]:w-fit ${needsWhiteBackgroundText ? "bg-white" : ""}`}
      >
        <p
          className={`relative w-fit font-semibold ${isOnlyRegularDiscountAvailable ? "text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']" : "text-neutral-800"}`}
        >
          ৳ {Number(product.regularPrice).toLocaleString()}
        </p>
        {isOnlyRegularDiscountAvailable && (
          <p className="font-semibold text-neutral-800">
            ৳ {calculateFinalPrice(product, specialOffers).toLocaleString()}
          </p>
        )}
      </div>
      <h3
        className={`line-clamp-1 w-fit text-sm font-semibold text-neutral-800 xl:text-base ${needsWhiteBackgroundText ? "bg-white" : ""}`}
      >
        {product.productTitle}
      </h3>
      <p
        className={`mt-1.5 line-clamp-1 w-fit text-[11px] text-neutral-700 xl:text-[13px] ${needsWhiteBackgroundText ? "bg-white" : ""}`}
      >
        {product.category}
      </p>
    </TransitionLink>
  );
}

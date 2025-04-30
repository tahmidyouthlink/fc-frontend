import {
  calculateFinalPrice,
  checkIfOnlyRegularDiscountIsAvailable,
} from "@/app/utils/orderCalculations";
import TransitionLink from "../ui/TransitionLink";

export default function CardProductInfo({
  product,
  specialOffers,
  isProductOutOfStock,
  isProductLimitedStock,
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
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex w-fit gap-x-2 text-nowrap text-sm xl:text-base [&_p]:w-fit">
          <p
            className={`relative w-fit text-nowrap font-semibold ${isOnlyRegularDiscountAvailable ? "text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']" : "text-neutral-800"}`}
          >
            ৳ {Number(product.regularPrice).toLocaleString()}
          </p>
          {isOnlyRegularDiscountAvailable && (
            <p className="font-semibold text-neutral-800">
              ৳ {calculateFinalPrice(product, specialOffers).toLocaleString()}
            </p>
          )}
        </div>
        {isProductLimitedStock && !isProductOutOfStock && (
          <p className="line-clamp-1 w-fit animate-pulse text-[11px]/[1] font-semibold text-red-500 sm:text-xs xl:text-[13px]/[1]">
            Low Stock
          </p>
        )}
      </div>
      <h3 className="line-clamp-1 w-fit text-sm font-semibold text-neutral-800 xl:text-base">
        {product.productTitle}
      </h3>
      <p className="mt-1.5 line-clamp-1 w-fit text-[11px] text-neutral-700 xl:text-[13px]">
        {product.category}
      </p>
    </TransitionLink>
  );
}

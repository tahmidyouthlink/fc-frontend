import Image from "next/image";
import { LuBadge } from "react-icons/lu";
import { TiStarOutline } from "react-icons/ti";
import {
  calculateFinalPrice,
  checkIfOnlyRegularDiscountIsAvailable,
} from "@/app/utils/orderCalculations";
import { getProductVariantSku } from "@/app/utils/productSkuCalculation";
import thunderShape from "@/public/shapes/thunder-with-stroke.svg";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import ProductSizeSelection from "./ProductSizeSelection";
import ProductColorSelection from "./ProductColorSelection";
import ProductQuantitySelection from "./ProductQuantitySelection";
import ProductCartButton from "./ProductCartButton";
import ProductWishlistButton from "./ProductWishlistButton";
import ProductSizeGuideButton from "./ProductSizeGuideButton";
import ProductSpecialOfferButton from "./ProductSpecialOfferButton";
import DiscountTooptip from "../ui/DiscountTooltip";

export default function ProductInfoOverview({
  product,
  specialOffers,
  primaryLocation,
  selectedOptions,
  setSelectedOptions,
  setActiveImageIndex,
  setNumOfTimesThumbnailsMoved,
  hasSpecialOffer,
  specialOffer,
}) {
  const productVariantSku = getProductVariantSku(
    product?.productVariants,
    primaryLocation,
    selectedOptions?.color?._id,
    selectedOptions?.size,
  );
  const isOnlyRegularDiscountAvailable = checkIfOnlyRegularDiscountIsAvailable(
    product,
    specialOffers,
  );

  return (
    <section>
      {/* Product Title (with a shape/SVG) */}
      <h1 className="relative mb-2.5 w-fit text-2xl font-bold sm:text-3xl">
        {product?.productTitle}
        {/* Shape/SVG (thunder) */}
        <div className="absolute -right-1.5 bottom-1/4 aspect-square w-8 translate-x-full rotate-[26deg] lg:w-9">
          <Image
            src={thunderShape}
            alt="Thunder shape"
            className="object-contain"
            height={0}
            width={0}
            sizes="25vw"
          />
        </div>
      </h1>
      {/* Product Price */}
      <div className="relative mb-6 flex items-center gap-x-3 text-lg font-bold sm:text-xl">
        {/* Regular Price (with strikethrough, if discount is applicable) */}
        <p
          className={
            isOnlyRegularDiscountAvailable
              ? "relative text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']"
              : "text-neutral-600"
          }
        >
          ৳ {Number(product?.regularPrice).toLocaleString()}
        </p>
        {/* Discounted Price (if available) */}
        {isOnlyRegularDiscountAvailable && (
          <p className="text-neutral-600">
            ৳ {calculateFinalPrice(product, specialOffers).toLocaleString()}
          </p>
        )}
        {hasSpecialOffer && (
          <>
            <ProductSpecialOfferButton
              discountTitle={specialOffer?.offerTitle}
              discountAmount={
                specialOffer?.offerDiscountType === "Percentage"
                  ? specialOffer?.offerDiscountValue + "%"
                  : "৳ " + specialOffer?.offerDiscountValue
              }
              discountMinAmount={specialOffer?.minAmount}
              discountMaxAmount={specialOffer?.maxAmount}
            />
            <div className="max-xl:hidden">
              <DiscountTooptip
                discountTitle={specialOffer?.offerTitle}
                discountAmount={
                  specialOffer?.offerDiscountType === "Percentage"
                    ? specialOffer?.offerDiscountValue + "%"
                    : "৳ " + specialOffer?.offerDiscountValue
                }
                discountMinAmount={specialOffer?.minAmount}
                discountMaxAmount={specialOffer?.maxAmount}
              >
                <div className="flex h-9 cursor-default items-center gap-1.5 rounded-lg bg-[#a138b1] px-2 font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color] duration-300 ease-in-out">
                  <div className="relative h-9 w-6">
                    <LuBadge className="h-full w-full object-contain" />
                    <TiStarOutline className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
                  </div>
                  <p className="text-nowrap text-[13px]">
                    Special Offer Available!
                  </p>
                </div>
              </DiscountTooptip>
            </div>
          </>
        )}
        {/* Mesh Gradient */}
        <div className="absolute -bottom-48 -right-10 z-[-1] size-32 -translate-y-1/2 rounded-full bg-[#ebc6a6] opacity-75 blur-3xl sm:max-md:right-16 xl:right-24" />
      </div>
      <ProductSizeSelection
        productSizes={product?.allSizes}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <ProductColorSelection
        productColors={getImageSetsBasedOnColors(product?.productVariants)?.map(
          (imgSet) => imgSet.color,
        )}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        setActiveImageIndex={setActiveImageIndex}
        setNumOfTimesThumbnailsMoved={setNumOfTimesThumbnailsMoved}
      />
      <ProductQuantitySelection
        productVariantSku={productVariantSku}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      {/* Call to Action Buttons */}
      <div className="mb-7 flex gap-2 max-lg:flex-wrap [&>button>svg]:text-lg [&>button]:rounded-lg [&>button]:px-5 [&>button]:py-6 [&>button]:text-sm [&>button]:font-semibold [&>button]:text-neutral-600 [&>button]:duration-300 hover:[&>button]:opacity-100">
        <ProductCartButton
          productId={product?._id}
          defaultColor={
            product?.availableColors[Object.keys(product?.availableColors)[0]]
          }
          productVariantSku={productVariantSku}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <ProductWishlistButton productId={product?._id} />
        <ProductSizeGuideButton
          sizeGuideImageUrl={product?.sizeGuideImageUrl}
        />
      </div>
    </section>
  );
}

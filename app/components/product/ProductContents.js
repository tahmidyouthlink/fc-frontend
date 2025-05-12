import { useEffect, useState } from "react";
import {
  checkIfSpecialOfferIsAvailable,
  getProductSpecialOffer,
} from "@/app/utils/orderCalculations";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import ProductImageGallery from "./ProductImageGallery";
import ExpandedImagesModal from "../shared/ExpandedImageModal";
import ProductInfo from "./ProductInfo";

export default function ProductContents({
  product,
  specialOffers,
  primaryLocation,
  selectedOptions,
  setSelectedOptions,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [numOfTimesThumbnailsMoved, setNumOfTimesThumbnailsMoved] = useState(0);
  const isSpecialOfferIsAvailable = checkIfSpecialOfferIsAvailable(
    product,
    specialOffers,
  );
  const specialOffer = !isSpecialOfferIsAvailable
    ? null
    : getProductSpecialOffer(product, specialOffers, "NA");
  const imageSets = getImageSetsBasedOnColors(product?.productVariants);
  const activeImageSet = imageSets?.find(
    (imageSet) => imageSet?.color?._id === selectedOptions?.color?._id,
  );
  const activeImageUrl = activeImageSet?.images[activeImageIndex];

  useEffect(() => {
    if (!!product)
      setSelectedOptions({
        color:
          product?.availableColors[Object.keys(product?.availableColors)[0]],
        size: undefined,
        quantity: 1,
      });
  }, [product, setSelectedOptions]);

  return (
    <div className="px-5 pb-[var(--section-padding)] sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
      <div className="relative md:flex md:gap-x-7">
        <ProductImageGallery
          productTitle={product?.productTitle}
          activeImageSet={activeImageSet}
          activeImageUrl={activeImageUrl}
          selectedColorLabel={selectedOptions?.color?.label}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          setIsImageExpanded={setIsImageExpanded}
          numOfTimesThumbnailsMoved={numOfTimesThumbnailsMoved}
          setNumOfTimesThumbnailsMoved={setNumOfTimesThumbnailsMoved}
          isTrending={product?.trending === "Yes"}
          isNewArrival={product?.newArrival === "Yes"}
          hasDiscount={!!Number(product?.discountValue)}
          discount={{
            type: product?.discountType,
            text:
              product?.discountType === "Percentage"
                ? `${product?.discountValue}%`
                : `৳ ${product?.discountValue}`,
          }}
          hasSpecialOffer={isSpecialOfferIsAvailable}
          specialOffer={specialOffer}
        />
        <ExpandedImagesModal
          modalFor="products"
          productTitle={product?.productTitle}
          selectedColorLabel={selectedOptions?.color?.label}
          expandedImgUrl={activeImageUrl}
          totalImages={activeImageSet?.images?.length}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          isImageExpanded={isImageExpanded}
          setIsImageExpanded={setIsImageExpanded}
        />
        <ProductInfo
          product={product}
          specialOffers={specialOffers}
          primaryLocation={primaryLocation}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          setActiveImageIndex={setActiveImageIndex}
          setNumOfTimesThumbnailsMoved={setNumOfTimesThumbnailsMoved}
          hasSpecialOffer={isSpecialOfferIsAvailable}
          specialOffer={specialOffer}
        />
      </div>
    </div>
  );
}

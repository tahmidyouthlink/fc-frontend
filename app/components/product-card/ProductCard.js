import { useEffect } from "react";
import { useLoading } from "@/app/contexts/loading";
import useOffers from "@/app/hooks/useOffers";
import useLocations from "@/app/hooks/useLocations";
import {
  checkIfProductIsLimitedStock,
  CheckIfProductIsOutOfStock,
} from "@/app/utils/productSkuCalculation";
import {
  checkIfSpecialOfferIsAvailable,
  getProductSpecialOffer,
} from "@/app/utils/orderCalculations";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import ProductBadges from "../ui/badges/ProductBadges";
import CardProductThumbnail from "./CardProductThumbnail";
import CardProductInfo from "./CardProductInfo";
import CardButtons from "./CardButtons";

export default function ProductCard({
  product,
  isAddToCartModalOpen,
  setIsAddToCartModalOpen,
  setSelectedAddToCartProduct,
  shouldBeHidden,
  isAllowedToShowLimitedStock,
}) {
  const { setIsPageLoading } = useLoading();
  const [specialOffers, isSpecialOffersLoading, specialOffersRefetch] =
    useOffers();
  const [locationList, isLocationListLoading, locationRefetch] = useLocations();
  const primaryLocation = locationList?.find(
    (location) => location.isPrimaryLocation == true,
  )?.locationName;
  const isProductOutOfStock = CheckIfProductIsOutOfStock(
    product?.productVariants,
    primaryLocation,
  );
  const isProductLimitedStock = checkIfProductIsLimitedStock(
    product?.productVariants,
    primaryLocation,
  );

  useEffect(() => {
    setIsPageLoading(
      isSpecialOffersLoading ||
        !specialOffers?.length ||
        isLocationListLoading ||
        !locationList?.length,
    );

    return () => setIsPageLoading(false);
  }, [
    isSpecialOffersLoading,
    specialOffers,
    isLocationListLoading,
    locationList,
    setIsPageLoading,
  ]);

  return (
    <div
      className={`relative ${shouldBeHidden ? "max-sm:hidden" : ""} ${!isAddToCartModalOpen ? "[&>div>a_img]:hover:scale-110 [&_:is(#card-buttons,#color-select)]:hover:opacity-100" : ""} ${isProductOutOfStock ? "[&>div]:hover:translate-x-0" : "[&_#card-buttons]:hover:translate-x-0 [&_#color-select]:hover:translate-y-0"}`}
    >
      <CardProductThumbnail
        productTitle={product.productTitle}
        productColors={product.availableColors}
        isProductOutOfStock={isProductOutOfStock}
        imageSets={getImageSetsBasedOnColors(product.productVariants)}
      />
      <CardProductInfo
        product={product}
        specialOffers={specialOffers}
        isProductOutOfStock={isProductOutOfStock}
        isProductLimitedStock={
          isAllowedToShowLimitedStock && isProductLimitedStock
        }
      />
      <ProductBadges
        hasSpecialOffer={checkIfSpecialOfferIsAvailable(product, specialOffers)}
        specialOffer={getProductSpecialOffer(product, specialOffers, "NA")}
        hasDiscount={!!Number(product.discountValue)}
        discount={{
          type: product.discountType,
          text:
            product.discountType === "Percentage"
              ? `${product.discountValue}%`
              : `৳ ${product.discountValue}`,
        }}
      />
      <CardButtons
        product={product}
        isProductOutOfStock={isProductOutOfStock}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        setSelectedAddToCartProduct={setSelectedAddToCartProduct}
      />
    </div>
  );
}

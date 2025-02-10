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
import TransitionLink from "../ui/TransitionLink";
import ProductBadges from "../ui/badges/ProductBadges";
import CardProductThumbnail from "./CardProductThumbnail";
import CardProductInfo from "./CardProductInfo";
import CardButtons from "./CardButtons";
import CardColorSelectionTool from "./CardColorSelectionTool";

export default function ProductCard({
  product,
  needsWhiteBackgroundText,
  isAddToCartModalOpen,
  setIsAddToCartModalOpen,
  setSelectedAddToCartProduct,
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
  ]);

  return (
    <div
      className={`relative ${!isAddToCartModalOpen ? "[&>div>a_img]:hover:scale-110 [&_:is(#card-buttons,#color-select)]:hover:opacity-100" : ""} ${isProductOutOfStock ? "[&>div]:hover:translate-x-0" : "[&_#card-buttons]:hover:translate-x-0 [&_#color-select]:hover:translate-y-0"}`}
    >
      <CardProductThumbnail
        product={product}
        isProductOutOfStock={isProductOutOfStock}
        isProductLimitedStock={isProductLimitedStock}
        imageSets={getImageSetsBasedOnColors(product.productVariants)}
      />
      <CardProductInfo
        product={product}
        specialOffers={specialOffers}
        needsWhiteBackgroundText={needsWhiteBackgroundText}
      />
      <ProductBadges
        isTrending={product.salesThisMonth >= 10}
        isNewArrival={product.newArrival === "Yes"}
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
      {/* {!isProductOutOfStock && (
        <CardColorSelectionTool
          productTitle={product.productTitle}
          productColors={product.availableColors}
        />
      )} */}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import SimilarProducts from "@/app/components/product/SimilarProducts";
import CompleteOutfitProducts from "@/app/components/product/CompleteOutfitProducts";
import RecentlyViewedProducts from "@/app/components/product/RecentlyViewedProducts";

export default function ProductRelatedContents({
  products,
  product,
  primaryLocation,
}) {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

  // Load recently viewed products
  useEffect(() => {
    if (products?.length && !!product) {
      let recentlyViewedProductIds =
        JSON.parse(localStorage.getItem("recentlyViewedProducts")) || [];

      recentlyViewedProductIds = !recentlyViewedProductIds?.includes(
        product?._id,
      )
        ? recentlyViewedProductIds
        : recentlyViewedProductIds?.filter(
            (recentlyViewedProductId) =>
              recentlyViewedProductId !== product?._id,
          );

      setRecentlyViewedProducts(
        products
          ?.filter(
            (availableProduct) =>
              availableProduct.status === "active" &&
              recentlyViewedProductIds?.some(
                (recentlyViewedProductId) =>
                  availableProduct._id === recentlyViewedProductId,
              ),
          )
          .slice(0, 8),
      );
      recentlyViewedProductIds?.unshift(product?._id);
      if (recentlyViewedProductIds?.length === 10)
        recentlyViewedProductIds?.pop();
      localStorage.setItem(
        "recentlyViewedProducts",
        JSON.stringify(recentlyViewedProductIds),
      );
    }
  }, [product, products]);

  const completeOutfitProducts = products
    ?.filter((availableProduct) =>
      product?.restOfOutfit.some(
        (linkedProduct) =>
          availableProduct._id === linkedProduct.id &&
          availableProduct.status === "active",
      ),
    )
    .slice(0, 8);

  const similarProducts = products
    ?.filter(
      (availableProduct) =>
        availableProduct.category === product?.category &&
        availableProduct._id !== product?._id &&
        availableProduct.status === "active",
    )
    .slice(0, 8);

  return (
    <>
      {/* Complete Your Outfit Section */}
      {!!completeOutfitProducts?.length && (
        <CompleteOutfitProducts
          completeOutfitProducts={completeOutfitProducts}
          primaryLocation={primaryLocation}
        />
      )}
      {/* Similar Products Section */}
      {!!similarProducts?.length && (
        <SimilarProducts
          similarProducts={similarProducts}
          hasCompleteOutfitSection={!!completeOutfitProducts?.length}
          hasRecentlyViewedSection={!!recentlyViewedProducts?.length}
          primaryLocation={primaryLocation}
        />
      )}
      {/* Recently Viewed Products Section */}
      {!!recentlyViewedProducts?.length && (
        <RecentlyViewedProducts
          recentlyViewedProducts={recentlyViewedProducts}
          hasCompleteOutfitSection={!!completeOutfitProducts?.length}
          hasSimilarSection={!!similarProducts?.length}
          primaryLocation={primaryLocation}
        />
      )}
    </>
  );
}

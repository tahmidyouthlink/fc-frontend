"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import { useLoading } from "@/app/contexts/loading";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import useOffers from "@/app/hooks/useOffers";
import useLocations from "@/app/hooks/useLocations";
import ProductContents from "@/app/components/product/ProductContents";
import SimilarProducts from "@/app/components/product/SimilarProducts";
import CompleteOutfitProducts from "@/app/components/product/CompleteOutfitProducts";
import RecentlyViewedProducts from "@/app/components/product/RecentlyViewedProducts";

export default function Product({ params: { slug } }) {
  const router = useRouter();
  const { setIsPageLoading } = useLoading();
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [productList, isProductListLoading, refetch] = useProductsInformation();
  const [specialOffers, isSpecialOffersLoading, specialOffersRefetch] =
    useOffers();
  const [locationList, isLocationListLoading, locationRefetch] = useLocations();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

  const product = productList?.find(
    (product) =>
      product?.productTitle?.split(" ")?.join("-")?.toLowerCase() === slug,
  );
  const primaryLocation = locationList?.find(
    (location) => location.isPrimaryLocation == true,
  )?.locationName;

  useEffect(() => {
    if (
      !isProductListLoading &&
      !!productList?.length &&
      (!product || product.status !== "active")
    )
      router.push("/shop");
  }, [isProductListLoading, product, productList, router]);

  // Load recently viewed products
  useEffect(() => {
    if (productList?.length && !!product) {
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
        productList
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
  }, [product, productList]);

  const completeOutfitProducts = productList
    ?.filter((availableProduct) =>
      product?.restOfOutfit.some(
        (linkedProduct) =>
          availableProduct._id === linkedProduct.id &&
          availableProduct.status === "active",
      ),
    )
    .slice(0, 8);

  const similarProducts = productList
    ?.filter(
      (availableProduct) =>
        availableProduct.category === product?.category &&
        availableProduct._id !== product?._id &&
        availableProduct.status === "active",
    )
    .slice(0, 8);

  useEffect(() => {
    setIsPageLoading(
      isProductListLoading ||
        !productList?.length ||
        isSpecialOffersLoading ||
        !specialOffers?.length ||
        isLocationListLoading ||
        !locationList?.length,
    );

    return () => setIsPageLoading(false);
  }, [
    isProductListLoading,
    productList,
    isSpecialOffersLoading,
    specialOffers,
    isLocationListLoading,
    locationList,
    setIsPageLoading,
  ]);

  return (
    <main className="relative overflow-hidden">
      {/* Mesh Gradient */}
      <div className="relative h-full w-full">
        <div className="fixed left-[2.5%] top-1/2 animate-blob bg-[#d7f8d3] sm:top-1/2 sm:bg-[#f8dfcb]" />
        <div className="fixed left-[42.5%] top-[5%] animate-blob bg-[#f8dfcb] [animation-delay:1s] sm:top-2/3 sm:bg-[#d7f8d3]" />
        <div className="fixed left-[80%] top-[15%] animate-blob bg-[#f8dfcb] [animation-delay:2s] max-sm:hidden" />
      </div>
      {/* Shape/SVG (circle with star) */}
      <div className="absolute right-3 top-36 z-[-1] aspect-square w-56 translate-x-1/2 opacity-85 max-[1200px]:hidden">
        <Image
          src={circleWithStarShape}
          alt="circle with star shape"
          className="object-contain"
          height={0}
          width={0}
          sizes="25vw"
        />
      </div>
      <div className="pt-header-h-full-section-pb relative overflow-hidden text-sm [&_img]:pointer-events-none">
        {/* Product Contents Section */}
        <ProductContents
          product={product}
          specialOffers={specialOffers}
          primaryLocation={primaryLocation}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
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
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/app/contexts/loading";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import useCategories from "../hooks/useCategories";
import useLocations from "@/app/hooks/useLocations";
import useHeroBannerImages from "../hooks/useHeroBannerImages";
import { CheckIfProductIsOutOfStock } from "@/app/utils/productSkuCalculation";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import HomeHero from "../components/home/HomeHero";
import HomeCategories from "../components/home/HomeCategories";
import HomeTrending from "../components/home/HomeTrending";
import HomeNewArrival from "../components/home/HomeNewArrival";
import AddToCartModal from "../components/shop/cart/AddToCartModal";
import HomeFeatures from "../components/home/HomeFeatures";

export default function Home() {
  const { setIsPageLoading } = useLoading();
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);
  const [productList, isProductListLoading, productRefetch] =
    useProductsInformation();
  const [categoryList, isCategoryListLoading, categoryListRefetch] =
    useCategories();
  const featuredCategories = categoryList?.filter(
    (category) => category.isFeatured === true,
  );
  const [heroImgs, isHeroImgsLoading, heroImgRefetch] = useHeroBannerImages();
  const [{ leftImgUrl, centerImgUrl, rightImgUrl } = {}] = heroImgs || [];
  const [locationList, isLocationListLoading, locationRefetch] = useLocations();
  const primaryLocation = locationList?.find(
    (location) => location?.isPrimaryLocation == true,
  )?.locationName;
  const trendingProducts = productList
    ?.filter(
      (product) =>
        product?.status === "active" &&
        // product?.salesThisMonth >= 10 &&
        !CheckIfProductIsOutOfStock(product?.productVariants, primaryLocation),
    )
    ?.slice(0, 5);
  const newlyArrivedProducts = productList
    ?.filter(
      (product) =>
        product?.status === "active" &&
        product?.newArrival === "Yes" &&
        !CheckIfProductIsOutOfStock(product?.productVariants, primaryLocation),
    )
    ?.slice(0, 5);

  useEffect(() => {
    setIsPageLoading(
      isProductListLoading ||
        !productList?.length ||
        isCategoryListLoading ||
        !categoryList?.length ||
        isLocationListLoading ||
        !locationList?.length ||
        isHeroImgsLoading ||
        !heroImgs?.length,
    );

    return () => setIsPageLoading(false);
  }, [
    isProductListLoading,
    productList,
    isCategoryListLoading,
    categoryList,
    isLocationListLoading,
    locationList,
    isHeroImgsLoading,
    heroImgs,
    setIsPageLoading,
  ]);

  return (
    <main className="[&_img]:pointer-events-none">
      <HomeHero
        leftImgUrl={leftImgUrl}
        centerImgUrl={centerImgUrl}
        rightImgUrl={rightImgUrl}
      />
      <HomeCategories featuredCategories={featuredCategories} />
      <HomeTrending
        trendingProducts={trendingProducts}
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        setSelectedAddToCartProduct={setSelectedAddToCartProduct}
        getImageSetsBasedOnColors={getImageSetsBasedOnColors}
      />
      <HomeNewArrival
        isAnyTrendingProductAvailable={trendingProducts?.length}
        newlyArrivedProducts={newlyArrivedProducts}
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        setSelectedAddToCartProduct={setSelectedAddToCartProduct}
        getImageSetsBasedOnColors={getImageSetsBasedOnColors}
      />
      <HomeFeatures
        isAnyTrendingProductAvailable={trendingProducts?.length}
        isAnyNewProductAvailable={newlyArrivedProducts?.length}
      />
      <AddToCartModal
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        product={selectedAddToCartProduct}
        primaryLocation={primaryLocation}
      />
    </main>
  );
}

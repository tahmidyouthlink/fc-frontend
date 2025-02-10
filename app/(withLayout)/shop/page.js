"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import thunderShape from "@/public/shapes/thunder-with-stroke.svg";
import { useLoading } from "@/app/contexts/loading";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import useOffers from "@/app/hooks/useOffers";
import useLocations from "@/app/hooks/useLocations";
import {
  calculateFinalPrice,
  checkIfOnlyRegularDiscountIsAvailable,
  checkIfSpecialOfferIsAvailable,
} from "@/app/utils/orderCalculations";
import { CheckIfProductIsOutOfStock } from "@/app/utils/productSkuCalculation";
import Filter from "@/app/components/shop/Filter";
import EmptyShopProducts from "@/app/components/shop/EmptyShopProducts";
import ShopCards from "@/app/components/shop/cards/ShopCards";

export default function Shop() {
  const [isFilterButtonClicked, setIsFilterButtonClicked] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState({
    sortBy: new Set([]),
    filterBy: new Set([]),
    category: new Set([]),
    sizes: new Set([]),
    colors: new Set([]),
    price: {
      min: undefined,
      max: undefined,
    },
  });
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [keyword, setKeyword] = useState("");
  const searchParams = useSearchParams();
  const [productList, isProductListLoading, productRefetch] =
    useProductsInformation();
  const [specialOffers, isSpecialOffersLoading, specialOffersRefetch] =
    useOffers();
  const [locationList, isLocationListLoading, locationRefetch] = useLocations();
  const primaryLocation = locationList?.find(
    (location) => location.isPrimaryLocation == true,
  )?.locationName;
  const { setIsPageLoading } = useLoading();

  const isProductWithinPriceRange = (product) =>
    (!selectedFilterOptions.price.min ||
      selectedFilterOptions.price.min <=
        calculateFinalPrice(product, specialOffers)) &&
    (!selectedFilterOptions.price.max ||
      selectedFilterOptions.price.max >=
        calculateFinalPrice(product, specialOffers));

  const isNoFilterOptionSelected = Object.values(selectedFilterOptions).every(
    (value) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else {
        return !value.min || !value.max;
      }
    },
  );

  const filteredProductCount = filteredProducts?.reduce(
    (accumulator, product) =>
      accumulator + (isProductWithinPriceRange(product) ? 1 : 0),
    0,
  );

  useEffect(() => {
    setKeyword(searchParams.get("search"));
    searchParams.get("filterBy") &&
      setSelectedFilterOptions((prevSelectedValues) => ({
        ...prevSelectedValues,
        filterBy: [searchParams.get("filterBy")],
      }));
    searchParams.get("category") &&
      setSelectedFilterOptions((prevSelectedValues) => ({
        ...prevSelectedValues,
        category: [searchParams.get("category")],
      }));
  }, [searchParams]);

  useEffect(() => {
    if (
      !isProductListLoading &&
      !!productList?.length &&
      !isSpecialOffersLoading &&
      !!specialOffers?.length &&
      !isLocationListLoading &&
      !!locationList?.length
    )
      setFilteredProducts(
        productList
          .filter((product) => {
            return (
              product.status === "active" &&
              (!keyword ||
                product.productTitle
                  .toLowerCase()
                  .includes(keyword.toLowerCase())) &&
              (!selectedFilterOptions.filterBy.length ||
                (selectedFilterOptions.filterBy.includes("Popular") &&
                  product.salesThisMonth >= 10) ||
                (selectedFilterOptions.filterBy.includes("New Arrivals") &&
                  product.newArrival === "Yes") ||
                (selectedFilterOptions.filterBy.includes("Special Offers") &&
                  checkIfSpecialOfferIsAvailable(product, specialOffers)) ||
                (selectedFilterOptions.filterBy.includes("In Stock") &&
                  !CheckIfProductIsOutOfStock(
                    product?.productVariants,
                    primaryLocation,
                  )) ||
                (selectedFilterOptions.filterBy.includes("On Sale") &&
                  checkIfOnlyRegularDiscountIsAvailable(
                    product,
                    specialOffers,
                  ))) &&
              (!selectedFilterOptions.category.length ||
                product.category ===
                  selectedFilterOptions.category.toString()) &&
              (!selectedFilterOptions.sizes.length ||
                selectedFilterOptions.sizes.some((selectedSize) =>
                  product.allSizes.some(
                    (productSize) => productSize == selectedSize,
                  ),
                )) &&
              (!selectedFilterOptions.colors.length ||
                selectedFilterOptions.colors.some((selectedColor) =>
                  product.availableColors.some(
                    (productColor) => productColor.label === selectedColor,
                  ),
                ))
            );
          })
          .sort((productA, productB) => {
            const selectedSortByOption =
              selectedFilterOptions.sortBy.toString();

            if (selectedSortByOption === "Price (Low to High)")
              return (
                calculateFinalPrice(productA, specialOffers) -
                calculateFinalPrice(productB, specialOffers)
              );
            else if (selectedSortByOption === "Price (High to Low)")
              return (
                calculateFinalPrice(productB, specialOffers) -
                calculateFinalPrice(productA, specialOffers)
              );
            else if (selectedSortByOption === "Newest")
              return (
                new Date(productB.publishDate) - new Date(productA.publishDate)
              );
            else return 0;
          }),
      );
  }, [
    productList,
    isProductListLoading,
    specialOffers,
    isSpecialOffersLoading,
    locationList,
    isLocationListLoading,
    selectedFilterOptions,
    keyword,
    searchParams,
    primaryLocation,
  ]);

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
    searchParams,
    setIsPageLoading,
  ]);

  if (!(isProductListLoading || !productList?.length))
    return (
      <main className="relative flex min-h-dvh overflow-hidden pb-16 pt-28 [&_img]:pointer-events-none">
        <div className="absolute -left-3 top-28 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl min-[1200px]:fixed" />
        <div className="absolute -bottom-20 -right-3 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl lg:-bottom-5 min-[1200px]:fixed" />
        <div className="flex min-h-full grow flex-col gap-y-7 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
          {!keyword?.length &&
          Object.values(selectedFilterOptions).every(
            (selectedValue) => !selectedValue.length,
          ) ? (
            <p>
              Displaying {filteredProductCount || "no"} item
              {filteredProductCount > 1 ? "s" : ""}
            </p>
          ) : (
            <p className="relative w-fit">
              {filteredProductCount || "No"} item
              {filteredProductCount > 1 && "s"} found
              {!!keyword && "for" && (
                <span className="font-semibold"> &quot;{keyword}&quot;</span>
              )}
              {Object.values(selectedFilterOptions).some(
                (selectedValue) => selectedValue.length,
              ) && " with these selected filters:"}
              <span className="absolute -right-1 bottom-1/4 block aspect-square w-7 translate-x-full rotate-[26deg] max-sm:hidden">
                <Image
                  src={thunderShape}
                  alt="Thunder shape"
                  className="object-contain"
                  height={0}
                  width={0}
                  sizes="25vw"
                  fill
                />
              </span>
            </p>
          )}
          <button
            className={`relative z-[1] flex w-fit items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[18px] py-3 transition-colors duration-300 ease-in-out hover:bg-[#fbcfb0] ${isFilterButtonClicked ? "hidden" : "block"}`}
            onClick={() => setIsFilterButtonClicked(true)}
          >
            <p className="font-semibold">Filter</p>
            <HiOutlineAdjustmentsHorizontal size={20} />
          </button>
          <Filter
            isFilterButtonClicked={isFilterButtonClicked}
            unfilteredProducts={productList}
            filteredProducts={filteredProducts}
            selectedFilterOptions={selectedFilterOptions}
            setSelectedFilterOptions={setSelectedFilterOptions}
            isNoFilterOptionSelected={isNoFilterOptionSelected}
            calculateFinalPrice={calculateFinalPrice}
            specialOffers={specialOffers}
          />
          {!filteredProductCount ? (
            <EmptyShopProducts
              keyword={keyword}
              isNoFilterOptionSelected={isNoFilterOptionSelected}
              setSelectedFilterOptions={setSelectedFilterOptions}
            />
          ) : (
            <ShopCards
              filteredProducts={filteredProducts}
              filteredProductCount={filteredProductCount}
              selectedFilterOptions={selectedFilterOptions}
              calculateFinalPrice={calculateFinalPrice}
              specialOffers={specialOffers}
              primaryLocation={primaryLocation}
            />
          )}
        </div>
      </main>
    );
}

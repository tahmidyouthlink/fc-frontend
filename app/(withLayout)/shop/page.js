"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import thunderShape from "@/public/shapes/thunder-with-stroke.svg";
import Filter from "@/app/components/shop/Filter";
import ShopCards from "@/app/components/shop/cards/ShopCards";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import LoaderFrontend from "@/app/components/shared/LoaderFrontend";

export default function Shop() {
  const [isFilterButtonClicked, setIsFilterButtonClicked] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState({
    sortBy: new Set([]),
    filterBy: new Set([]),
    category: new Set([]),
    sizes: new Set([]),
    colors: new Set([]),
    // materials: new Set([]),
    price: {
      min: undefined,
      max: undefined,
    },
  });
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [keyword, setKeyword] = useState("");
  const searchParams = useSearchParams();
  const [productList, isProductListLoading, refetch] = useProductsInformation();

  function getUniqueColorsWithImages(productVariants) {
    const colorImageMap = {};

    productVariants.forEach(({ color, imageUrls }) => {
      const colorId = color._id;

      if (!colorImageMap[colorId]) {
        colorImageMap[colorId] = {
          color: { value: color.value, label: color.label, code: color.color },
          images: new Set(imageUrls),
        };
      } else {
        imageUrls.forEach((url) => colorImageMap[colorId].images.add(url));
      }
    });

    // Convert the Set of images to an array for each color
    return Object.values(colorImageMap).map(({ color, images }) => ({
      color,
      images: Array.from(images),
    }));
  }

  // Example usage:
  const uniqueColorsWithImages = getUniqueColorsWithImages(
    !!productList ? productList[4]?.productVariants : [],
  );
  // console.log("chk productsInfo", uniqueColorsWithImages);

  // console.log("chk productsInfo", productList, isProductListLoading);
  // if (productList)
  //   console.log(
  //     "chk getUniqueColorsWithImages",
  //     getUniqueColorsWithImages(!!productList ? productList[4]?.productVariants : []),
  //   );
  // if (productList)
  //   console.log("chk getUniqueColorsWithImages", !!productList ? productList[4] : []);
  // if (productList)
  //   console.log(
  //     "chk getUniqueColorsWithImages",
  //     getUniqueColorsWithImages(!!productList ? productList[7]?.productVariants : []),
  //   );

  const calculateFinalPrice = (product) => {
    const regularPrice = parseFloat(product.regularPrice);
    const discountValue = parseFloat(product.discountValue);

    // Debugging Log
    console.log("Parsed Regular Price:", regularPrice);
    console.log("Parsed Discount Value:", discountValue);
    console.log("Discount Type:", product.discountType);

    // If discount value is 0 or invalid, return regular price
    if (isNaN(discountValue) || discountValue === 0) {
      return regularPrice;
    }

    // Calculate final price based on discount type
    if (product.discountType === "Percentage") {
      return regularPrice - (regularPrice * discountValue) / 100;
    } else if (product.discountType === "Flat") {
      return regularPrice - discountValue;
    } else {
      // If discount type is not recognized, return the regular price
      return regularPrice;
    }

    // Ensure final price is not negative
    // return finalPrice < 0 ? 0 : finalPrice;
  };

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

  // const isInStock = (product) => {
  //   return product.productVariants.some((variant) => !!variant.sku);
  // };

  useEffect(() => {
    if (!isProductListLoading && !!productList.length)
      setFilteredProducts(
        productList
          .filter((product, productIndex) => {
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
                // (selectedFilterOptions.filterBy.includes("In Stock") &&
                //   product.productVariants.some((variant) => !!variant.sku)) ||
                (selectedFilterOptions.filterBy.includes("On Sale") &&
                  !!Number(product.discountValue))) &&
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
              // &&
              // (!selectedFilterOptions.materials.length ||
              //   selectedFilterOptions.materials.some((selectedMaterial) =>
              //     product.materials.some(
              //       (productMaterial) => productMaterial === selectedMaterial,
              //     ),
              //   ))
            );
          })
          .sort((productA, productB) => {
            const selectedSortByOption =
              selectedFilterOptions.sortBy.toString();

            if (selectedSortByOption === "Price (Low to High)")
              return (
                calculateFinalPrice(productA) - calculateFinalPrice(productB)
              );
            else if (selectedSortByOption === "Price (High to Low)")
              return (
                calculateFinalPrice(productB) - calculateFinalPrice(productA)
              );
            else if (selectedSortByOption === "Newest")
              return (
                new Date(productB.publishDate) - new Date(productA.publishDate)
              );
            else return 0;
          }),
      );
  }, [productList, isProductListLoading, selectedFilterOptions, keyword]);

  if (productList)
    productList.forEach((product) => {
      console.log("chk issue", {
        product: product.productTitle,
        // category: product.category,
        // selectedCategory: selectedFilterOptions.category.toString(),
        sizes: product.allSizes,
        selectedSizes: selectedFilterOptions.sizes,
        // same: product.category === selectedFilterOptions.category.toString(),
        same:
          !selectedFilterOptions.sizes.length ||
          selectedFilterOptions.sizes.some((selectedSize) =>
            product.allSizes.some(
              (productSize) => productSize === selectedSize,
            ),
          ),
      });
    });

  if (isProductListLoading || !productList?.length) return <LoaderFrontend />;
  // else
  //   console.log(
  //     "filteredProducts",
  //     filteredProducts?.map((prod) => ({
  //       id: prod._id,
  //       regularPrice: prod.regularPrice,
  //       discountValue: prod.discountValue,
  //       discountType: prod.discountType,
  //       finalPrice: calculateFinalPrice(prod),
  //     })),
  //   );

  return (
    <main className="relative overflow-hidden pb-16 pt-28 [&_img]:pointer-events-none">
      <div className="absolute -left-3 top-28 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl min-[1200px]:fixed" />
      <div className="absolute -bottom-20 -right-3 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl lg:-bottom-5 min-[1200px]:fixed" />
      <div className="space-y-7 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
        {!keyword?.length &&
        Object.values(selectedFilterOptions).every(
          (selectedValue) => !selectedValue.length,
        ) ? (
          <p>
            Displaying {filteredProducts?.length || "no"} item
            {filteredProducts?.length > 1 ? "s" : ""}
          </p>
        ) : (
          <p className="relative w-fit">
            {filteredProducts?.length || "No"} item
            {filteredProducts?.length > 1 && "s"} found
            {!!keyword && "for" && (
              <span className="font-semibold"> &quot;{keyword}&quot;</span>
            )}
            {Object.values(selectedFilterOptions).some(
              (selectedValue) => selectedValue.length,
            ) && " with these selected filters:"}
            <div className="absolute -right-1.5 bottom-1/4 aspect-square w-7 translate-x-full rotate-[26deg]">
              <Image
                src={thunderShape}
                alt="Thunder shape"
                className="object-contain"
                height={0}
                width={0}
                sizes="25vw"
                fill
              />
            </div>
          </p>
        )}
        <button
          className={`relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[18px] py-3 transition-colors duration-300 ease-in-out hover:bg-[#fbcfb0] ${isFilterButtonClicked ? "hidden" : "block"}`}
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
          calculateFinalPrice={calculateFinalPrice}
        />
        <ShopCards
          // unfilteredProducts={productList}
          filteredProducts={filteredProducts}
          selectedFilterOptions={selectedFilterOptions}
          calculateFinalPrice={calculateFinalPrice}
        />
      </div>
    </main>
  );
}

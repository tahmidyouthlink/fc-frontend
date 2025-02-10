import { useState } from "react";
import { Button } from "@nextui-org/react";
import { CgChevronRight, CgChevronLeft } from "react-icons/cg";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import ProductCard from "../product-card/ProductCard";
import AddToCartModal from "../shop/cart/AddToCartModal";

export default function SimilarProducts({
  similarProducts,
  hasCompleteOutfitSection,
  hasRecentlyViewedSection,
  primaryLocation,
}) {
  const [isSimilarProductsSlid, setIsSimilarProductsSlid] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);

  return (
    <section
      className={`relative ${
        !hasCompleteOutfitSection
          ? "mt-8 bg-[#fffaf4] py-8"
          : hasRecentlyViewedSection
            ? "pt-8"
            : "pb-10 pt-8"
      }`}
    >
      <div
        className={`absolute inset-0 flex h-full w-full items-center justify-between space-y-5 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${similarProducts?.length < 5 ? "hidden" : "flex"}`}
      >
        <Button
          className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:block md:-translate-x-1/2 [&>svg]:mx-auto ${!isSimilarProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
          isIconOnly
          disableRipple
          startContent={<CgChevronLeft />}
          onClick={() => setIsSimilarProductsSlid(false)}
        ></Button>
        <Button
          className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:translate-x-1/2 [&>svg]:mx-auto ${isSimilarProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
          isIconOnly
          disableRipple
          startContent={<CgChevronRight />}
          onClick={() => setIsSimilarProductsSlid(true)}
        ></Button>
      </div>
      <div className="space-y-5 overflow-hidden px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
        <div>
          <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
            You May Also Like
          </h2>
        </div>
        <div
          className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:[&>div]:min-w-[calc(25%-16px*3/4)] ${similarProducts?.length > 3 ? "sm:max-lg:[&>div:last-child]:hidden" : ""} ${similarProducts?.length < 5 ? "lg:grid-cols-4" : "transition-transform duration-300 ease-in-out lg:flex lg:flex-nowrap"} ${isSimilarProductsSlid ? "-translate-x-[calc(100%+16px)]" : "-translate-x-0"}`}
        >
          {similarProducts.map((similarProduct) => (
            <ProductCard
              key={similarProduct._id}
              product={similarProduct}
              isAddToCartModalOpen={isAddToCartModalOpen}
              setIsAddToCartModalOpen={setIsAddToCartModalOpen}
              setSelectedAddToCartProduct={setSelectedAddToCartProduct}
              getImageSetsBasedOnColors={getImageSetsBasedOnColors}
            />
          ))}
        </div>
      </div>
      <AddToCartModal
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        product={selectedAddToCartProduct}
        primaryLocation={primaryLocation}
      />
    </section>
  );
}

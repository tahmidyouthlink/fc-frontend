import { useState } from "react";
import { Button } from "@nextui-org/react";
import { CgChevronRight, CgChevronLeft } from "react-icons/cg";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import ProductCard from "../product-card/ProductCard";
import AddToCartModal from "../shop/cart/AddToCartModal";

export default function RecentlyViewedProducts({
  recentlyViewedProducts,
  hasCompleteOutfitSection,
  hasSimilarSection,
  primaryLocation,
}) {
  const [isRecentlyViewedProductsSlid, setIsRecentlyViewedProductsSlid] =
    useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);

  return (
    <section
      className={`relative ${
        (hasCompleteOutfitSection && hasSimilarSection) ||
        (!hasCompleteOutfitSection && !hasSimilarSection)
          ? "mt-8 bg-[#fffaf4] py-8"
          : "pb-10 pt-8"
      }`}
    >
      <div
        className={`absolute inset-0 h-full w-full items-center justify-between space-y-5 px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${recentlyViewedProducts?.length < 6 ? "hidden" : "flex"}`}
      >
        <Button
          className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:block md:-translate-x-1/2 [&>svg]:mx-auto ${!isRecentlyViewedProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
          isIconOnly
          disableRipple
          startContent={<CgChevronLeft />}
          onClick={() => setIsRecentlyViewedProductsSlid(false)}
        ></Button>
        <Button
          className={`z-[1] size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] max-sm:hidden md:translate-x-1/2 [&>svg]:mx-auto ${isRecentlyViewedProductsSlid ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
          isIconOnly
          disableRipple
          startContent={<CgChevronRight />}
          onClick={() => setIsRecentlyViewedProductsSlid(true)}
        ></Button>
      </div>
      <div className="space-y-10 overflow-hidden px-5 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
        <div>
          <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
            Recently Viewed Products
          </h2>
        </div>
        <div
          className={`grid-cols-2 gap-x-4 gap-y-12 max-sm:grid ${recentlyViewedProducts?.length < 6 ? "grid sm:grid-cols-4 lg:grid-cols-5" : "sm:flex sm:flex-nowrap sm:transition-transform sm:duration-300 sm:ease-in-out sm:[&>div]:min-w-[calc(25%-16px*3/4)] lg:[&>div]:min-w-[calc(20%-16px*4/5)]"} ${isRecentlyViewedProductsSlid ? "-translate-x-[calc(100%+16px)]" : "-translate-x-0"}`}
        >
          {recentlyViewedProducts.map((recentlyViewedProduct, index) => (
            <ProductCard
              key={"product-recently-viewed-" + recentlyViewedProduct._id}
              product={recentlyViewedProduct}
              isAddToCartModalOpen={isAddToCartModalOpen}
              setIsAddToCartModalOpen={setIsAddToCartModalOpen}
              setSelectedAddToCartProduct={setSelectedAddToCartProduct}
              getImageSetsBasedOnColors={getImageSetsBasedOnColors}
              shouldBeHidden={index > 3}
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

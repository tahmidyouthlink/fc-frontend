import { useEffect, useState, useRef, useCallback } from "react";
import Shapes from "./Shapes";
import ProductCard from "../../product-card/ProductCard";
import AddToCartModal from "../cart/AddToCartModal";

// Define column numbers for different breakpoints
const MOBILE_COLS = 2;
const TABLET_COLS = 4;
const DESKTOP_COLS = 5;

export default function ShopCards({
  filteredProducts,
  filteredProductCount,
  selectedFilterOptions,
  calculateFinalPrice,
  specialOffers,
  primaryLocation,
}) {
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);
  const [cardHeight, setCardHeight] = useState(null);
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const observerRef = useRef();

  const isProductWithinPriceRange = (product) =>
    (!selectedFilterOptions.price.min ||
      selectedFilterOptions.price.min <=
        calculateFinalPrice(product, specialOffers)) &&
    (!selectedFilterOptions.price.max ||
      selectedFilterOptions.price.max >=
        calculateFinalPrice(product, specialOffers));

  useEffect(() => {
    // Get columns count based on screen size
    const getColsCount = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          return MOBILE_COLS;
        } else if (window.innerWidth < 1024) {
          return TABLET_COLS;
        } else {
          return DESKTOP_COLS;
        }
      }
      return DESKTOP_COLS; // Default for SSR or unknown
    };

    const handleResize = () => {
      // Get columns count based on screen size
      let cols = getColsCount();
      setCols(cols);
      // Calculate rows based on the total count for the Shapes component
      setRows(Math.max(0, Math.ceil(filteredProductCount / cols)));

      setCardHeight(document.querySelector(".product-card")?.clientHeight);
    };

    handleResize(); // Call once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [filteredProductCount]);

  const loadMoreRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        // Check if the element is intersecting AND if there are more items to load
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredProducts.length
        ) {
          setVisibleCount((prev) =>
            Math.min(prev + cols * 2, filteredProducts.length),
          );
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [filteredProducts, visibleCount, cols],
  );

  return (
    <section
      className="relative grid gap-x-4 gap-y-12 pb-7"
      style={{
        gridTemplateColumns:
          typeof window === "undefined"
            ? `repeat(${DESKTOP_COLS}, minmax(0, 1fr))`
            : window.innerWidth < 640
              ? `repeat(${MOBILE_COLS}, minmax(0, 1fr))`
              : window.innerWidth < 1024
                ? `repeat(${TABLET_COLS}, minmax(0, 1fr))`
                : `repeat(${DESKTOP_COLS}, minmax(0, 1fr))`,
      }}
    >
      <Shapes cardHeight={cardHeight} rows={rows} />
      {filteredProducts
        ?.slice(0, visibleCount)
        .map(
          (filteredProduct) =>
            isProductWithinPriceRange(filteredProduct) && (
              <ProductCard
                key={"filtered-product-" + filteredProduct._id}
                product={filteredProduct}
                isAddToCartModalOpen={isAddToCartModalOpen}
                setIsAddToCartModalOpen={setIsAddToCartModalOpen}
                setSelectedAddToCartProduct={setSelectedAddToCartProduct}
                isAllowedToShowLimitedStock={true}
              />
            ),
        )}
      {/* Load More trigger if there are more items to load */}
      {visibleCount < filteredProducts?.length && (
        <div
          ref={loadMoreRef}
          className="col-span-full flex justify-center py-8"
        >
          <span className="animate-pulse text-gray-500">
            Loading products...
          </span>
        </div>
      )}
      <AddToCartModal
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        product={selectedAddToCartProduct}
        primaryLocation={primaryLocation}
      />
    </section>
  );
}

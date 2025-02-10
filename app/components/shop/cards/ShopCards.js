import { useEffect, useState } from "react";
import Shapes from "./Shapes";
import ProductCard from "../../product-card/ProductCard";
import AddToCartModal from "../cart/AddToCartModal";

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

  const isProductWithinPriceRange = (product) =>
    (!selectedFilterOptions.price.min ||
      selectedFilterOptions.price.min <=
        calculateFinalPrice(product, specialOffers)) &&
    (!selectedFilterOptions.price.max ||
      selectedFilterOptions.price.max >=
        calculateFinalPrice(product, specialOffers));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRows(Math.max(0, Math.floor(filteredProductCount / 2)));
      } else if (window.innerWidth < 1024) {
        setRows(Math.max(0, Math.floor(filteredProductCount / 3)));
      } else {
        setRows(Math.max(0, Math.floor(filteredProductCount / 5)));
      }

      setCardHeight(document.querySelector(".product-card").clientHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
      <Shapes cardHeight={cardHeight} rows={rows} />
      {filteredProducts?.map((filteredProduct) => {
        return (
          isProductWithinPriceRange(filteredProduct) && (
            <ProductCard
              key={filteredProduct._id}
              product={filteredProduct}
              needsWhiteBackgroundText={true}
              isAddToCartModalOpen={isAddToCartModalOpen}
              setIsAddToCartModalOpen={setIsAddToCartModalOpen}
              setSelectedAddToCartProduct={setSelectedAddToCartProduct}
            />
          )
        );
      })}
      <AddToCartModal
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        product={selectedAddToCartProduct}
        primaryLocation={primaryLocation}
      />
    </section>
  );
}

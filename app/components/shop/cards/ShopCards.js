import { useState } from "react";
import Shapes from "./Shapes";
import ProductCard from "../../product-card/ProductCard";
import AddToCartModal from "../cart/AddToCartModal";

export default function ShopCards({
  filteredProducts,
  selectedFilterOptions,
  calculateFinalPrice,
}) {
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedAddToCartProduct, setSelectedAddToCartProduct] =
    useState(null);

  const isProductWithinPriceRange = (product) =>
    (!selectedFilterOptions.price.min ||
      selectedFilterOptions.price.min <= calculateFinalPrice(product)) &&
    (!selectedFilterOptions.price.max ||
      selectedFilterOptions.price.max >= calculateFinalPrice(product));

  const getImageSetsBasedOnColors = (productVariants) => {
    if (!productVariants?.length) return;

    const colorImageMap = {};

    productVariants.forEach(({ color, imageUrls }) => {
      const colorId = color._id;

      if (!colorImageMap[colorId]) {
        colorImageMap[colorId] = {
          color: { label: color.label, code: color.color },
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
  };

  return (
    <section className="relative grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      <Shapes rows={Math.max(0, Math.floor(filteredProducts?.length / 4))} />
      {filteredProducts?.map((filteredProduct, filteredProductIndex) => {
        return (
          isProductWithinPriceRange(filteredProduct) && (
            <ProductCard
              product={filteredProduct}
              productIndex={filteredProductIndex}
              calculateFinalPrice={calculateFinalPrice}
              isAddToCartModalOpen={isAddToCartModalOpen}
              setIsAddToCartModalOpen={setIsAddToCartModalOpen}
              setSelectedAddToCartProduct={setSelectedAddToCartProduct}
              getImageSetsBasedOnColors={getImageSetsBasedOnColors}
            />
          )
        );
      })}
      <AddToCartModal
        isAddToCartModalOpen={isAddToCartModalOpen}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        product={selectedAddToCartProduct}
        getImageSetsBasedOnColors={getImageSetsBasedOnColors}
        calculateFinalPrice={calculateFinalPrice}
      />
    </section>
  );
}

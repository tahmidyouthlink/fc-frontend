import { useEffect, useState } from "react";
import CartModalContents from "./CartModalContents";
import CartModalButtons from "./CartModalButtons";

export default function AddToCartModal({
  isAddToCartModalOpen,
  setIsAddToCartModalOpen,
  product,
  calculateFinalPrice,
  getImageSetsBasedOnColors,
}) {
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedProductSKU, setSelectedProductSKU] = useState(null);

  useEffect(() => {
    if (!!product)
      setSelectedOptions({
        color: product.availableColors[Object.keys(product.availableColors)[0]],
        size: undefined,
        quantity: 1,
      });
  }, [product]);

  useEffect(() => {
    setSelectedProductSKU(
      !product || !selectedOptions?.size
        ? null
        : product.productVariants
            ?.map(
              (variant) =>
                variant.color._id === selectedOptions.color._id &&
                variant.size === selectedOptions.size &&
                variant.sku,
            )
            .reduce((acc, sku) => acc + sku, 0),
    );
  }, [product, selectedOptions]);

  // console.log("chk selectedOptions", selectedOptions);
  // console.log("chk product", product);

  useEffect(() => {
    document.body.style.overflow = isAddToCartModalOpen ? "hidden" : "unset";
  }, [isAddToCartModalOpen]);

  return (
    <div
      className={`fixed inset-0 z-[11] flex h-dvh w-dvw items-center justify-center overflow-y-auto overflow-x-hidden text-sm font-semibold transition-[opacity,background-color] duration-500 ease-in-out md:text-base [&::-webkit-scrollbar]:[-webkit-appearance:scrollbarthumb-vertical] [&_:is(h1,h2,h3,h4,h5)]:text-neutral-700 ${isAddToCartModalOpen ? "pointer-events-auto bg-neutral-700/60 opacity-100 delay-0" : "pointer-events-none bg-neutral-700/0 opacity-0 delay-100"}`}
      id="add-to-cart-bg"
      onClick={(event) => {
        if (event.target.id === "add-to-cart-bg") {
          setIsAddToCartModalOpen(false);
          setSelectedOptions({
            color:
              product.availableColors[Object.keys(product.availableColors)[0]],
            size: undefined,
            quantity: 1,
          });
        }
      }}
    >
      <div
        className={`rounded-xl bg-neutral-50 p-5 text-neutral-500 transition-[transform,opacity] duration-300 ease-in-out max-md:pt-14 ${isAddToCartModalOpen ? "translate-y-0 opacity-100 delay-200" : "translate-y-20 opacity-0 delay-0"}`}
      >
        <CartModalContents
          product={product}
          imageSets={getImageSetsBasedOnColors(product?.productVariants)}
          setIsAddToCartModalOpen={setIsAddToCartModalOpen}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          getImageSetsBasedOnColors={getImageSetsBasedOnColors}
          calculateFinalPrice={calculateFinalPrice}
          selectedProductSKU={selectedProductSKU}
        />
        <hr className="mb-5 mt-10 h-0.5 bg-neutral-100 md:my-5" />
        <CartModalButtons
          product={product}
          imageSets={getImageSetsBasedOnColors(product?.productVariants)}
          productPageLink={`/product/${product?.productTitle?.split(" ")?.join("-")?.toLowerCase()}`}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          setIsAddToCartModalOpen={setIsAddToCartModalOpen}
          calculateFinalPrice={calculateFinalPrice}
          selectedProductSKU={selectedProductSKU}
        />
      </div>
    </div>
  );
}
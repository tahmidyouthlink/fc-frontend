import toast from "react-hot-toast";
import TransitionLink from "../../ui/TransitionLink";

export default function CartModalButtons({
  product,
  imageSets,
  productPageLink,
  selectedOptions,
  setSelectedOptions,
  setIsAddToCartModalOpen,
  calculateFinalPrice,
  selectedProductSKU,
}) {
  const existsInCart = (item) =>
    item.title === product?.productTitle &&
    item.selectedSize === selectedOptions?.size &&
    item.selectedColor?._id === selectedOptions?.color?._id;

  const handleAddToCart = () => {
    if (selectedOptions?.size !== undefined) {
      const currentCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      let updatedCartItems;

      if (currentCartItems.some((item) => existsInCart(item))) {
        updatedCartItems = JSON.stringify(
          currentCartItems.map((currentItem) => ({
            ...currentItem,
            selectedQuantity:
              Number(currentItem.selectedQuantity) +
              Number(selectedOptions?.quantity),
          })),
        );
      } else {
        const newlyAddedItem = {
          id: product?._id,
          title: product?.productTitle,
          price: product?.regularPrice,
          discount: calculateFinalPrice(product),
          imgURL: imageSets?.find(
            (imageSet) => imageSet.color?._id === selectedOptions?.color?._id,
          )?.images[0],
          inStock: selectedProductSKU,
          selectedQuantity: selectedOptions?.quantity,
          selectedSize: selectedOptions?.size,
          selectedColor: selectedOptions?.color,
        };

        updatedCartItems = JSON.stringify([
          ...currentCartItems,
          newlyAddedItem,
        ]);
      }

      localStorage.setItem("cartItems", updatedCartItems);
      window.dispatchEvent(new Event("storageCart"));
      setIsAddToCartModalOpen(false);
      toast.success("Cart updated successfully!");
    } else {
      toast.error("Cart was not updatd. Please try again.");
    }
  };

  return (
    <div className="flex gap-x-2.5">
      <TransitionLink
        href={productPageLink}
        className="ml-auto block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
      >
        View Product Details
      </TransitionLink>
      <button
        onClick={() => {
          handleAddToCart();
          setSelectedOptions({
            color:
              product?.availableColors[
                Object.keys(product?.availableColors)[0]
              ],
            size: undefined,
            quantity: 1,
          });
        }}
        className={`select-none rounded-lg bg-[#ffddc2] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#fbcfb0] ${!selectedProductSKU ? "pointer-events-none opacity-40" : "pointer-events-auto opacity-100"}`}
      >
        Add to Cart
      </button>
    </div>
  );
}

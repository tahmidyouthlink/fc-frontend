import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";

const isExistingItem = (item, selectedOptions, productId) =>
  item._id === productId &&
  item.selectedSize === selectedOptions?.size &&
  item.selectedColor?._id === selectedOptions?.color?._id;

export default async function handleAddToCart(
  productId,
  productVariantSku,
  selectedOptions,
  user,
  userData,
) {
  if (!selectedOptions?.size) return toast.error("Please select a size first.");

  const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  let updatedCart;

  if (
    currentCart.some((item) => isExistingItem(item, selectedOptions, productId))
  ) {
    updatedCart = currentCart.map((currentItem) => {
      const currentQuantity = Number(currentItem.selectedQuantity);
      const newlyAddedQuantity = Number(selectedOptions?.quantity);

      return {
        ...currentItem,
        selectedQuantity: !isExistingItem(currentItem)
          ? currentQuantity
          : currentQuantity + newlyAddedQuantity > productVariantSku
            ? productVariantSku
            : currentQuantity + newlyAddedQuantity,
      };
    });
  } else {
    const newlyAddedItem = {
      _id: productId,
      selectedQuantity: selectedOptions?.quantity,
      selectedSize: selectedOptions?.size,
      selectedColor: selectedOptions?.color,
    };

    updatedCart = [...currentCart, newlyAddedItem];
  }

  localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save item in local cart
  localStorage.setItem("shouldCartDrawerOpen", true); // Update state to open cart drawer

  // Save item in server cart, if user is logged in
  if (!!user) {
    try {
      const response = await useAxiosPublic().put(
        `/updateUserInformation/${userData?._id}`,
        {
          ...userData,
          cartItems: updatedCart,
        },
      );

      if (!!response?.data?.modifiedCount || !!response?.data?.matchedCount)
        toast.success("Item added to cart."); // If server cart is updated
    } catch (error) {
      toast.error("Failed to add item to cart."); // If server error occurs
    }
  } else {
    toast.success("Item added to cart."); // If saved only locally
  }

  window.dispatchEvent(new Event("storageCart")); // Dispatch event so that event listener is triggered
  localStorage.setItem("shouldCartDrawerOpen", false); // Reset state dispatching the event
}

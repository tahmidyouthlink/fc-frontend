import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { CgShoppingCart } from "react-icons/cg";
import { useAuth } from "@/app/contexts/auth";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import addToCartToast from "@/app/utils/addToCartToast";

export default function ProductCartButton({
  productId,
  productTitle,
  productImg,
  defaultColor,
  productVariantSku,
  selectedOptions,
  setSelectedOptions,
}) {
  const { user, userData, setUserData } = useAuth();
  const axiosPublic = useAxiosPublic();

  const isExistingItem = (item) =>
    item._id === productId &&
    item.selectedSize === selectedOptions?.size &&
    item.selectedColor?._id === selectedOptions?.color?._id;

  const handleAddToCart = async () => {
    if (!selectedOptions?.size)
      return toast.error("Please select a size first.");

    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    let updatedCart;

    if (currentCart.some((item) => isExistingItem(item))) {
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

    // Save item in server cart, if user is logged in
    if (!!user) {
      const updatedUserData = {
        ...userData,
        cartItems: updatedCart,
      };

      try {
        const response = await axiosPublic.put(
          `/updateUserInformation/${userData?._id}`,
          updatedUserData,
        );

        if (!!response?.data?.modifiedCount || !!response?.data?.matchedCount) {
          setUserData(updatedUserData);

          // Display custom success toast notification, if server cart is updated
          toast.custom(
            (t) =>
              addToCartToast(
                t,
                productImg,
                productTitle,
                selectedOptions?.size,
                selectedOptions?.color,
              ),
            {
              position: "top-right",
            },
          );
        }
      } catch (error) {
        toast.error("Failed to add item to cart."); // If server error occurs
      }
    } else {
      // Display custom success toast notification, if saved only locally
      toast.custom(
        (t) =>
          addToCartToast(
            t,
            productImg,
            productTitle,
            selectedOptions?.size,
            selectedOptions?.color,
          ),
        {
          position: "top-right",
        },
      );
    }

    window.dispatchEvent(new Event("storageCart")); // Dispatch event so that event listener is triggered
  };

  return (
    <>
      {!selectedOptions?.size ? (
        <>
          <Tooltip
            classNames={{
              content: [
                "px-3 rounded-[4px] py-2 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
              ],
              base:
                !!selectedOptions?.size && !!productVariantSku
                  ? ["hidden"]
                  : [""],
            }}
            motionProps={{
              variants: {
                exit: {
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                    ease: "easeIn",
                  },
                },
                enter: {
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                },
              },
            }}
            shouldFlip
            placement="top"
            content={
              !!selectedOptions?.size && !!productVariantSku
                ? ""
                : "Select a size"
            }
          >
            <button
              disabled={!!selectedOptions?.size && !productVariantSku}
              className={`relative hidden h-11 items-center gap-1.5 overflow-visible whitespace-nowrap bg-[var(--color-secondary-500)] !transition-[background-color] !duration-300 !ease-in-out after:absolute after:-bottom-2 after:left-0 after:translate-y-full after:text-red-600 disabled:text-neutral-400 disabled:!opacity-50 disabled:after:content-['*_Out_of_Stock'] xl:flex ${!selectedOptions?.size ? "cursor-default text-neutral-400 !opacity-50" : "[&:not(:disabled):hover]:bg-[var(--color-secondary-600)]"}`}
              onClick={() => {
                if (!!selectedOptions?.size) {
                  handleAddToCart();
                  setSelectedOptions({
                    color: defaultColor,
                    size: undefined,
                    quantity: 1,
                  });
                }
              }}
            >
              Add to Cart
              <CgShoppingCart />
            </button>
          </Tooltip>
          <Popover
            classNames={{
              content: [
                "px-3 py-2 rounded-[4px] shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
              ],
              base:
                !!selectedOptions?.size && !!productVariantSku
                  ? ["hidden"]
                  : [""],
            }}
            placement="top"
          >
            <PopoverTrigger className="z-[0] outline-none xl:hidden">
              <button
                disabled={!!selectedOptions?.size && !productVariantSku}
                className={`!ease-in-outdisabled:mb-6 relative flex h-11 items-center gap-1.5 overflow-visible whitespace-nowrap bg-[var(--color-secondary-500)] !transition-[background-color] !duration-300 disabled:text-neutral-400 disabled:!opacity-50 ${!selectedOptions?.size ? "cursor-default text-neutral-400 !opacity-50" : "[&:not(:disabled):hover]:bg-[var(--color-secondary-600)]"}`}
                onClick={() => {
                  if (!!selectedOptions?.size) {
                    handleAddToCart();
                    setSelectedOptions({
                      color: defaultColor,
                      size: undefined,
                      quantity: 1,
                    });
                  }
                }}
              >
                Add to Cart
                <CgShoppingCart />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              {!(!!selectedOptions?.size && !!productVariantSku) && (
                <p>Select a size</p>
              )}
            </PopoverContent>
          </Popover>
        </>
      ) : (
        <button
          disabled={!!selectedOptions?.size && !productVariantSku}
          className={`relative flex h-11 items-center gap-1.5 overflow-visible whitespace-nowrap bg-[var(--color-secondary-500)] !transition-[background-color] !duration-300 !ease-in-out disabled:text-neutral-400 disabled:!opacity-50 ${!selectedOptions?.size ? "cursor-default text-neutral-400 !opacity-50" : "[&:not(:disabled):hover]:bg-[var(--color-secondary-600)]"}`}
          onClick={() => {
            if (!!selectedOptions?.size) {
              handleAddToCart();
              setSelectedOptions({
                color: defaultColor,
                size: undefined,
                quantity: 1,
              });
            }
          }}
        >
          Add to Cart
          <CgShoppingCart />
        </button>
      )}
    </>
  );
}

import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import TransitionLink from "../../ui/TransitionLink";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import addToCartToast from "@/app/utils/addToCartToast";

export default function CartModalButtons({
  productId,
  productTitle,
  productImg,
  defaultColor,
  productVariantSku,
  productPageLink,
  selectedOptions,
  setSelectedOptions,
  setIsAddToCartModalOpen,
}) {
  const { user, userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();

  const isExistingItem = (item) =>
    item._id === productId &&
    item.selectedSize === selectedOptions?.size &&
    item.selectedColor?._id === selectedOptions?.color?._id;

  const handleAddToCart = async () => {
    if (!selectedOptions?.size)
      return toast.error("Please select a size first.");

    setIsPageLoading(true);

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

    setIsPageLoading(false);
    setIsAddToCartModalOpen(false);
    window.dispatchEvent(new Event("storageCart")); // Dispatch event so that event listener is triggered
  };

  return (
    <div className="flex gap-x-2.5">
      <TransitionLink
        href={productPageLink}
        className="ml-auto block rounded-lg bg-[var(--color-primary-regular)] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-dark)]"
      >
        View Product Details
      </TransitionLink>
      {!selectedOptions?.size ? (
        <>
          <Tooltip
            classNames={{
              content: ["px-3 py-2 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]"],
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
              className={`relative select-none whitespace-nowrap rounded-lg bg-[var(--color-secondary-regular)] px-4 py-2.5 text-sm text-neutral-600 transition-[background-color,opacity] duration-300 ease-in-out max-xl:hidden ${!selectedOptions?.size ? "cursor-default rounded-lg opacity-50" : "opacity-100 hover:bg-[var(--color-secondary-dark)]"}`}
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
            </button>
          </Tooltip>
          <Popover
            classNames={{
              content: ["px-3 py-2 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]"],
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
                className={`relative select-none whitespace-nowrap rounded-lg bg-[var(--color-secondary-regular)] px-4 py-2.5 text-sm text-neutral-600 transition-[background-color,opacity] duration-300 ease-in-out ${!selectedOptions?.size ? "cursor-default rounded-lg opacity-50" : "opacity-100 hover:bg-[var(--color-secondary-dark)]"}`}
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
          className={`relative select-none whitespace-nowrap rounded-lg bg-[var(--color-secondary-regular)] px-4 py-2.5 text-sm text-neutral-600 transition-[background-color,opacity] duration-300 ease-in-out ${!selectedOptions?.size || !productVariantSku ? "cursor-default rounded-lg opacity-50" : "opacity-100 hover:bg-[var(--color-secondary-dark)]"}`}
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
        </button>
      )}
    </div>
  );
}

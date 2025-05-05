import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import useOffers from "@/app/hooks/useOffers";
import useLocations from "@/app/hooks/useLocations";
import addToCartToast from "@/app/utils/addToCartToast";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import {
  calculateSubtotal,
  getTotalItemCount,
} from "@/app/utils/orderCalculations";
import CartHeader from "./CartHeader";
import CartItems from "./CartItems";
import EmptyCartContent from "./EmptyCartContent";
import CartFooter from "./CartFooter";

export default function CartButton({ productList }) {
  const { userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();
  const [cartItems, setCartItems] = useState(null);
  const [specialOffers, isSpecialOffersLoading, specialOffersRefetch] =
    useOffers();
  const [locationList, isLocationListLoading, locationRefetch] = useLocations();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const size = searchParams.get("size");
  const colorCode = searchParams.get("colorCode");

  useEffect(() => {
    setIsPageLoading(
      isSpecialOffersLoading ||
        !specialOffers?.length ||
        isLocationListLoading ||
        !locationList?.length,
    );

    return () => setIsPageLoading(false);
  }, [
    isSpecialOffersLoading,
    specialOffers,
    isLocationListLoading,
    locationList,
    setIsPageLoading,
  ]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cartItems"));
      setCartItems(updatedCart);
    };

    window.addEventListener("storageCart", handleStorageUpdate);
    handleStorageUpdate();

    return () => {
      window.removeEventListener("storageCart", handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    if (!!productList) {
      const localCart = JSON.parse(localStorage.getItem("cartItems"));
      const filteredLocalCart = localCart?.filter(
        (localItem) =>
          !!productList?.find(
            (product) =>
              product?._id === localItem._id && product?.status === "active",
          ),
      );

      setCartItems(filteredLocalCart);
      if (localCart?.length !== filteredLocalCart?.length) {
        localStorage.setItem("cartItems", JSON.stringify(filteredLocalCart));
      }
    }
  }, [productList]);

  useEffect(() => {
    if (!productList || !productId || !size || !colorCode) return;

    const debounceTimeout = setTimeout(() => {
      const product = productList?.find(
        (product) => product?._id === productId && product?.status === "active",
      );

      if (!product) {
        return router.replace(pathname, undefined, {
          shallow: true,
          scroll: false,
        });
      }

      const productVariant = product?.productVariants.find(
        (variant) => variant.color.color == colorCode && variant.size == size,
      );

      if (!productVariant) {
        return router.replace(pathname, undefined, {
          shallow: true,
          scroll: false,
        });
      }

      const isExistingItem = (item) =>
        item._id === productId &&
        item.selectedSize === size &&
        item.selectedColor?.color === colorCode;

      const handleAddToCart = async () => {
        const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const doesItemExist = currentCart.some((item) => isExistingItem(item));

        if (doesItemExist) {
          return router.replace(pathname, undefined, {
            shallow: true,
            scroll: false,
          });
        }

        setIsPageLoading(true);

        const newlyAddedItem = {
          _id: productId,
          selectedQuantity: 1,
          selectedSize: size,
          selectedColor: productVariant.color,
        };

        const updatedCart = [...currentCart, newlyAddedItem];

        localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save item in local cart

        // Save item in server cart, if user is logged in
        if (!!userData) {
          const updatedUserData = {
            ...userData,
            cartItems: updatedCart,
          };

          try {
            const response = await axiosPublic.put(
              `/updateUserInformation/${userData?._id}`,
              updatedUserData,
            );

            if (
              !!response?.data?.modifiedCount ||
              !!response?.data?.matchedCount
            ) {
              setUserData(updatedUserData);

              // Display custom success toast notification, if server cart is updated
              toast.custom(
                (t) =>
                  addToCartToast(
                    t,
                    getImageSetsBasedOnColors(product?.productVariants)?.find(
                      (imgSet) => imgSet?.color?.color === colorCode,
                    )?.images[0],
                    product?.productTitle,
                    productVariant?.size,
                    productVariant?.color,
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
                getImageSetsBasedOnColors(product?.productVariants)?.find(
                  (imgSet) => imgSet?.color?.color === colorCode,
                )?.images[0],
                product?.productTitle,
                productVariant?.size,
                productVariant?.color,
              ),
            {
              position: "top-right",
            },
          );
        }

        router.replace(pathname, undefined, {
          shallow: true,
          scroll: false,
        });
        setIsPageLoading(false);
        window.dispatchEvent(new Event("storageCart")); // Dispatch event so that event listener is triggered
      };

      handleAddToCart();
    }, 25);

    return () => clearTimeout(debounceTimeout);
  }, [
    productList,
    productId,
    size,
    colorCode,
    setIsPageLoading,
    userData,
    axiosPublic,
    setUserData,
    router,
    pathname,
  ]);

  return (
    <Dropdown
      placement="bottom-end"
      className="mt-5 sm:mt-6 xl:mt-7"
      motionProps={{
        initial: { opacity: 0, scale: 0.95 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.25,
            ease: "easeInOut",
          },
        },
        exit: {
          opacity: 0,
          scale: 0.95,
          transition: {
            duration: 0.25,
            ease: "easeInOut",
          },
        },
      }}
    >
      <DropdownTrigger className="z-[0] !scale-100 !opacity-100">
        {/* Cart button */}
        <li
          className="relative my-auto cursor-pointer"
          onClick={() => {
            window.dispatchEvent(new Event("storageCart"));
          }}
        >
          {/* Cart icon */}
          <IoCartOutline className="size-[18px] text-neutral-600 lg:size-[22px]" />
          {/* Badge (to display total cart items) */}
          <span
            className={`absolute right-0 top-0 flex size-3.5 -translate-y-1/2 translate-x-1/2 select-none items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white ${!cartItems?.length ? "hidden" : ""}`}
          >
            {!!cartItems?.length &&
              cartItems.reduce(
                (accumulator, item) =>
                  Number(item.selectedQuantity) + accumulator,
                0,
              )}
          </span>
        </li>
      </DropdownTrigger>
      <DropdownMenu aria-label="cart-dropdown" variant="flat">
        <DropdownItem
          key="cart-dropdown"
          isReadOnly
          textValue="Cart Dropdown"
          className="flex min-h-full cursor-default flex-col justify-between p-0 text-sm text-neutral-500 md:text-base [&>span]:w-full sm:[&>span]:w-[425px] md:[&>span]:w-[450px]"
        >
          <div className="max-h-[50dvh] overflow-y-auto px-2 pt-2 font-semibold [&::-webkit-scrollbar]:[-webkit-appearance:scrollbarthumb-vertical]">
            <CartHeader totalItems={getTotalItemCount(cartItems) || 0} />
            {!!cartItems?.length ? (
              <CartItems
                cartItems={cartItems}
                productList={productList}
                specialOffers={specialOffers}
                primaryLocation={
                  locationList?.find(
                    (location) => location.isPrimaryLocation == true,
                  )?.locationName
                }
                setIsPageLoading={setIsPageLoading}
              />
            ) : (
              <EmptyCartContent />
            )}
          </div>
          {!!cartItems?.length && (
            <CartFooter
              subtotal={calculateSubtotal(
                productList,
                cartItems,
                specialOffers,
              ).toLocaleString()}
            />
          )}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import { IoCartOutline } from "react-icons/io5";
import CartDrawer from "./CartDrawer";

export default function CartButton({ productList }) {
  const { userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();
  const [cartItems, setCartItems] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const size = searchParams.get("size");
  const colorCode = searchParams.get("colorCode");

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
          setIsCartDrawerOpen(true);
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

        router.replace(pathname, undefined, {
          shallow: true,
          scroll: false,
        });
        setIsPageLoading(false);
        window.dispatchEvent(new Event("storageCart")); // Dispatch event so that event listener is triggered
        setIsCartDrawerOpen(true);
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
    <>
      {/* Cart button */}
      <li
        className="relative my-auto cursor-pointer"
        onClick={() => {
          window.dispatchEvent(new Event("storageCart"));
          setIsCartDrawerOpen(true);
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
      {/* Cart drawer */}
      <CartDrawer
        isCartDrawerOpen={isCartDrawerOpen}
        setIsCartDrawerOpen={setIsCartDrawerOpen}
        cartItems={cartItems}
        productList={productList}
      />
    </>
  );
}

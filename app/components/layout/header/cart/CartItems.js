import Image from "next/image";
import toast from "react-hot-toast";
import { CgTrash } from "react-icons/cg";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useAuth } from "@/app/contexts/auth";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import {
  calculateFinalPrice,
  checkIfOnlyRegularDiscountIsAvailable,
} from "@/app/utils/orderCalculations";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import { getProductVariantSku } from "@/app/utils/productSkuCalculation";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function CartItems({
  cartItems,
  productList,
  specialOffers,
  primaryLocation,
  setIsPageLoading,
  setIsDropdownOpen,
}) {
  const { user, userData, setUserData } = useAuth();
  const axiosPublic = useAxiosPublic();

  const handleCartUpdate = async (updatedCart) => {
    setIsPageLoading(true);

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
        }
      } catch (error) {
        toast.error("Failed to update the cart on server."); // If server error occurs
      }
    }

    window.dispatchEvent(new Event("storageCart")); // Dispatch event so that event listener is triggered
    setIsPageLoading(false);
  };

  return (
    <ul className="mb-4 space-y-[18px]">
      {cartItems.map((cartItemInfo) => {
        const cartItem = productList?.find(
          (product) => product._id === cartItemInfo._id,
        );
        const cartItemSKU = getProductVariantSku(
          cartItem?.productVariants,
          primaryLocation,
          cartItemInfo.selectedColor._id,
          cartItemInfo.selectedSize,
        );
        const cartItemImgUrl = getImageSetsBasedOnColors(
          cartItem?.productVariants,
        )?.find(
          (imgSet) => imgSet.color.label === cartItemInfo.selectedColor.label,
        )?.images[0];
        const isOnlyRegularDiscountAvailable =
          checkIfOnlyRegularDiscountIsAvailable(cartItem, specialOffers);
        const cartItemFinalPrice = calculateFinalPrice(cartItem, specialOffers);

        return (
          <li
            key={
              "cart-item-" +
              cartItemInfo._id +
              "-size-" +
              cartItemInfo.selectedSize +
              "-color-" +
              cartItemInfo.selectedColor.label
            }
            className="flex w-full items-stretch justify-between gap-x-2.5 rounded-lg bg-white shadow-[2px_2px_10px_0_rgba(0,0,0,0.025)]"
          >
            {/* Cart Item Image (with link to product page) */}
            <TransitionLink
              href={`/product/${cartItem?.productTitle?.split(" ")?.join("-")?.toLowerCase()}`}
              hasDrawer={true}
              setIsDrawerOpen={setIsDropdownOpen}
              className="relative block min-h-full w-1/4 overflow-hidden rounded-md bg-[#F0F0F0] max-sm:w-20"
            >
              {!!cartItemImgUrl && (
                <Image
                  className="h-full w-full object-contain"
                  src={cartItemImgUrl}
                  alt={cartItem?.productTitle}
                  fill
                  sizes="15vh"
                />
              )}
            </TransitionLink>
            <div className="grow text-neutral-400">
              <div className="flex h-full flex-col justify-between gap-1.5">
                <div className="flex justify-between gap-x-5">
                  <div>
                    {/* Cart Item Title (with link to product page) */}
                    <TransitionLink
                      href={`/product/${cartItem?.productTitle?.split(" ")?.join("-")?.toLowerCase()}`}
                      hasDrawer={true}
                      setIsDrawerOpen={setIsDropdownOpen}
                      className="underline-offset-1 hover:underline"
                    >
                      <h4 className="text-neutral-600">
                        {cartItem?.productTitle}
                      </h4>
                    </TransitionLink>
                    {/* Cart Item Unit Price (with discount price, if any) */}
                    <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                      <h5>
                        <span className="max-[389px]:hidden">Unit</span> Price:
                      </h5>
                      <div className="flex h-fit shrink-0 gap-x-1.5">
                        <p
                          className={
                            isOnlyRegularDiscountAvailable
                              ? "relative h-fit before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:bg-neutral-400 before:content-['']"
                              : ""
                          }
                        >
                          ৳ {Number(cartItem?.regularPrice).toLocaleString()}
                        </p>
                        {isOnlyRegularDiscountAvailable && (
                          <p>৳ {cartItemFinalPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    {/* Cart Item Size */}
                    <div className="mt-[3px] flex gap-x-1.5 text-xs md:text-[13px]">
                      <h5>Size:</h5>
                      <span>{cartItemInfo?.selectedSize}</span>
                    </div>
                    {/* Cart Item Color */}
                    <div className="mt-[3px] flex gap-x-1.5 text-xs md:text-[13px]">
                      <h5>Color:</h5>
                      <div className="flex items-center gap-x-1">
                        <div
                          style={{
                            background:
                              cartItemInfo?.selectedColor?.label !==
                              "Multicolor"
                                ? cartItemInfo?.selectedColor?.color
                                : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
                          }}
                          className="size-3.5 rounded-full"
                        />
                        {cartItemInfo?.selectedColor?.label}
                      </div>
                    </div>
                  </div>
                  {/* Cart Item Price (unit price X quantity) */}
                  <span className="shrink-0 text-neutral-600">
                    ৳{" "}
                    {(
                      cartItemFinalPrice *
                      Number(cartItemInfo?.selectedQuantity)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex grow items-end justify-between">
                  {/* Cart Item Remove Button */}
                  <div
                    className="mt-auto flex w-fit cursor-pointer items-center justify-between gap-x-1 font-semibold transition-[color] duration-300 ease-in-out hover:text-red-500"
                    onClick={() =>
                      handleCartUpdate(
                        cartItems.filter(
                          (item) =>
                            !(
                              item._id === cartItem?._id &&
                              item.selectedSize ===
                                cartItemInfo?.selectedSize &&
                              item.selectedColor?._id ===
                                cartItemInfo?.selectedColor?._id
                            ),
                        ),
                      )
                    }
                  >
                    <CgTrash className="text-sm" />
                    <p className="text-xs">Remove</p>
                  </div>
                  {/* Cart Item Quantity */}
                  <div className="mt-auto flex gap-x-1.5 text-neutral-500 [&>*]:!m-0 [&>*]:grid [&>*]:size-8 [&>*]:place-content-center [&>*]:rounded-md [&>*]:bg-neutral-100 [&>*]:!p-0 [&>*]:text-center hover:[&>*]:bg-[#FBEDE2] sm:[&>*]:rounded-lg">
                    {/* Quantity Decrease Button */}
                    <button
                      onClick={() =>
                        handleCartUpdate(
                          cartItems.map((availableCartItem) => ({
                            ...availableCartItem,
                            selectedQuantity:
                              availableCartItem._id === cartItem?._id &&
                              availableCartItem.selectedSize ===
                                cartItemInfo?.selectedSize &&
                              availableCartItem.selectedColor?._id ===
                                cartItemInfo?.selectedColor?._id &&
                              Number(cartItemInfo?.selectedQuantity) > 1
                                ? Number(cartItemInfo?.selectedQuantity) - 1
                                : Number(availableCartItem?.selectedQuantity),
                          })),
                        )
                      }
                    >
                      <HiChevronLeft />
                    </button>
                    {/* Quantity Input Field */}
                    <input
                      className="w-fit text-center font-semibold [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      type="number"
                      arial-label="Quantity"
                      min={1}
                      max={cartItemSKU}
                      value={Number(cartItemInfo?.selectedQuantity)}
                      onChange={(event) => {
                        const inputValue = Number(event.target.value);
                        const updatedCart = cartItems.map(
                          (availableCartItem) => ({
                            ...availableCartItem,
                            selectedQuantity: !(
                              availableCartItem._id === cartItem?._id &&
                              availableCartItem.selectedSize ===
                                cartItemInfo?.selectedSize &&
                              availableCartItem.selectedColor?._id ===
                                cartItemInfo?.selectedColor?._id
                            )
                              ? Number(availableCartItem.selectedQuantity)
                              : inputValue < 1
                                ? 1
                                : inputValue > cartItemSKU
                                  ? cartItemSKU
                                  : inputValue,
                          }),
                        );

                        handleCartUpdate(updatedCart);
                      }}
                    />
                    {/* Quantity Inccrease Button */}
                    <button
                      onClick={() =>
                        handleCartUpdate(
                          cartItems.map((availableCartItem) => ({
                            ...availableCartItem,
                            selectedQuantity:
                              availableCartItem._id === cartItem?._id &&
                              availableCartItem.selectedSize ===
                                cartItemInfo?.selectedSize &&
                              availableCartItem.selectedColor?._id ===
                                cartItemInfo?.selectedColor?._id &&
                              Number(cartItemInfo?.selectedQuantity) !=
                                cartItemSKU
                                ? Number(cartItemInfo?.selectedQuantity) + 1
                                : Number(availableCartItem?.selectedQuantity),
                          })),
                        )
                      }
                    >
                      <HiChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

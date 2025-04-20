import { useEffect, useState } from "react";
import { IoHeartOutline } from "react-icons/io5";
import WishlistDrawer from "./WishlistDrawer";

export default function WishlistButton({ productList }) {
  const [wishlistItems, setWishlistItems] = useState(null);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);

  useEffect(() => {
    if (!!productList) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlistItems"));
      const filteredLocalWishlist = localWishlist?.filter(
        (localItem) =>
          !!productList?.find(
            (product) =>
              product?._id === localItem._id && product?.status === "active",
          ),
      );

      setWishlistItems(filteredLocalWishlist);
      if (localWishlist?.length !== filteredLocalWishlist?.length) {
        localStorage.setItem(
          "wishlistItems",
          JSON.stringify(filteredLocalWishlist),
        );
      }
    }

    const handleStorageUpdate = () =>
      setWishlistItems(JSON.parse(localStorage.getItem("wishlistItems")));

    window.addEventListener("storageWishlist", handleStorageUpdate);

    return () => {
      window.removeEventListener("storageWishlist", handleStorageUpdate);
    };
  }, [productList]);

  return (
    <>
      {/* Wishlist button */}
      <li
        className="relative my-auto cursor-pointer"
        onClick={() => {
          window.dispatchEvent(new Event("storageWishlist"));
          setIsWishlistDrawerOpen(true);
        }}
      >
        {/* Wishlist icon */}
        <IoHeartOutline className="size-[18px] text-neutral-600 lg:size-[22px]" />
        {/* Badge (to display total wishlist items) */}
        <span
          className={`absolute right-0 top-0 flex size-3.5 -translate-y-1/2 translate-x-1/2 select-none items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white ${!wishlistItems?.length ? "hidden" : ""}`}
        >
          {wishlistItems?.reduce((accumulator, item) => accumulator + 1, 0)}
        </span>
      </li>
      {/* Wishlist drawer */}
      <WishlistDrawer
        isWishlistDrawerOpen={isWishlistDrawerOpen}
        setIsWishlistDrawerOpen={setIsWishlistDrawerOpen}
        wishlistItems={wishlistItems}
        productList={productList}
      />
    </>
  );
}

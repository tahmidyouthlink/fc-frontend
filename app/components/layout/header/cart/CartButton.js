import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import CartDrawer from "./CartDrawer";

export default function CartButton({ productList }) {
  const [cartItems, setCartItems] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

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

    const handleStorageUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cartItems"));
      setCartItems(updatedCart);

      if (localStorage.getItem("shouldCartDrawerOpen") === "true")
        setIsCartDrawerOpen(true);
    };

    window.addEventListener("storageCart", handleStorageUpdate);

    return () => {
      window.removeEventListener("storageCart", handleStorageUpdate);
    };
  }, [productList]);

  return (
    <>
      {/* Cart button */}
      <li
        className="flex cursor-pointer items-center gap-x-1.5"
        onClick={() => {
          window.dispatchEvent(new Event("storageCart"));
          setIsCartDrawerOpen(true);
        }}
      >
        <div className="relative">
          {/* Cart icon */}
          <IoCartOutline
            size={18}
            className="text-neutral-600 lg:text-neutral-500"
          />
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
        </div>
        {/* Cart text */}
        <span className="max-lg:hidden">Cart</span>
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

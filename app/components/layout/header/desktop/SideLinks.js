import { Suspense } from "react";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import UserDropdown from "./UserDropdown";
import ShopButton from "./ShopButton";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function SideLinks({ productList }) {
  return (
    <div className="text-neutral-600">
      <ul className="flex items-center gap-x-2.5 text-xs md:text-sm xl:gap-x-5">
        <Suspense fallback={<LoadingSpinner />}>
          <ShopButton />
        </Suspense>
        <WishlistButton productList={productList} />
        <CartButton productList={productList} />
        <UserDropdown />
      </ul>
    </div>
  );
}

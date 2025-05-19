import { Suspense } from "react";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import UserDropdown from "./UserDropdown";

export default function SideLinks({ productList }) {
  return (
    <div className="text-neutral-600">
      <ul className="flex items-center gap-x-6 text-xs xl:gap-x-7">
        <WishlistButton productList={productList} />
        <Suspense fallback={<LoadingSpinner />}>
          <CartButton productList={productList} />
        </Suspense>
        <UserDropdown />
      </ul>
    </div>
  );
}

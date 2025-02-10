import { usePathname, useSearchParams } from "next/navigation";
import { IoBagOutline } from "react-icons/io5";
import TransitionLink from "@/app/components/ui/TransitionLink";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import UserDropdown from "./UserDropdown";

export default function SideLinks({ productList }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="text-neutral-600">
      <ul className="flex items-center gap-x-2.5 text-xs md:text-sm xl:gap-x-4">
        {/* Shop page button */}
        <li>
          <TransitionLink
            className={`flex items-center gap-1.5 ${pathname.startsWith("/shop") && !searchParams.get("filterBy") ? "text-neutral-900" : "hover:text-neutral-700"}`}
            href="/shop"
          >
            <IoBagOutline className="text-lg" />
            Shop
          </TransitionLink>
        </li>
        <WishlistButton productList={productList} />
        <CartButton productList={productList} />
        <UserDropdown />
      </ul>
    </div>
  );
}

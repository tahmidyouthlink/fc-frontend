import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import logoWithTextImage from "/public/logos/logo.png";
import logoOnlyImage from "/public/logos/logo-mobile.png";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import Search from "../Search";
import NavMenu from "./NavMenu";
import TransitionLink from "@/app/components/ui/TransitionLink";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function MobileNavbar({ productList }) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isNavMenuOpen ? "hidden" : "unset";
  }, [isNavMenuOpen]);

  return (
    <nav className="relative h-full w-full text-sm lg:hidden">
      <div className="relative flex h-full w-full items-center justify-between bg-white">
        {/* Logo */}
        <TransitionLink href="/">
          <Image
            className="h-8 w-auto sm:hidden"
            src={logoOnlyImage}
            alt="YouthLink logo"
          />
          <Image
            className="h-8 w-auto max-sm:hidden lg:h-9"
            src={logoWithTextImage}
            alt="YouthLink logo with text"
          />
        </TransitionLink>
        <ul className="flex gap-x-3.5">
          {/* Search bar */}
          <li>
            <Suspense fallback={<LoadingSpinner />}>
              <Search />
            </Suspense>
          </li>
          <WishlistButton productList={productList} />
          <CartButton productList={productList} />
          {/* Navigation button */}
          <li className="my-auto">
            <IoMenuOutline
              className="h-5 w-auto cursor-pointer sm:h-6 lg:hidden"
              onClick={() => setIsNavMenuOpen(true)}
            />
          </li>
        </ul>
      </div>
      <NavMenu
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
      />
    </nav>
  );
}

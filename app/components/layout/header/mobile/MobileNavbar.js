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
            alt={`${process.env.WEBSITE_NAME} logo (no text)`}
          />
          <Image
            className="h-8 w-auto max-sm:hidden lg:h-9"
            src={logoWithTextImage}
            alt={`${process.env.WEBSITE_NAME} logo`}
          />
        </TransitionLink>
        <ul className="flex gap-x-4 sm:gap-x-6">
          {/* Search bar */}
          <li>
            <Suspense fallback={<LoadingSpinner />}>
              <Search />
            </Suspense>
          </li>
          <WishlistButton productList={productList} />
          <Suspense fallback={<LoadingSpinner />}>
            <CartButton productList={productList} />
          </Suspense>
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

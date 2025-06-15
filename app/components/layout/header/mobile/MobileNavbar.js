import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import Search from "../Search";
import NavMenu from "./NavMenu";
import TransitionLink from "@/app/components/ui/TransitionLink";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function MobileNavbar({
  logoWithoutTextSrc,
  logoWithTextSrc,
  productList,
}) {
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
            src={logoWithoutTextSrc}
            alt={`${process.env.NEXT_PUBLIC_WEBSITE_NAME} logo (no text)`}
            height={0}
            width={0}
            sizes="75px"
          />
          <Image
            className="h-8 w-auto max-sm:hidden"
            src={logoWithTextSrc}
            alt={`${process.env.NEXT_PUBLIC_WEBSITE_NAME} logo`}
            height={0}
            width={0}
            sizes="150px"
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
        logoWithTextSrc={logoWithTextSrc}
      />
    </nav>
  );
}

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { IoMenuOutline, IoSearchOutline } from "react-icons/io5";
import logoImage from "/public/logos/logo.png";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import Search from "../Search";
import NavMenu from "./NavMenu";
import TransitionLink from "@/app/components/ui/TransitionLink";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function MobileNavbar({
  productList,
  isMobileSearchSelected,
  setIsMobileSearchSelected,
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
            className="h-8 w-auto lg:h-9"
            src={logoImage}
            alt="YouthLink logo with white text"
          />
        </TransitionLink>
        <ul className="flex gap-x-4">
          {/* Search Button */}
          <li
            className="flex cursor-pointer items-center"
            onClick={() => setIsMobileSearchSelected((prevState) => !prevState)}
          >
            <IoSearchOutline className="text-lg text-neutral-600" />
          </li>
          <WishlistButton productList={productList} />
          <CartButton productList={productList} />
          {/* Navigation button */}
          <li>
            <IoMenuOutline
              className="h-5 w-auto cursor-pointer sm:h-6 lg:hidden"
              onClick={() => setIsNavMenuOpen(true)}
            />
          </li>
        </ul>
      </div>
      <div
        className={`absolute left-0 right-0 top-0 mt-2 transition-[transform,opacity] duration-300 ease-in-out ${isMobileSearchSelected ? "pointer-events-auto translate-y-full opacity-100" : "pointer-events-none translate-y-0 opacity-0"}`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Search
            isMobile={true}
            setIsMobileSearchSelected={setIsMobileSearchSelected}
          />
        </Suspense>
      </div>
      <NavMenu
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
      />
    </nav>
  );
}

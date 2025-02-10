import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMenuOutline, IoSearchOutline } from "react-icons/io5";
import logoImage from "/public/logos/logo.png";
import TransitionLink from "@/app/components/ui/TransitionLink";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import Search from "../Search";
import NavMenu from "./NavMenu";

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
    <nav className="relative h-full w-full text-sm md:text-[15px] lg:hidden">
      <div className="relative flex h-full w-full items-center justify-between bg-white">
        {/* Logo */}
        <TransitionLink href="/">
          <Image
            className="h-9 w-auto"
            src={logoImage}
            alt="YouthLink logo with white text"
          />
        </TransitionLink>
        <ul className="flex gap-x-4">
          {/* Search Button */}
          <li
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
        <Search
          isMobile={true}
          setIsMobileSearchSelected={setIsMobileSearchSelected}
        />
      </div>
      <NavMenu
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
      />
    </nav>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CgMenuRight } from "react-icons/cg";
import { HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi2";
import { PiShoppingCartLight } from "react-icons/pi";
import logoWhiteImage from "/public/logos/fc-logo.png";

export default function Header() {
  const pathname = usePathname();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false); // State for tracking nav menu open/close

  return (
    <header className="absolute z-10 w-full px-5 py-4 text-black sm:px-8 sm:py-5 lg:px-12 lg:py-6">
      {/* Header wrapper */}
      <div className="mx-auto flex items-center justify-between max-w-screen-xl">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              className="h-6 w-auto"
              src={logoWhiteImage}
              alt="YouthLink logo with white text"
            />
            <h1 className="font-leckerli text-lg">F-Commerce</h1>
          </div>
        </Link>
        {/* Navigation button */}
        <CgMenuRight
          className="h-5 w-auto cursor-pointer sm:h-6 lg:hidden"
          onClick={() => setIsNavMenuOpen(true)}
        />
        {/* Desktop navigation bar */}
        <nav className="hidden lg:block">
          {/* Navigation links */}
          <ul className="flex items-center space-x-6 lg:space-x-8 font-medium">
            <li>
              <Link
                className={pathname === "/" ? "text-[#9F5216]" : "hover:text-[#9F5216]"}
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={pathname.startsWith("/popular") ? "text-[#9F5216]" : "hover:text-[#9F5216]"}
                href="/popular"
              >
                Popular
              </Link>
            </li>
            <li>
              <Link
                className={pathname.startsWith("/new-arrivals") ? "text-[#9F5216]" : "hover:text-[#9F5216]"}
                href="/new-arrivals"
              >
                New Arrivals
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="hidden lg:block">
          {/* Navigation links */}
          <ul className="flex items-center space-x-6 lg:space-x-8">
            <li className="flex items-center relative group">
              <svg className="absolute left-4 fill-[#9e9ea7] w-4 h-4 icon" aria-hidden="true" viewBox="0 0 24 24">
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
              <input
                placeholder="Search Products"
                type="search"
                className="w-full h-10 px-4 pl-[2.5rem] border-2 border-transparent rounded-lg outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30"
              />
            </li>

            <li>
              <Link
                className={
                  pathname.startsWith("/shop") ? "active" : undefined
                }
                href="/shop"
              >
                <HiOutlineShoppingBag />
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname.startsWith("/wishlist") ? "active" : undefined
                }
                href="/wishlist"
              >
                <HiOutlineHeart />
              </Link>
            </li>
            <li>
              <Link
                className={
                  pathname.startsWith("/cart") ? "active" : undefined
                }
                href="/cart"
              >
                <PiShoppingCartLight />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

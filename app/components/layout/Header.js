"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CgMenuRight } from "react-icons/cg";
import { HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi2";
import { PiShoppingCartLight } from "react-icons/pi";
import logoWhiteImage from "/public/logos/fc-logo.png";
import newArrivals from "/public/logos/new-arrivals_8294825.svg";
import { FaEnvelope, FaInstagram, FaLinkedin, FaSquareFacebook, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false); // State for tracking nav menu open/close

  return (
    <header className="absolute z-10 w-full px-5 py-4 text-black sm:px-8 sm:py-5 lg:px-12 lg:py-6">
      {/* Header wrapper */}
      <div className="mx-auto flex items-center justify-between max-w-[1200px]">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              className="h-4 md:h-6 w-auto"
              src={logoWhiteImage}
              alt="YouthLink logo with white text"
            />
            <h1 className="font-leckerli text-sm md:text-lg">F-Commerce</h1>
          </div>
        </Link>
        {/* Search Icon */}
        <div className="flex items-center relative group lg:hidden">
          <svg className="absolute left-4 fill-[#9e9ea7] w-3 h-3 lg:w-4 lg:h-4 icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            placeholder="Search Products"
            type="search"
            className="w-[150px] md:w-full h-7 lg:h-10 lg:px-4 pl-[2.5rem] text-xs lg:text-base border-2 border-transparent rounded-lg outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 ease-in-out focus:outline-none focus:border-[#9F5216]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(234,76,137/10%)] hover:outline-none hover:border-[#9F5216]/30 hover:bg-white hover:shadow-[#9F5216]/30"
          />
        </div>
        {/* Navigation button */}
        <CgMenuRight
          className="h-5 w-auto cursor-pointer sm:h-6 lg:hidden"
          onClick={() => setIsNavMenuOpen(true)}
        />
        {/* Desktop navigation bar */}
        <nav className="hidden lg:block">
          {/* Navigation links */}
          <ul className="flex items-center space-x-4 xl:space-x-8">
            <li>
              <Link
                className={pathname === "/" ? "text-[#9F5216] font-bold" : "hover:text-[#9F5216]"}
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={pathname.startsWith("/popular") ? "text-[#9F5216] font-bold" : "hover:text-[#9F5216]"}
                href="/popular"
              >
                Popular
              </Link>
            </li>
            <li>
              <Link
                className={pathname.startsWith("/new-arrivals") ? "text-[#9F5216] font-bold" : "hover:text-[#9F5216]"}
                href="/new-arrivals"
              >
                New Arrivals
              </Link>
            </li>
          </ul>
        </nav>
        {/* Desktop navigation bar */}
        <nav className="hidden lg:block">
          {/* Navigation links */}
          <ul className="flex items-center space-x-4 xl:space-x-8">
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
                className={pathname === "/shop" ? "text-[#9F5216] font-bold" : "hover:text-[#9F5216]"} href="/shop">
                <span className="flex items-center text-[14px] gap-1"><HiOutlineShoppingBag />Shop</span>
              </Link>
            </li>
            <li>
              <Link
                className={pathname === "/wishlist" ? "text-[#9F5216] font-bold" : "hover:text-[#9F5216]"}
                href="/wishlist"
              >
                <span className="flex items-center text-[14px] gap-1"><HiOutlineHeart />Wishlist</span>
              </Link>
            </li>
            <li>
              <Link
                className={pathname === "/cart" ? "text-[#9F5216] font-bold" : "hover:text-[#9F5216]"}
                href="/cart"
              >
                <span className="flex items-center text-[14px] gap-1"> <PiShoppingCartLight />Cart</span>
              </Link>
            </li>
          </ul>
        </nav>
        {/* Mobile navigation menu container */}
        <div
          className={`fixed inset-0 h-dvh w-dvw bg-neutral-700 bg-opacity-25 backdrop-blur ${isNavMenuOpen ? "" : "hidden"} lg:hidden`}
          id="nav-menu-bg"
          onClick={
            (event) =>
              event.target.id === "nav-menu-bg" && setIsNavMenuOpen(false) // If user clicks outside nav menu, close it
          }
        >
          {/* Mobile navigation menu */}
          <nav className="mobile ml-auto flex h-dvh w-3/5 flex-col justify-between rounded-l-lg bg-white p-6 text-neutral-500 min-[480px]:w-1/2 sm:w-2/5">
            {/* Top section - logo and nav links */}
            <div className="space-y-10">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Image
                    className="h-6 w-auto"
                    src={logoWhiteImage}
                    alt="YouthLink logo with white text"
                  />
                  <h1 className="font-leckerli text-lg text-black">F-Commerce</h1>
                </div>
              </Link>
              {/* Navigation links */}
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <Link
                    className={pathname === "/" ? "active" : ""}
                    href="/"
                  >
                    <FaHome />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className={pathname.startsWith("/popular") ? "active" : ""}
                    href="/popular"
                  >
                    <FaRegStar />
                    Popular
                  </Link>
                </li>
                <li>
                  <Link
                    className={pathname.startsWith("/new-arrivals") ? "active" : ""}
                    href="/new-arrivals"
                  >
                    <Image
                      className="h-6 w-auto"
                      src={newArrivals}
                      alt="YouthLink logo with white text"
                    />
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    className={pathname.startsWith("/shop") ? "active" : undefined} href="/shop">
                    <HiOutlineShoppingBag />Shop
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      pathname.startsWith("/wishlist") ? "active" : undefined
                    }
                    href="/wishlist"
                  >
                    <HiOutlineHeart />Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      pathname.startsWith("/cart") ? "active" : undefined
                    }
                    href="/cart"
                  >
                    <PiShoppingCartLight />Cart
                  </Link>
                </li>
              </ul>
            </div>
            {/* Bottom section - social links */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Get in Touch</h3>
              <ul className="social-icons flex gap-x-1.5">
                <li>
                  <Link
                    className="hover:bg-[#cfe6ff] hover:text-[#0080ff]"
                    href="https://www.facebook.com/fashion-commerce/" target="_blank"
                  >
                    <FaSquareFacebook />
                  </Link>
                </li>
                <li>
                  <Link
                    className="from-[#405de6] via-[#dc2743] to-[#f09433] hover:bg-gradient-to-b hover:text-white"
                    href="https://www.instagram.com/fashion-commerce/" target="_blank"
                  >
                    <FaInstagram />
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:bg-[#c8ecff] hover:text-[#0075b4]"
                    href="https://www.linkedin.com/fashion-commerce/" target="_blank"
                  >
                    <FaLinkedin />
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:bg-black hover:text-white"
                    href="https://www.twitter.com/fashion-commerce/" target="_blank"
                  >
                    <FaXTwitter />
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:bg-black hover:text-white"
                    href="https://www.tiktok.com/fashion-commerce/" target="_blank"
                  >
                    <FaTiktok />
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:bg-[#ffcacb] hover:text-[#ff0f1c]"
                    href="https://www.youtube.com/@fashion-commerce" target="_blank"
                  >
                    <FaYoutube />
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:bg-neutral-800 hover:text-neutral-100"
                    href="mailto:info@fashion-commerce"
                  >
                    <FaEnvelope />
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

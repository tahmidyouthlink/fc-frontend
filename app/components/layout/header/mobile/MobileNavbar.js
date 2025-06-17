import { Suspense } from "react";
import Image from "next/image";
import axios from "axios";
import TransitionLink from "@/app/components/ui/TransitionLink";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import Search from "../Search";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import NavButton from "./NavButton";

export default async function MobileNavbar({
  logoWithoutTextSrc,
  logoWithTextSrc,
}) {
  let productList, specialOffers, locations, legalPolicyPdfLinks;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allProducts`,
    );
    productList = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (mobileNav/products):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allOffers`,
    );
    specialOffers = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (mobileNav/specialOffers):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allLocations`,
    );
    locations = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (mobileNav/locations):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  const primaryLocation = locations?.find(
    (location) => location?.isPrimaryLocation == true,
  )?.locationName;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/get-all-policy-pdfs`,
    );
    legalPolicyPdfLinks = response.data[0] || {};
  } catch (error) {
    console.error(
      "Fetch error (mobileNav/legalPolicyPdfLinks):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

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
          <WishlistButton
            productList={productList}
            specialOffers={specialOffers}
          />
          <Suspense fallback={<LoadingSpinner />}>
            <CartButton
              productList={productList}
              specialOffers={specialOffers}
              primaryLocation={primaryLocation}
            />
          </Suspense>
          {/* Navigation button */}
          <NavButton
            logoWithTextSrc={logoWithTextSrc}
            legalPolicyPdfLinks={legalPolicyPdfLinks}
          />
        </ul>
      </div>
    </nav>
  );
}

import { Suspense } from "react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import { authOptions } from "@/app/utils/authOptions";
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
  const session = await getServerSession(authOptions);

  let userData,
    productList,
    specialOffers,
    primaryLocation,
    legalPolicyPdfLinks;

  try {
    const result = await tokenizedFetch(
      `/customerDetailsViaEmail/${session?.user?.email}`,
    );

    userData = result.data || {};
  } catch (error) {
    console.error("FetchError (mobileNav/userData):", error.message);
  }

  try {
    const result = await rawFetch("/allProducts");
    productList = result.data || [];
  } catch (error) {
    console.error("FetchError (mobileNav/products):", error.message);
  }

  try {
    const result = await rawFetch("/allOffers");
    specialOffers = result.data || [];
  } catch (error) {
    console.error("FetchError (mobileNav/specialOffers):", error.message);
  }

  try {
    const result = await rawFetch("/primary-location");
    primaryLocation = result.data?.primaryLocation || null;
  } catch (error) {
    console.error("FetchError (mobileNav/primaryLocation):", error.message);
  }

  try {
    const result = await rawFetch("/get-all-policy-pdfs");
    [legalPolicyPdfLinks] = result.data || [];
  } catch (error) {
    console.error("FetchError (mobileNav/legalPdfLinks):", error.message);
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
            userData={userData}
            productList={productList}
            specialOffers={specialOffers}
          />
          <Suspense fallback={<LoadingSpinner />}>
            <CartButton
              userData={userData}
              productList={productList}
              specialOffers={specialOffers}
              primaryLocation={primaryLocation}
            />
          </Suspense>
          {/* Navigation button */}
          <NavButton
            isLoggedIn={!!userData}
            logoWithTextSrc={logoWithTextSrc}
            legalPolicyPdfLinks={legalPolicyPdfLinks}
          />
        </ul>
      </div>
    </nav>
  );
}

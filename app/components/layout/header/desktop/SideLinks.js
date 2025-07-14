import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import { authOptions } from "@/app/utils/authOptions";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import UserDropdown from "./UserDropdown";

export default async function SideLinks() {
  const session = await getServerSession(authOptions);

  let userData,
    productList,
    specialOffers,
    primaryLocation,
    legalPolicyPdfLinks;

  if (session?.user?.email) {
    try {
      const result = await tokenizedFetch(
        `/customerDetailsViaEmail/${session?.user?.email}`,
      );

      userData = result.data || {};
    } catch (error) {
      console.error("FetchError (desktopNav/userData):", error.message);
    }
  }

  try {
    const result = await rawFetch("/allProducts");
    productList = result.data || [];
  } catch (error) {
    console.error("FetchError (desktopNav/productList):", error.message);
  }

  try {
    const result = await rawFetch("/allOffers");
    specialOffers = result.data || [];
  } catch (error) {
    console.error("FetchError (desktopNav/specialOffers):", error.message);
  }

  try {
    const result = await rawFetch("/primary-location");
    primaryLocation = result.data?.primaryLocation || null;
  } catch (error) {
    console.error("FetchError (desktopNav/primaryLocation):", error.message);
  }

  try {
    const result = await rawFetch("/get-all-policy-pdfs");
    [legalPolicyPdfLinks] = result.data || [];
  } catch (error) {
    console.error("FetchError (desktopNav/legalPdfLinks):", error.message);
  }

  return (
    <div className="text-neutral-600">
      <ul className="flex items-center gap-x-6 text-xs xl:gap-x-7">
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
        <UserDropdown
          isLoggedIn={!!userData}
          userEmail={userData?.email}
          userName={userData?.userInfo?.personalInfo?.customerName}
          legalPolicyPdfLinks={legalPolicyPdfLinks}
        />
      </ul>
    </div>
  );
}

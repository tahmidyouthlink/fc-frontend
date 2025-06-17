import { Suspense } from "react";
import axios from "axios";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import WishlistButton from "../wishlist/WishlistButton";
import CartButton from "../cart/CartButton";
import UserDropdown from "./UserDropdown";

export default async function SideLinks() {
  let productList, specialOffers, locations, legalPolicyPdfLinks;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allProducts`,
    );
    productList = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (desktopNav/productList):",
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
      "Fetch error (desktopNav/specialOffers):",
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
      "Fetch error (desktopNav/locations):",
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
      "Fetch error (desktopNav/legalPolicyPdfLinks):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  return (
    <div className="text-neutral-600">
      <ul className="flex items-center gap-x-6 text-xs xl:gap-x-7">
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
        <UserDropdown legalPolicyPdfLinks={legalPolicyPdfLinks} />
      </ul>
    </div>
  );
}

import axios from "axios";
import { Suspense } from "react";
import ShopContents from "@/app/components/shop/ShopContents";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export const dynamic = "force-dynamic";

export default async function Shop() {
  let products, specialOffers, locations, notifyVariants;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allProducts`,
    );
    products = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (shop/products):",
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
      "Fetch error (shop/specialOffers):",
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
      "Fetch error (shop/locations):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/get-all-availability-notifications`,
    );
    notifyVariants = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (shop/notifyVariants):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  const primaryLocation = locations?.find(
    (location) => location?.isPrimaryLocation == true,
  )?.locationName;

  return (
    <main>
      <div className="relative h-full w-full">
        <div className="fixed left-[5%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
        <div className="fixed left-[5%] top-[15%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s] sm:left-[30%] xl:top-[30%]" />
        <div className="fixed left-[55%] top-[70%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] sm:bg-[var(--color-moving-bubble-primary)]" />
        <div className="fixed left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      </div>
      <div className="pt-header-h-full-section-pb relative flex min-h-dvh overflow-hidden pb-[var(--section-padding)] [&_img]:pointer-events-none">
        <Suspense fallback={<LoadingSpinner />}>
          <ShopContents
            products={products}
            specialOffers={specialOffers}
            primaryLocation={primaryLocation}
            notifyVariants={notifyVariants}
          />
        </Suspense>
      </div>
    </main>
  );
}

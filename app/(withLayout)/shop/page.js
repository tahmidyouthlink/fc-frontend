import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import { authOptions } from "@/app/utils/authOptions";
import ShopContents from "@/app/components/shop/ShopContents";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default async function Shop() {
  const session = await getServerSession(authOptions);

  let userData, products, specialOffers, primaryLocation, notifyVariants;

  if (session?.user?.email) {
    try {
      const result = await tokenizedFetch(
        `/customerDetailsViaEmail/${session?.user?.email}`,
      );

      userData = result.data || {};
    } catch (error) {
      console.error("FetchError (checkout/userData):", error.message);
    }
  }

  try {
    const result = await rawFetch("/allProducts");
    products = result.data || [];
  } catch (error) {
    console.error("FetchError (shop/products):", error.message);
  }

  try {
    const result = await rawFetch("/allOffers");
    specialOffers = result.data || [];
  } catch (error) {
    console.error("FetchError (shop/specialOffers):", error.message);
  }

  try {
    const result = await rawFetch("/primary-location");
    primaryLocation = result.data?.primaryLocation || null;
  } catch (error) {
    console.error("FetchError (shop/primaryLocation):", error.message);
  }

  try {
    const result = await rawFetch("/get-all-availability-notifications");
    notifyVariants = result.data || [];
  } catch (error) {
    console.error("FetchError (shop/notifyVariants):", error.message);
  }

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
            userData={userData}
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

import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import { extractData } from "@/app/lib/extractData";
import { authOptions } from "@/app/utils/authOptions";
import ShopContents from "@/app/components/shop/ShopContents";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default async function Shop() {
  const session = await getServerSession(authOptions);

  const promises = [
    session?.user?.email
      ? tokenizedFetch(`/customerDetailsViaEmail/${session?.user?.email}`)
      : Promise.resolve(null),
    rawFetch("/allProducts"),
    rawFetch("/allOffers"),
    rawFetch("/primary-location"),
    rawFetch("/get-all-availability-notifications"),
  ];

  const [
    userDataRes,
    productsRes,
    offersRes,
    primaryLocationRes,
    notifyVariantsRes,
  ] = await Promise.allSettled(promises);

  const [userData, products, specialOffers, primaryLocation, notifyVariants] = [
    extractData(userDataRes, null, "checkout/userData"),
    extractData(productsRes, [], "shop/products"),
    extractData(offersRes, [], "shop/specialOffers"),
    extractData(
      primaryLocationRes,
      null,
      "shop/primaryLocation",
      "primaryLocation",
    ),
    extractData(notifyVariantsRes, [], "shop/notifyVariants"),
  ];

  return (
    <main>
      <div className="relative h-full w-full">
        <div className="fixed left-[5%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
        <div className="fixed left-[5%] top-[15%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s] sm:left-[30%] xl:top-[30%]" />
        <div className="fixed left-[55%] top-[70%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] sm:bg-[var(--color-moving-bubble-primary)]" />
        <div className="fixed left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      </div>
      <div className="pt-header-h-full-section-pb relative flex min-h-svh overflow-hidden pb-[var(--section-padding)] [&_img]:pointer-events-none">
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

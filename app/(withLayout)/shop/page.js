import { Suspense } from "react";
import ShopContents from "@/app/components/shop/ShopContents";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function Shop() {
  return (
    <main className="pt-header-h-full-section-pb relative flex min-h-dvh overflow-hidden pb-[var(--section-padding)] [&_img]:pointer-events-none">
      <div className="absolute -left-3 top-28 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl min-[1200px]:fixed" />
      <div className="absolute -bottom-20 -right-3 z-[-1] size-40 rounded-full bg-[#d3f9ce] blur-3xl lg:-bottom-5 min-[1200px]:fixed" />
      <Suspense fallback={<LoadingSpinner />}>
        <ShopContents />
      </Suspense>
    </main>
  );
}

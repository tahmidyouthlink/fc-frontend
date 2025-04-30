import { Suspense } from "react";
import ShopContents from "@/app/components/shop/ShopContents";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function Shop() {
  return (
    <main>
      <div className="relative h-full w-full">
        <div className="fixed left-[5%] top-[60%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md max-sm:hidden" />
        <div className="fixed left-[5%] top-[15%] size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:1.5s] sm:left-[30%] xl:top-[30%]" />
        <div className="fixed left-[55%] top-[70%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md [animation-delay:0.5s] sm:bg-[#d3f9ce]" />
        <div className="fixed left-[80%] top-1/3 size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md [animation-delay:2s] max-sm:hidden" />
      </div>
      <div className="pt-header-h-full-section-pb relative flex min-h-dvh overflow-hidden pb-[var(--section-padding)] [&_img]:pointer-events-none">
        <Suspense fallback={<LoadingSpinner />}>
          <ShopContents />
        </Suspense>
      </div>
    </main>
  );
}

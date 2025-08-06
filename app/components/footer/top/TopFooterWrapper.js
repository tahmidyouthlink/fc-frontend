"use client";

import { usePathname } from "next/navigation";

export default function TopFooterWrapper({ bannerImgPosition, children }) {
  const pathname = usePathname();

  if (!pathname.includes("checkout"))
    return (
      <div className="relative bg-[var(--color-primary-300)]">
        <div
          className={`flex flex-col items-center justify-evenly gap-12 overflow-hidden px-5 py-14 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${bannerImgPosition !== "center" ? "md:flex-row md:gap-5 md:py-[72px]" : "md:flex-col md:gap-12 md:py-14"}`}
        >
          {children}
        </div>
      </div>
    );
}

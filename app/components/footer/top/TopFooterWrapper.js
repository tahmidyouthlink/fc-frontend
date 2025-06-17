"use client";

import { usePathname } from "next/navigation";

export default function TopFooterWrapper({ bannerImgPosition, children }) {
  const pathname = usePathname();

  if (!pathname.includes("checkout"))
    return (
      <div className="relative bg-[var(--color-primary-300)]">
        <div
          className={`flex items-center justify-evenly overflow-hidden px-5 py-14 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${bannerImgPosition !== "center" ? "gap-5 py-[72px]" : "flex-col gap-12 py-14"}`}
        >
          {children}
        </div>
      </div>
    );
}

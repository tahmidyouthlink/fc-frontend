"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import MobileNavbar from "./mobile/MobileNavbar";
import DesktopNavbar from "./desktop/DesktopNavbar";
import TopHeader from "./TopHeader";

export default function Header({
  isTopHeaderEnabled,
  slides,
  slideDuration,
  isAutoSlideEnabled,
  bgColor,
  textColor,
}) {
  const { isUserLoading } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [productList, isProductListLoading, refetch] = useProductsInformation();

  useEffect(() => {
    setIsPageLoading(
      isUserLoading || isProductListLoading || !productList?.length,
    );

    return () => setIsPageLoading(false);
  }, [isUserLoading, isProductListLoading, productList, setIsPageLoading]);

  return (
    <header className="absolute z-10 w-full bg-white shadow-[5px_5px_24px_0_rgba(0,0,0,0.035)]">
      {isTopHeaderEnabled && (
        <TopHeader
          slides={slides}
          slideDuration={slideDuration}
          isAutoSlideEnabled={isAutoSlideEnabled}
          bgColor={bgColor}
          textColor={textColor}
        />
      )}
      <div className="mx-auto flex items-center justify-between px-5 py-3 transition-[padding-bottom] duration-300 ease-in-out sm:px-8 sm:py-3.5 lg:px-12 lg:py-4 xl:max-w-[1200px] xl:px-0">
        <MobileNavbar productList={productList} />
        <DesktopNavbar productList={productList} />
      </div>
    </header>
  );
}

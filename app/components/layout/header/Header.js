"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import MobileNavbar from "./mobile/MobileNavbar";
import DesktopNavbar from "./desktop/DesktopNavbar";

export default function Header() {
  const { isUserLoading } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [productList, isProductListLoading, refetch] = useProductsInformation();
  const [isMobileSearchSelected, setIsMobileSearchSelected] = useState(false);

  useEffect(() => {
    setIsPageLoading(
      isUserLoading || isProductListLoading || !productList?.length,
    );

    return () => setIsPageLoading(false);
  }, [isUserLoading, isProductListLoading, productList]);

  return (
    <header
      className={`absolute z-10 w-full bg-white px-5 pt-4 text-black shadow-[5px_5px_24px_0_rgba(0,0,0,0.035)] transition-[padding-bottom] duration-300 ease-in-out sm:px-8 sm:pt-5 lg:px-12 lg:py-6 ${isMobileSearchSelected ? "pb-16 sm:pb-20" : "pb-4 sm:pb-5"}`}
    >
      <div className="mx-auto flex items-center justify-between xl:max-w-[1200px]">
        <MobileNavbar
          productList={productList}
          isMobileSearchSelected={isMobileSearchSelected}
          setIsMobileSearchSelected={setIsMobileSearchSelected}
        />
        <DesktopNavbar productList={productList} />
      </div>
    </header>
  );
}

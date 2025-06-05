import Image from "next/image";
import { Suspense } from "react";
import MainLinks from "./MainLinks";
import Search from "../Search";
import SideLinks from "./SideLinks";
import TransitionLink from "@/app/components/ui/TransitionLink";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";
import logoImage from "@/public/logos/logo.png";

export default function DesktopNavbar({ productList }) {
  return (
    <nav className="flex w-full items-center justify-between text-sm max-lg:hidden">
      <TransitionLink href="/">
        <Image
          className="h-9 w-auto"
          src={logoImage}
          alt={`${process.env.WEBSITE_NAME} logo`}
        />
      </TransitionLink>
      <Suspense fallback={<LoadingSpinner />}>
        <MainLinks />
        <Search />
      </Suspense>
      <SideLinks productList={productList} />
    </nav>
  );
}

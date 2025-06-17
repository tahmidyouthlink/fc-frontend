import Image from "next/image";
import { Suspense } from "react";
import MainLinks from "./MainLinks";
import Search from "../Search";
import SideLinks from "./SideLinks";
import TransitionLink from "@/app/components/ui/TransitionLink";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function DesktopNavbar({ logoWithTextSrc }) {
  return (
    <nav className="flex w-full items-center justify-between text-sm max-lg:hidden">
      <TransitionLink href="/">
        <Image
          className="h-9 w-auto"
          src={logoWithTextSrc}
          alt={`${process.env.NEXT_PUBLIC_WEBSITE_NAME} logo`}
          height={0}
          width={0}
          sizes="150px"
        />
      </TransitionLink>
      <Suspense fallback={<LoadingSpinner />}>
        <MainLinks />
        <Search />
      </Suspense>
      <SideLinks />
    </nav>
  );
}

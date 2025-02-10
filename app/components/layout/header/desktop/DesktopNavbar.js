import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";
import MainLinks from "./MainLinks";
import Search from "../Search";
import SideLinks from "./SideLinks";
import logoImage from "@/public/logos/logo.png";

export default function DesktopNavbar({ productList }) {
  return (
    <nav className="flex w-full items-center justify-between text-sm max-lg:hidden md:text-[15px]">
      <TransitionLink href="/">
        <Image className="h-10 w-auto" src={logoImage} alt="F-commerce logo" />
      </TransitionLink>
      <MainLinks />
      <Search />
      <SideLinks productList={productList} />
    </nav>
  );
}

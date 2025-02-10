import Image from "next/image";
import { useAuth } from "@/app/contexts/auth";
import logoImage from "/public/logos/logo.png";
import TransitionLink from "@/app/components/ui/TransitionLink";
import Drawer from "@/app/components/shared/Drawer";
import MenuSection from "./MenuSection";
import OrderSection from "./OrderSection";
import AccountSection from "./AccountSection";

export default function NavMenu({ isNavMenuOpen, setIsNavMenuOpen }) {
  const { user } = useAuth();

  return (
    <Drawer
      isDrawerOpen={isNavMenuOpen}
      setIsDrawerOpen={setIsNavMenuOpen}
      drawerBgId="nav-menu-bg"
      drawerResponsiveWidths="w-2/3 min-[480px]:w-1/2 sm:w-2/5"
    >
      <nav className="mobile space-y-7">
        {/* Logo */}
        <TransitionLink
          className="inline-block"
          href="/"
          hasDrawer={true}
          setIsDrawerOpen={setIsNavMenuOpen}
        >
          <Image
            className="h-8 w-auto"
            src={logoImage}
            alt="YouthLink logo with white text"
          />
        </TransitionLink>
        <MenuSection setIsNavMenuOpen={setIsNavMenuOpen} />
        <OrderSection user={user} setIsNavMenuOpen={setIsNavMenuOpen} />
        <AccountSection user={user} setIsNavMenuOpen={setIsNavMenuOpen} />
      </nav>
    </Drawer>
  );
}

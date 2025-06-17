import Image from "next/image";
import { Suspense } from "react";
import { useAuth } from "@/app/contexts/auth";
import TransitionLink from "@/app/components/ui/TransitionLink";
import Drawer from "@/app/components/shared/Drawer";
import MenuSection from "./MenuSection";
import OrderSection from "./OrderSection";
import AccountSection from "./AccountSection";
import LoadingSpinner from "@/app/components/shared/LoadingSpinner";

export default function NavMenu({
  isNavMenuOpen,
  setIsNavMenuOpen,
  logoWithTextSrc,
  legalPolicyPdfLinks,
}) {
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
            src={logoWithTextSrc}
            alt={`${process.env.NEXT_PUBLIC_WEBSITE_NAME} logo`}
            height={0}
            width={0}
            sizes="150px"
          />
        </TransitionLink>
        <Suspense fallback={<LoadingSpinner />}>
          <MenuSection setIsNavMenuOpen={setIsNavMenuOpen} />
        </Suspense>
        <OrderSection user={user} setIsNavMenuOpen={setIsNavMenuOpen} />
        <AccountSection
          user={user}
          setIsNavMenuOpen={setIsNavMenuOpen}
          legalPolicyPdfLinks={legalPolicyPdfLinks}
        />
      </nav>
    </Drawer>
  );
}

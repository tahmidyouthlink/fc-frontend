import { usePathname, useSearchParams } from "next/navigation";
import { PiBagSimple, PiGift, PiUsersThree } from "react-icons/pi";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function MenuSection({ setIsNavMenuOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <ul className="space-y-1 text-xs md:text-[13px]">
      <li>
        <TransitionLink
          href="/story"
          hasDrawer={true}
          setIsDrawerOpen={setIsNavMenuOpen}
          className={pathname.startsWith("/story") ? "active" : undefined}
        >
          <PiUsersThree />
          Souls
        </TransitionLink>
      </li>
      <li>
        <TransitionLink
          href="/shop?filterBy=New+Arrivals"
          hasDrawer={true}
          setIsDrawerOpen={setIsNavMenuOpen}
          className={
            searchParams.get("filterBy") === "New Arrivals" ? "active" : ""
          }
        >
          <PiGift />
          Buzz
        </TransitionLink>
      </li>
      <li>
        <TransitionLink
          href="/shop"
          hasDrawer={true}
          setIsDrawerOpen={setIsNavMenuOpen}
          className={
            pathname.startsWith("/shop") && !searchParams.get("filterBy")
              ? "active"
              : undefined
          }
        >
          <PiBagSimple />
          Threadz
        </TransitionLink>
      </li>
    </ul>
  );
}

import { usePathname, useSearchParams } from "next/navigation";
import { PiBagSimple, PiGift, PiUsersThree } from "react-icons/pi";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function MenuSection({ setIsNavMenuOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <h5 className="text-[10px] font-semibold text-neutral-500">MENU</h5>
      <hr className="my-2 h-0.5 w-full bg-neutral-100" />
      <ul className="space-y-1 text-xs md:text-[13px]">
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
            Shop
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
            Latest
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            href="/our-story"
            hasDrawer={true}
            setIsDrawerOpen={setIsNavMenuOpen}
            className={pathname.startsWith("/our-story") ? "active" : undefined}
          >
            <PiUsersThree />
            Story
          </TransitionLink>
        </li>
      </ul>
    </div>
  );
}

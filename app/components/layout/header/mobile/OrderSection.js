import { usePathname } from "next/navigation";
import { PiPackage, PiTruck } from "react-icons/pi";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function OrderSection({ user, setIsNavMenuOpen }) {
  const pathname = usePathname();

  return (
    <div>
      <h5 className="text-[10px] font-semibold text-neutral-500">ORDER</h5>
      <hr className="my-2 h-0.5 w-full bg-neutral-100" />
      <ul className="space-y-2 text-xs md:text-[13px]">
        <li>
          <TransitionLink
            href="/order-tracking"
            hasDrawer={true}
            setIsDrawerOpen={setIsNavMenuOpen}
            className={pathname.includes("order-tracking") ? "active" : ""}
          >
            <PiTruck />
            Order Tracking
          </TransitionLink>
        </li>
        {!!user && (
          <li>
            <TransitionLink
              href="/user/orders"
              hasDrawer={true}
              setIsDrawerOpen={setIsNavMenuOpen}
              className={pathname.includes("user/orders") ? "active" : ""}
            >
              <PiPackage />
              Order History
            </TransitionLink>
          </li>
        )}
      </ul>
    </div>
  );
}

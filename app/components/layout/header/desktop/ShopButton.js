import { usePathname, useSearchParams } from "next/navigation";
import { IoBagOutline } from "react-icons/io5";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function ShopButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <li>
      <TransitionLink
        className={`flex items-center gap-1.5 ${pathname.startsWith("/shop") && !searchParams.get("filterBy") ? "text-neutral-900" : "hover:text-neutral-700"}`}
        href="/shop"
      >
        <IoBagOutline className="text-lg" />
        Shop
      </TransitionLink>
    </li>
  );
}

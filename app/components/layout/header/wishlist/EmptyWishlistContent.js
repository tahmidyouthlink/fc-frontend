import { TbHeartExclamation } from "react-icons/tb";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function EmptyWishlistContent({ setIsDropdownOpen }) {
  return (
    <div className="[&>*]:mx-auto [&>*]:w-fit">
      <TbHeartExclamation className="size-24 text-[var(--color-secondary-500)]" />
      <p className="mt-2 text-neutral-400">The wishlist is empty.</p>
      <TransitionLink
        hasDrawer={true}
        setIsDrawerOpen={setIsDropdownOpen}
        href="/shop"
        className="mt-7 block rounded-lg bg-[var(--color-primary-500)] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
      >
        Let&apos;s Shop
      </TransitionLink>
    </div>
  );
}

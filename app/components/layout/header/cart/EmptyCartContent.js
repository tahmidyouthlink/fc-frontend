import { TbShoppingCartExclamation } from "react-icons/tb";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function EmptyCartContent({ setIsDropdownOpen }) {
  return (
    <div className="mb-2 [&>*]:mx-auto [&>*]:w-fit">
      <TbShoppingCartExclamation className="size-24 text-[var(--color-secondary-500)]" />
      <p className="mt-2 text-neutral-400">The cart is empty.</p>
      <TransitionLink
        href="/shop"
        hasDrawer={true}
        setIsDrawerOpen={setIsDropdownOpen}
        className="mt-7 block rounded-[4px] bg-[var(--color-primary-500)] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
      >
        Let&apos;s Shop
      </TransitionLink>
    </div>
  );
}

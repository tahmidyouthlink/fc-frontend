import { TbShoppingCartExclamation } from "react-icons/tb";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function CheckoutEmpty() {
  return (
    <div className="pt-header-h-full-section-pb flex min-h-dvh flex-col items-center justify-center font-semibold [&>*]:w-fit">
      <TbShoppingCartExclamation className="size-24 text-[var(--color-secondary-500)]" />
      <p className="mt-2 text-neutral-400">The cart is empty.</p>
      <TransitionLink
        href="/shop"
        className="mt-9 block rounded-[4px] bg-[var(--color-primary-500)] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
      >
        Return to Shop
      </TransitionLink>
    </div>
  );
}

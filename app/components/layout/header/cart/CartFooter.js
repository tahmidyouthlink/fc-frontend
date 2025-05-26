import TransitionLink from "@/app/components/ui/TransitionLink";

export default function CartFooter({ subtotal, setIsDropdownOpen }) {
  return (
    <div className="sticky bottom-0 space-y-4 bg-white px-2 pb-2 font-semibold">
      {/* Divider */}
      <hr className="h-0.5 w-full bg-neutral-100" />
      {/* Subtotal */}
      <div className="flex justify-between">
        <h5 className="text-neutral-400">Subtotal</h5>
        <span>৳ {subtotal}</span>
      </div>
      <div className="flex gap-x-2.5 text-neutral-700">
        {/* Shop Page Button */}
        <TransitionLink
          href="/shop"
          hasDrawer={true}
          setIsDrawerOpen={setIsDropdownOpen}
          className="block w-full rounded-lg bg-[var(--color-primary-regular)] py-2.5 text-center text-sm transition-[background-color] duration-300 hover:bg-[var(--color-primary-dark)]"
        >
          Continue Shopping
        </TransitionLink>
        {/* Checkout Page Button */}
        <TransitionLink
          href="/checkout"
          hasDrawer={true}
          setIsDrawerOpen={setIsDropdownOpen}
          className="block w-full rounded-lg bg-[var(--color-secondary-regular)] py-2.5 text-center text-sm transition-[background-color] duration-300 hover:bg-[var(--color-secondary-dark)]"
        >
          Checkout
        </TransitionLink>
      </div>
    </div>
  );
}

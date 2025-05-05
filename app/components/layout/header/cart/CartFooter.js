import TransitionLink from "@/app/components/ui/TransitionLink";

export default function CartFooter({ subtotal }) {
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
          className="block w-full rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
        >
          Continue Shopping
        </TransitionLink>
        {/* Checkout Page Button */}
        <TransitionLink
          href="/checkout"
          className="block w-full rounded-lg bg-[#ffddc2] py-2.5 text-center text-sm transition-[background-color] duration-300 hover:bg-[#fbcfb0]"
        >
          Checkout
        </TransitionLink>
      </div>
    </div>
  );
}

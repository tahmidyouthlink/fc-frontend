import TransitionLink from "@/app/components/ui/TransitionLink";

export default function WishlistFooter({ setIsDropdownOpen }) {
  return (
    <div className="sticky bottom-0 space-y-4 font-semibold">
      <hr className="h-0.5 w-full bg-neutral-100" />
      {/* Shop Page Button */}
      <TransitionLink
        href="/shop"
        hasDrawer={true}
        setIsDrawerOpen={setIsDropdownOpen}
        className="block w-full rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
      >
        Continue Shopping
      </TransitionLink>
    </div>
  );
}

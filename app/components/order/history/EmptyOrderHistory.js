import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function EmptyOrderHistory() {
  return (
    <section className="bottom-[var(--section-padding)] top-[var(--section-padding)] grow auto-rows-max rounded-xl border-2 border-neutral-50/20 bg-white/60 p-3.5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl lg:sticky xl:p-5">
      <div className="flex min-h-full flex-col items-center justify-center font-semibold">
        <HiOutlineArchiveBoxXMark className="size-24 text-[var(--color-secondary-500)]" />
        <p className="mt-2 text-neutral-400">
          You haven&apos;t placed any order yet.
        </p>
        <TransitionLink
          href="/shop"
          className="mt-9 block rounded-lg bg-[var(--color-primary-500)] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
        >
          Return to Shop
        </TransitionLink>
      </div>
    </section>
  );
}

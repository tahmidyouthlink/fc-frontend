"use client";

import { usePathname, useSearchParams } from "next/navigation";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function MainLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="font-semibold text-neutral-400">
      <ul className="flex items-center gap-x-3.5 xl:gap-x-9 [&_a]:transition-[color] [&_a]:duration-300 [&_a]:ease-in-out">
        <li>
          <TransitionLink
            className={
              pathname.startsWith("/story")
                ? "text-neutral-800"
                : "hover:text-neutral-500"
            }
            href="/story"
          >
            Souls
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            className={
              searchParams.get("filterBy") === "New Arrivals"
                ? "text-neutral-800"
                : "hover:text-neutral-500"
            }
            href="/shop?filterBy=New+Arrivals"
          >
            Buzz
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            className={
              pathname.startsWith("/shop") && !searchParams.get("filterBy")
                ? "text-neutral-800"
                : "hover:text-neutral-500"
            }
            href="/shop"
          >
            Threadz
          </TransitionLink>
        </li>
      </ul>
    </div>
  );
}

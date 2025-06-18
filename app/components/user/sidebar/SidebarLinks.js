"use client";

import { usePathname } from "next/navigation";
import { RiUser3Line, RiBox3Line, RiLockLine } from "react-icons/ri";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function SidebarLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex grow items-center gap-1 sm:block sm:space-y-2 [&_p]:text-xs max-sm:[&_p]:hidden md:[&_p]:text-[13px] [&_svg]:size-5 max-sm:[&_svg]:mx-auto sm:[&_svg]:size-4">
      <li>
        <TransitionLink
          href="/user/orders"
          className={
            pathname.includes("orders")
              ? "bg-[var(--color-primary-400)] font-semibold text-[var(--color-primary-900)]"
              : ""
          }
        >
          <RiBox3Line />
          <p>Order History</p>
        </TransitionLink>
      </li>
      <li>
        <TransitionLink
          href="/user/profile"
          className={
            pathname.includes("profile")
              ? "bg-[var(--color-primary-400)] font-semibold text-[var(--color-primary-900)]"
              : ""
          }
        >
          <RiUser3Line />
          <p>Profile</p>
        </TransitionLink>
      </li>
      <li>
        <TransitionLink
          href="/user/security"
          className={
            pathname.includes("security")
              ? "bg-[var(--color-primary-400)] font-semibold text-[var(--color-primary-900)]"
              : ""
          }
        >
          <RiLockLine />
          <p>Security</p>
        </TransitionLink>
      </li>
    </ul>
  );
}

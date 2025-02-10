"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import {
  RiUser3Line,
  RiBox3Line,
  RiLockLine,
  RiNotification3Line,
} from "react-icons/ri";
import { useAuth } from "@/app/contexts/auth";
import avatarImage from "/public/auth/user.webp";
import TransitionLink from "@/app/components/ui/TransitionLink";
import getUserStatusInfo from "@/app/utils/getUserStatusInfo";

export default function UserSidebar() {
  const pathname = usePathname();
  const { userData } = useAuth();
  const userEmail = userData?.email;
  const userName = userData?.userInfo?.personalInfo?.customerName;

  const userStatus = !userData
    ? undefined
    : getUserStatusInfo(userData.userInfo?.score);

  return (
    <section className="user-sidebar sticky top-5 z-[1] max-h-[calc(100dvh-24px)] gap-3.5 rounded-xl border-2 border-neutral-50/20 bg-white/60 p-3.5 py-4 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] backdrop-blur-2xl max-sm:flex sm:max-h-[calc(100dvh-100px-16px)] sm:min-w-[275px] sm:p-5 sm:shadow-[0_0_20px_0_rgba(0,0,0,0.05)] lg:max-h-[calc(100dvh-112px-24px)] lg:min-w-[300px]">
      <Popover className="sm:hidden" placement="bottom-start" offset={12}>
        <PopoverTrigger className="sm:hidden">
          <div
            className="relative size-12 rounded-full border"
            style={{
              borderColor: userStatus?.imgColor || "#848484",
              backgroundColor: userStatus?.imgColor || "#848484",
            }}
          >
            <Image
              src={avatarImage}
              alt="User avatar"
              className="size-full rounded-full mix-blend-hard-light"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="items-start p-3.5 sm:hidden">
          <p
            className="w-fit rounded-[4px] border p-1 text-xs font-bold"
            style={{
              borderColor: userStatus?.borderColor || "#e5e5e5",
              color: userStatus?.textColor || "#525252",
              backgroundColor: userStatus?.backgroundColor || "#f5f5f5",
            }}
          >
            {userStatus?.title || "Unknown"}
          </p>
          <h5 className="mt-1 text-sm font-semibold text-neutral-600">
            {userName}
          </h5>
          <p className="text-xs font-semibold text-neutral-500">{userEmail}</p>
        </PopoverContent>
      </Popover>
      <div className="mb-7 flex w-full items-center gap-x-4 max-sm:hidden">
        <div
          className="relative size-14 rounded-full border"
          style={{
            borderColor: userStatus?.imgColor || "#848484",
            backgroundColor: userStatus?.imgColor || "#848484",
          }}
        >
          <Image
            src={avatarImage}
            alt="User avatar"
            className="size-full rounded-full mix-blend-hard-light"
          />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-neutral-600">{userName}</h5>
          <p className="-mt-1 text-[11px] font-semibold text-neutral-500">
            {userEmail}
          </p>
          <p
            className="w-fit rounded-[4px] border p-[5px] text-[10px]/[10px] font-bold"
            style={{
              borderColor: userStatus?.borderColor || "#e5e5e5",
              color: userStatus?.textColor || "#525252",
              backgroundColor: userStatus?.backgroundColor || "#f5f5f5",
            }}
          >
            {userStatus?.title || "Unknown"}
          </p>
        </div>
      </div>
      <div className="min-h-full border-l-2 border-neutral-300 sm:hidden" />
      <ul className="flex grow items-center gap-1 sm:block sm:space-y-2 [&_p]:text-xs max-sm:[&_p]:hidden md:[&_p]:text-[13px] [&_svg]:size-5 max-sm:[&_svg]:mx-auto sm:[&_svg]:size-4">
        <li>
          <TransitionLink
            href="/user/orders"
            className={
              pathname.includes("orders")
                ? "bg-green-100 font-semibold text-green-600"
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
                ? "bg-green-100 font-semibold text-green-600"
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
                ? "bg-green-100 font-semibold text-green-600"
                : ""
            }
          >
            <RiLockLine />
            <p>Security</p>
          </TransitionLink>
        </li>
        <li>
          <TransitionLink
            href="/user/notifications"
            className={
              pathname.includes("notifications")
                ? "bg-green-100 font-semibold text-green-600"
                : ""
            }
          >
            <RiNotification3Line />
            <p>Notifications</p>
          </TransitionLink>
        </li>
      </ul>
    </section>
  );
}

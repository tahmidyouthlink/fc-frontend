"use client";

import { useEffect } from "react";

export default function Drawer({
  isDrawerOpen,
  setIsDrawerOpen,
  drawerBgId,
  drawerResponsiveWidths,
  children,
}) {
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "unset";
  }, [isDrawerOpen]);

  return (
    <div
      className={`fixed inset-0 z-[1] h-dvh w-dvw overflow-y-auto overflow-x-hidden text-sm transition-[background-color] duration-500 ease-in-out md:text-base [&::-webkit-scrollbar]:[-webkit-appearance:scrollbarthumb-vertical] ${isDrawerOpen ? "pointer-events-auto bg-neutral-700/60 delay-0" : "pointer-events-none bg-neutral-700/0 delay-100"}`}
      id={drawerBgId}
      onClick={(event) =>
        event.target.id === drawerBgId && setIsDrawerOpen(false)
      }
    >
      <div
        className={`ml-auto flex min-h-full flex-col justify-between rounded-l-md bg-neutral-50 px-5 pt-5 text-neutral-500 transition-[transform] delay-200 duration-300 ease-in-out sm:px-6 sm:pt-6 ${drawerResponsiveWidths} ${isDrawerOpen ? "translate-x-0 delay-200" : "translate-x-full delay-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

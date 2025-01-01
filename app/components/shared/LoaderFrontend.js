"use client";

import { useLoading } from "@/app/contexts/loading";

export default function LoaderFrontend() {
  const { isPageLoading } = useLoading();

  if (isPageLoading)
    return (
      <div className="fixed inset-0 z-[100] flex h-dvh w-dvw items-center justify-center bg-neutral-500/50 backdrop-blur-md">
        <span className="size-12 animate-spin rounded-full border-5 border-[#ffddc2] border-r-transparent"></span>
      </div>
    );
}

"use client";

import UserSidebar from "@/app/components/user/UserSidebar";

export default function UserLayout({ children }) {
  return (
    <main className="relative -mt-[calc(240*3px)] text-sm text-neutral-500 md:text-base [&_:is(h1,h2,h3)]:text-neutral-600">
      <div className="sticky left-[5%] top-[55%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md" />
      <div className="sticky left-[45%] top-2/3 size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:1s]" />
      <div className="sticky left-[80%] top-[25%] size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:2s]" />
      <div className="relative flex w-full flex-col gap-x-2 gap-y-3 px-5 pb-5 pt-20 sm:flex-row sm:gap-3 sm:px-8 sm:pt-24 lg:gap-4 lg:px-12 lg:pb-6 lg:pt-28 xl:mx-auto xl:min-h-dvh xl:max-w-[1200px] xl:px-0">
        <UserSidebar />
        {children}
      </div>
    </main>
  );
}

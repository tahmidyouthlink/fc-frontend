import UserSidebar from "@/app/components/user/sidebar/UserSidebar";

export default function UserLayout({ children }) {
  return (
    <main className="relative -mt-[calc(256*4px)] text-sm text-neutral-500 max-sm:-mt-[calc(256*2px)] md:text-base [&_:is(h1,h2,h3)]:text-neutral-600">
      <div className="sticky left-[5%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
      <div className="sticky left-[5%] top-[15%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s] sm:left-[30%] xl:top-[30%]" />
      <div className="sticky left-[55%] top-[70%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] sm:bg-[var(--color-moving-bubble-primary)]" />
      <div className="sticky left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      <div className="pt-header-h-full-section-pb relative flex w-full flex-col gap-x-2 gap-y-3 px-5 pb-[var(--section-padding)] sm:flex-row sm:gap-3 sm:px-8 lg:gap-4 lg:px-12 xl:mx-auto xl:min-h-svh xl:max-w-[1200px] xl:px-0">
        <UserSidebar />
        {children}
      </div>
    </main>
  );
}

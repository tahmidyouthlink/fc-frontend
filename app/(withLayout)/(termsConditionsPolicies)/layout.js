export default function TermsConditionsPoliciesLayout({ children }) {
  return (
    <main className="relative -mt-[calc(240*4px)] min-h-dvh bg-[#f0f0f0] pb-5 pt-20 text-sm text-neutral-500 sm:pt-24 md:text-base lg:pb-6 lg:pt-28">
      <div className="sticky left-[5%] top-1/2 size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md" />
      <div className="sticky left-[30%] top-[20%] size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:1.5s]" />
      <div className="sticky left-[55%] top-[60%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md [animation-delay:0.5s]" />
      <div className="sticky left-[80%] top-1/3 size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:2s]" />
      <div className="z-[1] mx-5 min-h-[calc(100dvh-112px-24px)] max-w-[900px] items-stretch overflow-hidden rounded-xl border-2 border-neutral-50/20 bg-white/40 backdrop-blur-2xl sm:mx-8 lg:mx-auto lg:flex">
        <section className="p-5 sm:p-7 xl:p-9 [&_:is(h1,h2)]:font-semibold [&_:is(h1,h2)]:uppercase [&_:is(h1,h2)]:text-neutral-600 [&_h1]:mb-3 [&_h1]:text-[28px]/[35px] [&_h2]:mb-3 [&_h2]:mt-11 [&_h2]:text-xl [&_p:last-child]:mb-0 [&_p]:mb-4 [&_p]:text-justify">
          {children}
        </section>
      </div>
    </main>
  );
}

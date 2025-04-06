export default function TermsConditionsPoliciesLayout({ children }) {
  return (
    <main className="relative -mt-[calc(240*4px)] bg-[#f0f0f0] text-sm text-neutral-500 md:text-base [&_:is(h1,h2,h3)]:font-semibold [&_:is(h1,h2,h3)]:uppercase [&_:is(h1,h2,h3)]:text-neutral-600">
      {/* Mesh Gradients */}
      <div className="sticky left-[5%] top-1/2 size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md" />
      <div className="sticky left-[30%] top-[20%] size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:1.5s]" />
      <div className="sticky left-[55%] top-[60%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md [animation-delay:0.5s]" />
      <div className="sticky left-[80%] top-1/3 size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:2s]" />
      {children}
    </main>
  );
}

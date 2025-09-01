export default function TermsConditionsPoliciesLayout({ children }) {
  return (
    <main className="relative -mt-[calc(256*4px)] text-sm text-neutral-500 max-sm:-mt-[calc(256*2px)] md:text-base [&_:is(h1,h2,h3)]:font-semibold [&_:is(h1,h2,h3)]:uppercase [&_:is(h1,h2,h3)]:text-neutral-600">
      {/* Mesh Gradients */}
      <div className="sticky left-[5%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
      <div className="sticky left-[5%] top-[15%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s] sm:left-[30%] xl:top-[30%]" />
      <div className="sticky left-[55%] top-[70%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:0.5s] sm:bg-[var(--color-moving-bubble-secondary)]" />
      <div className="sticky left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:2s] max-sm:hidden" />
      {children}
    </main>
  );
}

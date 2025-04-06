import FAQs from "./faqs";

export default function LegalDoc({ pageTitle, docContent, faqs }) {
  return (
    <div className="pt-header-h-full-section-pb min-h-dvh pb-[var(--section-padding)]">
      {/* Document Title */}
      <h1 className="mb-7 text-center text-[32px]/[35px]">{pageTitle}</h1>
      {/* Document Wrapper */}
      <div className="z-[1] mx-5 max-w-[900px] items-stretch overflow-hidden rounded-xl border-2 border-neutral-50/20 bg-white/40 backdrop-blur-2xl sm:mx-8 lg:mx-auto lg:flex">
        {/* Document */}
        <section
          className={`p-5 sm:p-7 xl:p-9 [&_:is(h2,h3)]:mb-3 [&_h2]:text-xl [&_h3]:text-lg [&_p]:mb-4 [&_p]:text-justify ${!faqs?.length ? "[&_p:last-child]:mb-0" : "[&_p:last-child]:mb-10"}`}
        >
          {/* Texts */}
          <div
            dangerouslySetInnerHTML={{
              __html: docContent,
            }}
          ></div>
          {/* Accordions/FAQs (if any) */}
          {faqs?.length && <FAQs faqs={faqs} />}
        </section>
      </div>
    </div>
  );
}

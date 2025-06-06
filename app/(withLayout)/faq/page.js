import axios from "axios";
import FAQs from "@/app/components/legal/faqs";

export const dynamic = "force-dynamic";

export default async function FAQ() {
  let pageTitle, faqDescription, faqs;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/all-faqs`,
    );
    const [data] = response.data || [];

    pageTitle = data?.pageTitle;
    faqDescription = data?.faqDescription;
    faqs = data?.faqs;
  } catch (error) {
    console.error(
      "Fetch error (faq):",
      error.response?.data?.message || error.response?.data,
    );
  }

  return (
    <main className="relative -mt-[calc(256*4px)] bg-neutral-100 text-sm text-neutral-500 max-sm:-mt-[calc(256*2px)] md:text-base [&_h1]:font-semibold [&_h1]:uppercase [&_h1]:text-neutral-600">
      {/* Left Mesh Gradient */}
      <div className="sticky left-[5%] top-[55%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
      {/* Middle-Left Mesh Gradient */}
      <div className="sticky left-[30%] top-[5%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s] max-sm:left-[5%]" />
      {/* Middle-Right Mesh Gradient */}
      <div className="sticky left-[55%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] max-sm:left-3/4" />
      {/* Right Mesh Gradient */}
      <div className="sticky left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:2s] max-sm:hidden" />
      <div className="pt-header-h-full-section-pb min-h-dvh pb-[var(--section-padding)]">
        {/* FAQ Title */}
        <h1 className="mb-7 pt-5 text-center text-xl/[1] sm:text-[32px]/[1]">
          {pageTitle}
        </h1>
        {/* FAQ Wrapper */}
        <div className="z-[1] mx-5 max-w-[900px] items-stretch overflow-hidden rounded-md border-2 border-neutral-50/20 bg-white/40 backdrop-blur-2xl sm:mx-8 lg:mx-auto lg:flex">
          {/* Document */}
          <section className="p-5 sm:p-7 xl:p-9 [&_p]:-mt-2 [&_p]:pb-2">
            {/* FAQ Description */}
            <div
              dangerouslySetInnerHTML={{
                __html: faqDescription,
              }}
            ></div>
            {/* Accordions/FAQs */}
            <FAQs faqs={faqs} />
          </section>
        </div>
      </div>
    </main>
  );
}

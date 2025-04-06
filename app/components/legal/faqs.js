"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function FAQs({ faqs }) {
  return (
    <Accordion>
      {faqs.map((faq, index) => {
        return (
          <AccordionItem
            key={faq.question + index}
            aria-label={faq.question}
            title={faq.question}
            className="[&_h2>button_span]:font-normal [&_h2]:!my-2"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: faq.answer,
              }}
            ></div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

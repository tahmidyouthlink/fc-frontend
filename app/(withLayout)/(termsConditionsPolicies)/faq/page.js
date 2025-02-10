"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function RefundPolicy() {
  const faqs = [
    {
      title: "What is F-commerce?",
      description:
        "F-commerce, or Fashion-commerce, is our approach to providing exclusive, seasonally curated fashion collections online. We focus on offering unique clothing pieces that aren't widely available elsewhere, catering to those who value style and exclusivity for each season. Through F-commerce, we make it easy to discover and shop distinctive, high-quality fashion pieces directly from our website.",
    },
    {
      title: "What makes your clothing collections unique?",
      description:
        "Our collections are carefully curated with limited editions and exclusive designs inspired by seasonal trends, ensuring you get distinctive pieces not commonly found in other stores.",
    },
    {
      title: "How do I know which size to order?",
      description:
        "Each product page includes a detailed size chart. If you're unsure, you can contact our support team for personalized guidance.",
    },
    {
      title: "What is your return policy?",
      description:
        "We offer a 7-day return policy on all unworn items. Please refer to our return policy page for complete details.",
    },
    {
      title: "Do you offer free shipping?",
      description:
        "Yes, we offer free shipping on orders above a certain amount, which varies by location. Please check our shipping policy for more details.",
    },
    {
      title: "How can I track my order?",
      description:
        "Once your order is shipped, we'll send you a tracking link via email. You can use this link to monitor your order's status until it reaches you.",
    },
    {
      title: "Are your materials sustainably sourced?",
      description:
        "We prioritize using eco-friendly and sustainable materials in our collections whenever possible, ensuring minimal impact on the environment.",
    },
    {
      title: "What payment methods do you accept?",
      description:
        "We accept bKash, Rocket, Nagad, Upay, and all major credit cards and debit cards.",
    },
    {
      title: "How often do you release new collections?",
      description:
        "We release new collections every season, with occasional limited-edition drops in between. Follow us on social media to stay updated!",
    },
    {
      title: "How can I contact customer support?",
      description:
        "You can reach us via email or live chat on our website. Our support team is available from 9 AM to 6 PM on weekdays.",
    },
    {
      title: "Are the colors in the photos accurate?",
      description:
        "We strive to display colors as accurately as possible, but due to screen variations, the actual color of the item may differ slightly.",
    },
    {
      title: "Can I find your products in physical stores?",
      description:
        "Currently, we are an online-exclusive store, allowing us to offer unique collections directly to you.",
    },
    {
      title: "Do you offer seasonal discounts?",
      description:
        "Yes, we offer discounts during major seasonal events. Sign up for our newsletter to receive early access to these sales.",
    },
    {
      title: "What if an item is out of stock?",
      description:
        "If an item is out of stock, you can join the waitlist on the product page to be notified when it's back.",
    },
    {
      title: "Do you offer customizations on orders?",
      description:
        "Currently, we don't offer customizations, but stay tuned as we may introduce this feature in the future.",
    },
    {
      title: "What should I do if my order is delayed?",
      description:
        "If you experience delays, please check your tracking link. For further help, reach out to our support team.",
    },
    {
      title: "Is my personal information secure on your website?",
      description:
        "Yes, we use advanced security protocols to protect your information. Please refer to our privacy policy for more information.",
    },
  ];

  return (
    <>
      <h1>Frequently Asked Questions</h1>
      <p className="!mb-10">
        Here, you&apos;ll find answers to the most common questions about our
        collections, shopping experience, and policies. Whether you&apos;re
        curious about our unique approach to fashion, want details on our return
        policy, or need help with sizing, we&apos;re here to make your shopping
        experience as smooth as possible.
      </p>
      <Accordion>
        {faqs.map((faq, index) => {
          return (
            <AccordionItem
              key={index}
              aria-label={faq.title}
              title={faq.title}
              className="[&_h2>button_span]:font-normal [&_h2]:!my-2"
            >
              {faq.description}
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}

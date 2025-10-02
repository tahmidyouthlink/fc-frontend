"use client";

import { useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";
import StoryHero from "@/app/components/story/StoryHero";
import StoryDetails from "@/app/components/story/StoryDetails";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollToPlugin,
  Draggable,
  InertiaPlugin,
);

export default function StoryContents({ departments }) {
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <main
      id="story-main"
      className="pt-header-h-full-section-pb relative bg-neutral-50 pb-[var(--section-padding)] text-sm text-neutral-500 md:text-base xl:min-h-svh [&_h2]:text-neutral-600"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="fixed left-[5%] top-[25%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
        <div className="fixed left-[30%] top-[60%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s]" />
        <div className="fixed left-[55%] top-[5%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] sm:bg-[var(--color-moving-bubble-primary)]" />
        <div className="fixed left-[80%] top-[70%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      </div>
      {!selectedDept ? (
        <StoryHero
          gsap={gsap}
          useGSAP={useGSAP}
          Draggable={Draggable}
          departments={departments}
          setSelectedDept={setSelectedDept}
        />
      ) : (
        <StoryDetails
          gsap={gsap}
          useGSAP={useGSAP}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
        />
      )}
    </main>
  );
}

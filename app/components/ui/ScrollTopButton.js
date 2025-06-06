"use client";

import { useEffect } from "react";
import { CgArrowUp } from "react-icons/cg";

export default function ScrollTopButton() {
  useEffect(() => {
    const handleOnScroll = () => {
      const scrollToTopButton = document.getElementById("scroll-top");

      if (scrollToTopButton) {
        if (window.scrollY > 200) {
          scrollToTopButton.style.pointerEvents = "auto";
          scrollToTopButton.style.opacity = "1";
        } else {
          scrollToTopButton.style.pointerEvents = "none";
          scrollToTopButton.style.opacity = "0";
        }
      }
    };

    window.addEventListener("scroll", handleOnScroll);

    return () => {
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, []);

  return (
    <button
      id="scroll-top"
      className="pointer-events-none fixed bottom-3 right-3 z-[4] rounded-[4px] bg-[var(--color-secondary-500)] p-2.5 opacity-0 transition-[opacity,background-color] duration-300 ease-in-out hover:bg-[var(--color-secondary-600)]"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      <CgArrowUp className="size-5 text-neutral-800" />
    </button>
  );
}

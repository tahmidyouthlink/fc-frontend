"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OfferSlider({
  slides,
  slideDuration,
  isAutoSlideEnabled,
  bgColor,
  textColor,
}) {
  // Add duplicates for infinite scroll effect
  const extendedSlides = !slides?.length
    ? []
    : [slides[slides?.length - 1], ...slides, slides[0]];
  const [currentIndex, setCurrentIndex] = useState(1); // Start at index 1 (first actual offer)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const highlightedColor = "#fde047";
  const colorChangeDuration = 750;
  const [currentTextColor, setCurrentTextColor] = useState(textColor);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  // Auto-slide logic with pause on hover
  useEffect(() => {
    if (isAutoSlideEnabled && slides?.length > 1 && !isPaused) {
      const interval = setInterval(nextSlide, slideDuration * 1000);
      return () => clearInterval(interval);
    }
  }, [isAutoSlideEnabled, slides?.length, isPaused, slideDuration]);

  // Auto-change text color to create highlighting effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextColor((prevColor) =>
        prevColor == highlightedColor ? textColor : highlightedColor,
      );
    }, colorChangeDuration);
    return () => clearInterval(interval);
  }, [textColor]);

  // Handle infinite loop logic
  useEffect(() => {
    if (slides?.length < 2) return;

    if (currentIndex === 0) {
      setTimeout(
        () => {
          setIsTransitioning(false);
          setCurrentIndex(slides?.length); // Jump to last offer
        },
        1000, // Match transition duration
      );
    }

    if (currentIndex === extendedSlides?.length - 1) {
      setTimeout(
        () => {
          setIsTransitioning(false);
          setCurrentIndex(1); // Jump to first offer
        },
        1000, // Match transition duration
      );
    }
  }, [currentIndex, extendedSlides?.length, slides?.length]);

  return (
    <div
      className="relative line-clamp-1 py-1.5 text-center text-xs font-bold"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex ${isTransitioning ? "transition-transform duration-1000 ease-in-out" : ""}`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          color: currentTextColor,
        }}
      >
        {extendedSlides?.map((slide, index) =>
          slide.optionalLink ? (
            <Link
              key={slide.slideText + slide.optionalLink + index}
              href={slide.optionalLink}
              className="min-w-full text-center underline underline-offset-2 transition-[color] ease-in-out"
              style={{
                transitionDuration: `${colorChangeDuration}ms`,
              }}
            >
              {slide.slideText}
            </Link>
          ) : (
            <p
              key={slide.slideText + slide.optionalLink + index}
              className="min-w-full text-center transition-[color] ease-in-out"
              style={{
                transitionDuration: `${colorChangeDuration}ms`,
              }}
            >
              {slide.slideText}
            </p>
          ),
        )}
      </div>
    </div>
  );
}

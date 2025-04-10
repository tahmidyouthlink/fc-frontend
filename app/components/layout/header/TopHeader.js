"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

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

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
    setIsTransitioning(true);
  };

  // Auto-slide logic with pause on hover
  useEffect(() => {
    if (isAutoSlideEnabled && slides?.length > 1 && !isPaused) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoSlideEnabled, slides?.length, isPaused]);

  // Handle infinite loop logic
  useEffect(() => {
    if (slides?.length < 2) return;

    if (currentIndex === 0) {
      setTimeout(
        () => {
          setIsTransitioning(false);
          setCurrentIndex(slides?.length); // Jump to last offer
        },
        Number(slideDuration) * 1000, // Match transition duration
      );
    }

    if (currentIndex === extendedSlides?.length - 1) {
      setTimeout(
        () => {
          setIsTransitioning(false);
          setCurrentIndex(1); // Jump to first offer
        },
        Number(slideDuration) * 1000, // Match transition duration
      );
    }
  }, [currentIndex, extendedSlides?.length, slideDuration, slides?.length]);

  return (
    <div
      className="relative text-center text-[11px] font-bold"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-12 xl:max-w-[1200px] xl:px-0">
        {/* Previous Button */}
        {slides?.length > 1 && (
          <button onClick={prevSlide}>
            <CgChevronLeft className="size-3.5" />
          </button>
        )}
        {/* Offer Text */}
        <div className="w-full overflow-hidden py-1.5">
          <div
            className={`flex ${isTransitioning ? "transition-transform ease-in-out" : ""}`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              ...(isTransitioning && {
                transitionDuration: `${Number(slideDuration) * 1000}ms`,
              }),
            }}
          >
            {extendedSlides?.map((slide, index) =>
              slide.optionalLink ? (
                <Link
                  key={slide.slideText + slide.optionalLink + index}
                  href={slide.optionalLink}
                  className="min-w-full text-center underline underline-offset-2"
                >
                  {slide.slideText}
                </Link>
              ) : (
                <p
                  key={slide.slideText + slide.optionalLink + index}
                  className="min-w-full text-center"
                >
                  {slide.slideText}
                </p>
              ),
            )}
          </div>
        </div>
        {/* Next Button */}
        {slides?.length > 1 && (
          <button onClick={nextSlide}>
            <CgChevronRight className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

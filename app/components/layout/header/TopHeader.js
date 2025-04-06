"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

const offers = [
  {
    _id: "eirtju984we",
    text: "Winter sale - Up to 40% off!",
    link: {
      text: "View products",
      href: "/shop?filterBy=On+Sale",
    },
  },
  {
    _id: "e1d3jf823sd",
    text: "Free shipping on orders over ৳ 2,000!",
  },
  {
    _id: "joqwiej31fh",
    text: "Buy 1 get 1 free!",
    link: {
      text: "Learn more",
      href: "/offers/bogo",
    },
  },
  {
    _id: "kajsd9e6sjd",
    text: "Get 20% off on your first order!",
  },
];

// Add duplicates for infinite scroll effect
const extendedOffers = [offers[offers.length - 1], ...offers, offers[0]];

export default function OfferSlider() {
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
    if (!isPaused) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Handle infinite loop logic
  useEffect(() => {
    if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(offers.length); // Jump to last offer
      }, 500); // Match transition duration
    }

    if (currentIndex === extendedOffers.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1); // Jump to first offer
      }, 500);
    }
  }, [currentIndex]);

  return (
    <div
      className="relative bg-[#cc0033] text-center text-[11px] font-bold text-neutral-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-12 xl:max-w-[1200px] xl:px-0">
        {/* Previous Button */}
        <button onClick={prevSlide}>
          <CgChevronLeft className="size-3.5" />
        </button>
        {/* Offer Text */}
        <div className="overflow-hidden py-1.5">
          <div
            className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {extendedOffers.map((offer, index) => (
              <p key={offer._id + index} className="min-w-full text-center">
                {offer.text + (offer.link ? " " : "")}
                {offer.link && (
                  <Link
                    href={offer.link.href}
                    // className="text-[#448f3d] underline underline-offset-2"
                    className="text-white underline underline-offset-2"
                  >
                    {offer.link.text}
                  </Link>
                )}
              </p>
            ))}
          </div>
        </div>
        {/* Next Button */}
        <button onClick={nextSlide}>
          <CgChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

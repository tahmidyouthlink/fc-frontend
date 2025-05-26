import { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import squigglyShape from "@/public/shapes/squiggly.png";
import arrowShape from "@/public/shapes/arrow.png";
import TransitionLink from "@/app/components/ui/TransitionLink";

const transitionDuration = 650;
const transitionDelay = 150;

export default function HomeHero({
  isEnabled,
  slideInterval,
  leftSlides,
  centerSlides,
  rightSlides,
}) {
  // Add duplicates for infinite scroll effect
  const extendedLeftSlides = !leftSlides?.length
    ? []
    : [leftSlides[leftSlides?.length - 1], ...leftSlides, leftSlides[0]];
  const extendedCenterSlides = !centerSlides?.length
    ? []
    : [
        centerSlides[centerSlides?.length - 1],
        ...centerSlides,
        centerSlides[0],
      ];
  const extendedRightSlides = !rightSlides?.length
    ? []
    : [rightSlides[rightSlides?.length - 1], ...rightSlides, rightSlides[0]];
  const [currentIndex, setCurrentIndex] = useState(1); // Start at index 1 (first actual offer)
  const [isTransitioning, setIsTransitioning] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  // Auto-slide logic with pause on hover
  useEffect(() => {
    if (isEnabled && centerSlides?.length > 1) {
      const interval = setInterval(
        nextSlide,
        slideInterval * transitionDuration,
      );
      return () => clearInterval(interval);
    }
  }, [isEnabled, centerSlides?.length, slideInterval]);

  // Handle infinite loop logic
  useEffect(() => {
    if (centerSlides?.length < 2) return;

    const totalTransitionDuration = [1, 2, 3].reduce(
      (accumulator, slideNo) => transitionDelay * (3 - slideNo) + accumulator,
      0,
    );

    if (currentIndex === 0) {
      setTimeout(
        () => {
          setIsTransitioning(false);
          setCurrentIndex(centerSlides?.length); // Jump to last offer
        },
        transitionDuration + totalTransitionDuration, // Match transition duration
      );
    }

    if (currentIndex === extendedCenterSlides?.length - 1) {
      setTimeout(
        () => {
          setIsTransitioning(false);
          setCurrentIndex(1); // Jump to first offer
        },
        transitionDuration + totalTransitionDuration, // Match transition duration
      );
    }
  }, [currentIndex, extendedCenterSlides?.length, centerSlides?.length]);

  return (
    <div className="relative">
      {/* Mesh Gradients */}
      <div className="absolute inset-0 h-full overflow-hidden">
        <div className="absolute left-[5%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
        <div className="absolute left-[30%] top-[30%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s]" />
        <div className="absolute left-[55%] top-[70%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] max-sm:left-[5%] sm:bg-[var(--color-moving-bubble-primary)]" />
        <div className="absolute left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      </div>
      <div className="relative flex h-dvh flex-col px-5 pb-6 pt-[106px] sm:h-[65dvh] sm:px-8 sm:pt-32 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 2xl:pb-[6vh] 2xl:pt-[calc(88px+6vh)] portrait:md:h-[75dvh] portrait:lg:h-[60dvh] landscape:h-dvh">
        <div>
          <div className="relative flex items-center justify-evenly">
            <div className="size-8 max-sm:absolute max-sm:left-0 max-sm:top-[30%] sm:size-12 sm:-translate-y-1/2 lg:size-14">
              <Image src={squigglyShape} alt="Squiggly shape" />
            </div>
            <div className="max-w-[88%] sm:max-w-[60%] md:max-w-lg lg:max-w-screen-sm">
              <h1 className="text-center text-3xl font-semibold text-neutral-600 md:text-4xl lg:text-5xl portrait:[@media_(max-height:_700px)]:text-2xl">
                Discover{" "}
                <span className="bg-[linear-gradient(to_right,theme(colors.green.600),theme(colors.emerald.400))] bg-clip-text text-transparent">
                  Unique
                </span>{" "}
                Styles for This Season
              </h1>
              <p className="py-6 text-center text-neutral-500 portrait:[@media_(max-height:_700px)]:text-sm">
                Uncover the latest trends with our one-of-a-kind men&apos;s
                fashion. Each item is uniquely designed and available in limited
                numbers.
              </p>
            </div>
            <div className="size-8 max-sm:absolute max-sm:right-0 max-sm:top-[30%] sm:size-12 sm:-translate-y-1/2 lg:size-14">
              <Image src={arrowShape} alt="Arrow shape" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <TransitionLink
              href="/shop"
              className="flex cursor-pointer items-center gap-2 text-sm font-semibold transition-[gap] duration-300 ease-in-out hover:gap-3"
            >
              Shop Now{" "}
              <span className="rounded-full border border-black p-2">
                <FaArrowRightLong size={12} />
              </span>
            </TransitionLink>
          </div>
        </div>
        <div className="hero-images pointer-events-none flex grow justify-center gap-2 max-sm:mt-7 max-sm:flex-wrap md:-mt-2 md:gap-3 xl:-mt-3 xl:justify-between xl:gap-4 landscape:mt-auto landscape:max-h-[550px]">
          <div className="relative flex overflow-hidden">
            {extendedLeftSlides.map((leftImgUrl, index) => (
              <Image
                key={leftImgUrl}
                src={leftImgUrl}
                alt={`Hero section left side image ${index + 1}`}
                className={`${isTransitioning ? "transition-transform ease-in-out" : ""}`}
                style={{
                  transform: `translateX(${(currentIndex * -1 + index) * 100}%)`,
                  ...(isTransitioning && {
                    transitionDuration: `${transitionDuration}ms`,
                  }),
                }}
                width={0}
                height={0}
                fill
                sizes="50vw"
              />
            ))}
          </div>
          <div className="relative flex overflow-hidden">
            {extendedCenterSlides.map((centerImgUrl, index) => (
              <Image
                key={centerImgUrl}
                src={centerImgUrl}
                alt={`Hero section main image ${index + 1}`}
                className={`${isTransitioning ? "transition-transform ease-in-out" : ""}`}
                style={{
                  transform: `translateX(${(currentIndex * -1 + index) * 100}%)`,
                  ...(isTransitioning && {
                    transitionDuration: `${transitionDuration}ms`,
                    transitionDelay: `${transitionDelay}ms`,
                  }),
                }}
                width={0}
                height={0}
                fill
                sizes="50vw"
              />
            ))}
          </div>
          <div className="relative flex overflow-hidden">
            {extendedRightSlides.map((rightImgUrl, index) => (
              <Image
                key={rightImgUrl}
                src={rightImgUrl}
                alt={`Hero section right side image ${index + 1}`}
                className={`${isTransitioning ? "transition-transform ease-in-out" : ""}`}
                style={{
                  transform: `translateX(${(currentIndex * -1 + index) * 100}%)`,
                  ...(isTransitioning && {
                    transitionDuration: `${transitionDuration}ms`,
                    transitionDelay: `${transitionDelay * 2}ms`,
                  }),
                }}
                width={0}
                height={0}
                fill
                sizes="50vw"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

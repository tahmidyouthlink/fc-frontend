"use client";

import Image from "next/image";
import { useEffect } from "react";
import { CgArrowUp } from "react-icons/cg";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import swirlyArrowShape from "@/public/shapes/swirly-arrow.svg";
import swirlyScribbledArrowShape from "@/public/shapes/swirly-scribbled-arrow.svg";

export default function StoryDetails({
  gsap,
  useGSAP,
  selectedDept,
  setSelectedDept,
}) {
  useGSAP(() => {
    gsap.set("#story-details", { autoAlpha: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#story-details",
        start: `top center`,
        end: `bottom top`,
        toggleActions: "restart reset restart reset",
      },
      defaults: { autoAlpha: 0, duration: 0.5, ease: "power1.inOut" },
    });

    tl.from("#staff-img .relative", { y: -50 })
      .from("#staff-img .absolute", { y: 50 }, "<0.1")
      .from("#first-comment div", { y: 35 }, "<0.15")
      .from("#first-comment img.swirly.more-left", { xPercent: -100 }, "<0.1")
      .from("#video video, #video div", { x: 75 }, "<")
      .from("#video h4", { xPercent: -25 }, "<0.25")
      .from("#video img.circle", { y: 20 }, "<0.1")
      .from(".rest-of-comments div", { y: 35, stagger: 0.15 }, "<0.15")
      .from("img.swirly.left", { xPercent: -75, stagger: 0.1 }, "<0.1")
      .from("img.swirly.right", { xPercent: 25, stagger: 0.1 }, "<0.1")
      .from("img.illustration", { yPercent: 25, stagger: 0.1 }, "<0.1")
      .from("img.arrowheads.left", { xPercent: -100, stagger: 0.1 }, "<0.1")
      .from("img.arrowheads.right", { xPercent: 50, stagger: 0.1 }, "<0.1");
  }, {});

  useEffect(() => {
    const handleOnScroll = () => {
      const scrollToTopButton = document.getElementById("go-back-to-hero");

      if (scrollToTopButton) {
        if (window.scrollY > 50) {
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

  const isSrcForVideo = (mediaSrc) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => mediaSrc.toLowerCase().endsWith(ext));
  };

  return (
    <div
      id="story-details"
      className="invisible z-[1] mx-5 grid grid-cols-5 justify-center gap-7 sm:mx-8 md:mx-12 xl:mx-auto xl:max-w-[1200px]"
    >
      <div
        id="staff-img"
        className="sticky top-5 h-[calc(100dvh-var(--section-padding-double))] w-full lg:col-span-2"
      >
        {/* Shape/SVG (circle with star) */}
        <Image
          src={circleWithStarShape}
          alt="circle with star shape"
          className="absolute bottom-8 left-1/2 aspect-square w-52 -translate-x-full object-contain opacity-90 sm:-right-10 sm:max-md:w-64 lg:-right-20"
          height={0}
          width={0}
          sizes="25vw"
        />
        {/* Staff Image */}
        <Image
          src={selectedDept.staff.imgSrc}
          alt={selectedDept.staff.name}
          height={0}
          width={0}
          sizes="750px"
          className="relative h-full w-full rounded-xl object-cover"
        />
      </div>
      <div className="relative col-span-3">
        <div className="relative">
          {selectedDept.contents?.map((content, index) => (
            <div
              key={"content-" + content.quote + index}
              className={`relative flex flex-col justify-center ${index !== 0 ? "min-h-dvh gap-44" : "h-[calc(100dvh-(var(--header-height-xs)+var(--section-padding-double)))] gap-32 sm:min-h-[calc(100dvh-(var(--header-height-sm)+var(--section-padding-double)))] lg:min-h-[calc(100dvh-(var(--header-height-lg)+var(--section-padding-double)))]"} ${index % 2 === 0 ? "items-end" : "items-start"}`}
            >
              {/* Quote Section */}
              <div className="relative">
                {/* Quote */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: content.quote,
                  }}
                  className={`[&_p]:max-w-2xl [&_p]:text-3xl [&_p]:font-semibold [&_p]:text-neutral-600 [&_span]:bg-[linear-gradient(to_right,#804D3A,#D86F4D,#F3A761)] [&_span]:bg-clip-text [&_span]:text-transparent ${index % 2 === 0 ? "[&_p]:pr-20" : "[&_p]:pl-20"}`}
                />
                {/* Shape/SVG (swirly scribbled arrow) */}
                <Image
                  src={
                    index % 2 === 0
                      ? swirlyScribbledArrowShape
                      : swirlyArrowShape
                  }
                  alt={`Swirly ${index % 2 === 0 ? "scribbled" : ""} arrow`}
                  className={`swirly more-left absolute aspect-square w-20 min-w-20 object-contain opacity-30 ${index % 2 === 0 ? "-left-6 top-2/3 -translate-x-full" : "-bottom-1/3 right-0 translate-x-full translate-y-full -rotate-45"}`}
                  height={0}
                  width={0}
                  sizes="25vw"
                />
              </div>
              {/* Media (Video/Image) Section */}
              <div id="video" className="relative aspect-video w-2/3">
                {isSrcForVideo(content.mediaSrc) ? (
                  // Video Element
                  <video
                    className="relative z-[1] h-full w-full rounded-xl object-cover"
                    autoPlay
                    muted
                    loop
                  >
                    <source src={content.mediaSrc} type="video/mp4" />
                  </video>
                ) : (
                  // Image Element
                  <Image
                    src={content.mediaSrc}
                    alt={`Department Image ${index + 1}`}
                    className="relative z-[1] aspect-video w-full rounded-xl object-cover"
                    height={0}
                    width={0}
                    sizes="25vw"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="overlay absolute bottom-0 left-0 right-0 z-[1] h-1/3 rounded-xl bg-gradient-to-t from-black/80 to-transparent" />
                {/* Text Outline Effect */}
                {/* Solid Text (behind) */}
                <h4
                  className={`pointer-events-none absolute bottom-6 z-[0] select-none text-6xl font-bold text-neutral-700 ${index % 2 === 0 ? "left-0 -translate-x-1/3" : "right-0 translate-x-1/3"}`}
                >
                  {content.hashtag}
                </h4>
                {/* Stroked Text (front) */}
                <h4
                  className={`pointer-events-none absolute bottom-6 z-[2] select-none text-6xl font-bold text-transparent opacity-50 ${index % 2 === 0 ? "left-0 -translate-x-1/3" : "right-0 translate-x-1/3"}`}
                  style={{
                    WebkitTextStroke: "1px #e5e5e5",
                  }}
                >
                  {content.hashtag}
                </h4>
                {/* Shape/SVG (circle with star) */}
                <Image
                  src={circleWithStarShape}
                  alt="circle with star shape"
                  className="circle absolute right-0 top-0 aspect-square w-52 -translate-y-1/3 translate-x-1/3 -scale-x-100 object-contain opacity-90 sm:max-md:w-64"
                  height={0}
                  width={0}
                  sizes="25vw"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          id="go-back-to-hero"
          className="pointer-events-none sticky bottom-3 z-[3] flex items-center justify-center gap-2 rounded-lg bg-neutral-50/20 p-2 font-semibold text-gray-700 opacity-0 backdrop-blur-lg transition-[opacity,color] duration-300 ease-in-out hover:text-black"
          onClick={() => {
            gsap.to(window, {
              duration: 0.6,
              scrollTo: 0,
              ease: "power4.out",
              onComplete: () =>
                gsap.to(
                  "#story-details h4, #story-details p, #story-details video, #story-details .overlay, #story-details img",
                  {
                    yPercent: 10,
                    autoAlpha: 0,
                    stagger: { amount: 0.5 },
                    duration: 0.5,
                    ease: "power1.inOut",
                    onComplete: () => setSelectedDept(null),
                  },
                ),
            });
          }}
        >
          View All Departments
          <span className="rounded-full border-1.5 border-gray-700 p-1 transition-[border-color] duration-300 ease-in-out hover:border-black">
            <CgArrowUp className="text-lg" />
          </span>
        </button>
      </div>
    </div>
  );
}

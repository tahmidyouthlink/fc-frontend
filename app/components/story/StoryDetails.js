"use client";

import Image from "next/image";
import { useEffect } from "react";
import { CgArrowUp } from "react-icons/cg";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import swirlyArrowShape from "@/public/shapes/swirly-arrow.svg";
import swirlyScribbledArrowShape from "@/public/shapes/swirly-scribbled-arrow.svg";
import arrowheadsShape from "@/public/shapes/arrowheads.svg";
import notesImg from "@/public/story/illustrations/notes.svg";
import officeWorkImg from "@/public/story/illustrations/office-work.svg";
import presentationImg from "@/public/story/illustrations/team-presentation-fill.svg";

export default function StoryDetails({
  gsap,
  useGSAP,
  selectedDept,
  setSelectedDept,
}) {
  const [firstComment, ...restOfComments] = selectedDept.staff.comments;

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

  return (
    <div
      id="story-details"
      className="invisible z-[1] mx-5 grid min-h-dvh grid-cols-5 justify-center gap-7 sm:mx-8 md:mx-12 xl:mx-auto xl:min-h-[calc(100dvh-(var(--header-height-lg)+var(--section-padding-double)))] xl:max-w-[1200px]"
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
        {/* Story Image */}
        <Image
          src={selectedDept.staff.imgSrc}
          alt={selectedDept.staff.name}
          height={0}
          width={0}
          sizes="750px"
          className="relative h-full w-full rounded-xl object-cover"
        />
      </div>
      <div className="story-texts relative col-span-3 min-h-dvh">
        <div className="relative flex flex-col items-end justify-center gap-[45dvw] px-5 pb-[45dvw] pt-20 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 [&_p]:max-w-2xl [&_p]:pr-20 [&_p]:text-3xl [&_p]:font-semibold [&_p]:text-neutral-600 [&_span]:bg-[linear-gradient(to_right,theme(colors.green.600),theme(colors.emerald.400))] [&_span]:bg-clip-text [&_span]:text-transparent">
          <div id="first-comment" className="relative">
            {/* First Comment */}
            <div
              dangerouslySetInnerHTML={{
                __html: firstComment,
              }}
            />
            {/* Shape/SVG (swirly scribbled arrow) */}
            <Image
              src={swirlyScribbledArrowShape}
              alt="Swirly scribbled arrow"
              className="swirly more-left absolute -left-12 top-2/3 aspect-square w-20 min-w-20 -translate-x-full object-contain opacity-30"
              height={0}
              width={0}
              sizes="25vw"
            />
            {/* Shape/SVG (swirly arrow) */}
            <Image
              src={swirlyArrowShape}
              alt="Swirly arrow"
              className="swirly right absolute -bottom-[25dvw] right-0 aspect-square w-24 -translate-x-1/2 translate-y-[200%] -rotate-45 object-contain opacity-30"
              height={0}
              width={0}
              sizes="25vw"
            />
            {/* Illustration (notes) */}
            <Image
              src={notesImg}
              alt="Notes at office"
              height={0}
              width={0}
              className="illustration absolute -bottom-[25dvw] left-0 aspect-video h-[500px] -translate-x-[15%] translate-y-[125%] object-contain opacity-30"
              sizes="25vw"
            />
            {/* Shape/SVG (arrowheads) */}
            <Image
              src={arrowheadsShape}
              alt="Arrowheads shape"
              className="arrowheads right absolute -bottom-[55dvw] right-1/4 aspect-square w-24 translate-y-[200%] rotate-180 object-contain opacity-30"
              height={0}
              width={0}
              sizes="25vw"
            />
          </div>
          {/* Video */}
          <div id="video" className="relative -mt-[38dvw] aspect-video w-2/3">
            {/* Video Element */}
            <video
              className="relative z-[1] h-full w-full rounded-xl object-cover"
              autoPlay
              muted
              loop
            >
              <source src={selectedDept.staff.videoSrc} type="video/mp4" />
            </video>
            {/* Gradient Overlay */}
            <div className="overlay absolute bottom-0 left-0 right-0 z-[1] h-1/3 rounded-xl bg-gradient-to-t from-black/80 to-transparent" />
            {/* Text Outline Effect */}
            {/* Solid Text (behind) */}
            <h4 className="pointer-events-none absolute bottom-6 left-0 z-[0] -translate-x-1/3 select-none text-6xl font-bold text-neutral-700">
              {selectedDept.staff.hashtag}
            </h4>
            {/* Stroked Text (front) */}
            <h4
              className="pointer-events-none absolute bottom-6 left-0 z-[2] -translate-x-1/3 select-none text-6xl font-bold text-transparent opacity-50"
              style={{
                WebkitTextStroke: "1px #e5e5e5",
              }}
              ariaHidden="true"
            >
              {selectedDept.staff.hashtag}
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
          {/* Rest of Comments */}
          {restOfComments?.map((comment, index) => (
            <div key={comment} className="rest-of-comments relative">
              <div
                key={comment}
                dangerouslySetInnerHTML={{
                  __html: comment,
                }}
              />
              {index % 2 === 0 ? (
                <>
                  {/* Shape/SVG (swirly scribbled arrow) */}
                  <Image
                    src={swirlyScribbledArrowShape}
                    alt="Swirly scribbled arrow"
                    className="swirly left absolute bottom-0 left-0 aspect-square w-24 -translate-x-1/3 translate-y-[125%] rotate-90 object-contain opacity-30"
                    height={0}
                    width={0}
                    sizes="25vw"
                  />
                  {/* Illustration (office work) */}
                  <Image
                    src={officeWorkImg}
                    alt="Presentation at office"
                    height={0}
                    width={0}
                    className="illustration absolute bottom-0 right-0 aspect-video h-[500px] translate-x-[15%] translate-y-[125%] object-contain opacity-30"
                    sizes="25vw"
                  />
                  {/* Shape/SVG (arrowheads) */}
                  {index !== restOfComments.length - 1 && (
                    <Image
                      src={arrowheadsShape}
                      alt="Arrowheads shape"
                      className="arrowheads left absolute -bottom-[30dvw] left-1/4 aspect-square w-24 -translate-x-1/2 translate-y-[200%] -rotate-90 object-contain opacity-30"
                      height={0}
                      width={0}
                      sizes="25vw"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Shape/SVG (swirly arrow) */}
                  <Image
                    src={swirlyArrowShape}
                    alt="Swirly arrow"
                    className="swirly right absolute bottom-0 right-0 aspect-square w-24 -translate-x-1/2 translate-y-[125%] -rotate-45 object-contain opacity-30"
                    height={0}
                    width={0}
                    sizes="25vw"
                  />
                  {/* Illustration (office work) */}
                  <Image
                    src={presentationImg}
                    alt="Presentation at office"
                    height={0}
                    width={0}
                    className="illustration absolute bottom-0 left-0 aspect-video h-[500px] -translate-x-[15%] translate-y-[125%] object-contain opacity-30"
                    sizes="25vw"
                  />
                  {/* Shape/SVG (arrowheads) */}
                  {index !== restOfComments.length - 1 && (
                    <Image
                      src={arrowheadsShape}
                      alt="Arrowheads shape"
                      className="arrowheads right absolute -bottom-[30dvw] right-1/4 aspect-square w-24 translate-y-[200%] rotate-180 object-contain opacity-30"
                      height={0}
                      width={0}
                      sizes="25vw"
                    />
                  )}
                </>
              )}
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

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

    // Animation for staff image (appears once)
    gsap.from("#staff-img", {
      autoAlpha: 0,
      x: -50,
      duration: 1,
      ease: "power2.out",
    });

    // Animation for the circle with star shape near the staff image (appears once)
    gsap.from("#staff-img .absolute", {
      autoAlpha: 0,
      scale: 0.5,
      duration: 1,
      ease: "elastic.out(1,0.5)",
    });

    // Animations for quote sections
    gsap.utils.toArray(".quote").forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        duration: 1,
        y: 75,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Animations for media sections
    gsap.utils.toArray(".media").forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        duration: 1,
        x: element.classList.contains("ml-auto") ? -100 : 100,
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Animations for swirly and circle shapes
    gsap.utils.toArray(".swirly, .circle").forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        duration: 1,
        scale: 0.5,
        duration: 1,
        delay: 0.6,
        ease: "elastic.out(1,0.5)",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Animations for hashtag titles (h4)
    gsap.utils.toArray("#story-details h4").forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        duration: 1,
        xPercent: 0,
        duration: 1,
        delay: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });
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
      className="invisible z-[1] grid grid-cols-5 justify-center space-x-16"
    >
      <div
        id="staff-img"
        className="top-5 col-span-full ml-5 h-[calc(100dvh-var(--section-padding-double))] w-full sm:ml-8 md:ml-12 lg:sticky lg:col-span-2 xl:ml-auto xl:max-w-[calc(1200px*2/5-64px/2)]"
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
      <div className="relative col-span-full overflow-hidden lg:col-span-3">
        <div className="relative mr-5 sm:mr-8 md:mr-12 xl:mr-auto xl:max-w-[calc(1200px*3/5-64px/2)]">
          {selectedDept.contents?.map((content, index) => (
            <div
              key={"content-" + content.quote + index}
              className={`relative flex flex-col justify-center ${index !== 0 ? "min-h-dvh gap-y-44" : "h-[calc(100dvh-(var(--header-height-xs)+var(--section-padding-double)))] gap-y-32 sm:min-h-[calc(100dvh-(var(--header-height-sm)+var(--section-padding-double)))] lg:min-h-[calc(100dvh-(var(--header-height-lg)+var(--section-padding-double)))]"}`}
            >
              {/* Quote Section */}
              <div
                className={`quote relative max-w-2xl ${index % 2 === 0 ? "mr-auto text-left" : "ml-auto text-right"}`}
              >
                {/* Quote */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: content.quote,
                  }}
                  className="text-3xl font-semibold text-neutral-600 [&_span]:bg-[linear-gradient(to_right,#804D3A,#D86F4D,#F3A761)] [&_span]:bg-clip-text [&_span]:text-transparent"
                />
                {/* Shape/SVG (swirly arrow) */}
                <Image
                  src={
                    index % 2 === 0
                      ? swirlyScribbledArrowShape
                      : swirlyArrowShape
                  }
                  alt={`Swirly ${index % 2 === 0 ? "scribbled" : ""} arrow`}
                  className={`swirly absolute aspect-square w-20 min-w-20 object-contain opacity-30 ${index % 2 === 0 ? "-bottom-8 left-0 translate-x-1/2 translate-y-full rotate-90" : "-bottom-1/3 right-0 translate-x-full translate-y-full -rotate-45"}`}
                  height={0}
                  width={0}
                  sizes="25vw"
                />
              </div>
              {/* Media (Video/Image) Section */}
              <div
                className={`media relative aspect-video w-2/3 ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
              >
                {isSrcForVideo(content.mediaSrc) ? (
                  // Video Element
                  <video
                    className="media-video relative z-[1] h-full w-full rounded-xl object-cover"
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
                    className="media-image relative z-[1] aspect-video w-full rounded-xl object-cover"
                    height={0}
                    width={0}
                    sizes="25vw"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="media-overlay absolute bottom-0 left-0 right-0 z-[1] h-1/3 rounded-xl bg-gradient-to-t from-black/80 to-transparent" />
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
          className="pointer-events-none fixed bottom-3 z-[3] flex items-center justify-center gap-2 rounded-lg bg-neutral-50/20 p-2 font-semibold text-gray-700 opacity-0 backdrop-blur-lg transition-[opacity,color] duration-300 ease-in-out hover:text-black"
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

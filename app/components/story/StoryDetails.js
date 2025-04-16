import Image from "next/image";

export default function StoryDetails({
  gsap,
  useGSAP,
  ScrollTrigger,
  selectedDept,
}) {
  return (
    <div
      id="story-details"
      className="z-[1] mx-5 flex min-h-dvh justify-center gap-7 sm:mx-8 md:mx-12 xl:mx-auto xl:min-h-[calc(100dvh-(var(--header-height-lg)+var(--section-padding-double)))] xl:max-w-[1200px]"
    >
      <Image
        src={selectedDept.staff.imgSrc}
        alt={selectedDept.staff.name}
        height={0}
        width={0}
        sizes="90dvh"
        className="sticky top-5 h-[calc(100dvh-var(--section-padding-double))] w-full rounded-xl object-cover lg:w-2/5"
      />
      <div
        className="story-texts relative flex min-h-full flex-col items-end justify-center gap-[30dvw] px-5 py-32 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 [&_p]:max-w-2xl [&_p]:text-3xl [&_p]:font-semibold [&_p]:text-neutral-600 [&_span]:bg-[linear-gradient(to_right,theme(colors.orange.500),theme(colors.yellow.400))] [&_span]:bg-clip-text [&_span]:text-transparent"
        dangerouslySetInnerHTML={{
          __html: selectedDept.staff.comments,
        }}
      >
        {/* <h3 className="max-w-2xl text-3xl font-semibold text-neutral-600">
          Creative solutions that make an{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.500),theme(colors.yellow.400))] bg-clip-text text-transparent">
            impact
          </span>{" "}
          in the digital space. We{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.600),theme(colors.yellow.500))] bg-clip-text text-transparent">
            design, develop, and optimize
          </span>{" "}
          websites and applications for maximum engagement. Your success is our{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.600),theme(colors.yellow.500))] bg-clip-text text-transparent">
            priority
          </span>{" "}
          , and we deliver results.
        </h3>
        <h3 className="max-w-2xl text-3xl font-semibold text-neutral-600">
          Creative solutions that make an{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.500),theme(colors.yellow.400))] bg-clip-text text-transparent">
            impact
          </span>{" "}
          in the digital space. We{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.600),theme(colors.yellow.500))] bg-clip-text text-transparent">
            design, develop, and optimize
          </span>{" "}
          websites and applications for maximum engagement. Your success is our{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.600),theme(colors.yellow.500))] bg-clip-text text-transparent">
            priority
          </span>{" "}
          , and we deliver results.
        </h3>
        <h3 className="max-w-2xl text-3xl font-semibold text-neutral-600">
          Creative solutions that make an{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.500),theme(colors.yellow.400))] bg-clip-text text-transparent">
            impact
          </span>{" "}
          in the digital space. We{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.600),theme(colors.yellow.500))] bg-clip-text text-transparent">
            design, develop, and optimize
          </span>{" "}
          websites and applications for maximum engagement. Your success is our{" "}
          <span className="bg-[linear-gradient(to_right,theme(colors.orange.600),theme(colors.yellow.500))] bg-clip-text text-transparent">
            priority
          </span>{" "}
          , and we deliver results.
        </h3> */}
      </div>
    </div>
  );
}

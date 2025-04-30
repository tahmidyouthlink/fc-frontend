import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import squigglyShape from "@/public/shapes/squiggly.png";
import arrowShape from "@/public/shapes/arrow.png";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function HomeHero({ leftImgUrl, centerImgUrl, rightImgUrl }) {
  if (!(!leftImgUrl || !centerImgUrl || !rightImgUrl))
    return (
      <div className="relative">
        {/* Mesh Gradients */}
        <div className="absolute inset-0 h-full overflow-hidden">
          <div className="absolute left-[5%] top-[60%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md max-sm:hidden" />
          <div className="absolute left-[30%] top-[30%] size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:1.5s]" />
          <div className="absolute left-[55%] top-[70%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md [animation-delay:0.5s] sm:bg-[#d3f9ce]" />
          <div className="absolute left-[80%] top-1/3 size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md [animation-delay:2s] max-sm:hidden" />
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
                  fashion. Each item is uniquely designed and available in
                  limited numbers.
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
            <div>
              {!!leftImgUrl && (
                <Image
                  src={leftImgUrl}
                  alt="Hero section side image 1"
                  width={0}
                  height={0}
                  fill
                  sizes="50vw"
                />
              )}
            </div>
            <div>
              {!!centerImgUrl && (
                <Image
                  src={centerImgUrl}
                  alt="Hero section main image"
                  width={0}
                  height={0}
                  fill
                  sizes="50vw"
                />
              )}
            </div>
            <div>
              {!!rightImgUrl && (
                <Image
                  src={rightImgUrl}
                  alt="Hero section side image 2"
                  width={0}
                  height={0}
                  fill
                  sizes="50vw"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

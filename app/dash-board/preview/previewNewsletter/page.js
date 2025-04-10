"use client";
import TransitionLink from "@/app/components/ui/TransitionLink";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';

const PreviewPage = () => {

  const searchParams = useSearchParams();
  const image = searchParams.get('image');
  const position = searchParams.get('position');

  return (
    <div className="bg-[#ebfeeb] pt-20">
      {/* bg-[#f7fdf7] */}
      {/* <div className="flex xl:max-w-[1200px] items-center justify-evenly gap-5 overflow-hidden px-5 py-[72px] sm:px-8 lg:px-12 xl:mx-auto xl:px-0"> */}
      <div
        className={`flex items-center justify-evenly overflow-hidden px-5 py-14 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${position !== "center" ? "gap-5 py-[72px]" : "flex-col gap-12 py-14"}`}
      >
        <TransitionLink
          className={`relative block h-40 w-full ${position === "right" ? "order-last" : ""}`}
          href="/shop?filterBy=On+Sale"
        >
          <Image
            src={image}
            className="object-contain"
            alt="Marketing Banner"
            height={0}
            width={0}
            sizes="100vh"
            fill
          />
        </TransitionLink>
        <form
          noValidate
          className="w-full max-w-md"
        >
          <p className="mb-4 text-center text-xs text-neutral-700 md:text-sm">
            Subscribe to our newsletter to get more offers daily!
          </p>
          <div className="flex gap-1.5">
            <input
              type="email"
              className="h-10 w-full rounded-lg border-2 border-neutral-200/50 bg-white/90 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-500 focus:border-white/50 md:text-sm"
              placeholder="Enter your email address"
            />
            <button type="button" className="block w-fit self-end text-nowrap rounded-lg bg-[#bdf6b4] px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 transition-[background-color] duration-300 hover:bg-[#ade7a4]">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreviewPage;
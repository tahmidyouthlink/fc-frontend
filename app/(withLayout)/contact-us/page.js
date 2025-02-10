import {
  PiEnvelopeSimpleLight,
  PiMapPinLight,
  PiPhoneLight,
} from "react-icons/pi";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { LuFacebook } from "react-icons/lu";
import { TbBrandTiktok } from "react-icons/tb";
import TransitionLink from "@/app/components/ui/TransitionLink";
import ContactForm from "@/app/components/contact/ContactForm";

export default function ContactUs() {
  return (
    <main className="relative overflow-hidden bg-[#f0f0f0] pb-5 pt-20 text-sm text-neutral-500 sm:pt-24 md:text-base lg:pb-6 lg:pt-28 xl:min-h-dvh [&_h2]:text-neutral-600">
      <div className="absolute left-[5%] top-1/2 size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md" />
      <div className="absolute left-[55%] top-[60%] size-60 animate-blob rounded-full bg-[#ebc6a6] mix-blend-multiply blur-md [animation-delay:1s]" />
      <div className="absolute left-[80%] top-1/3 size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:2s]" />
      <div className="z-[1] mx-5 items-stretch gap-4 overflow-hidden rounded-xl border-2 border-neutral-50/20 bg-white/40 backdrop-blur-2xl max-md:space-y-4 sm:mx-8 md:mx-12 md:flex xl:mx-auto xl:min-h-[calc(100dvh-112px-24px)] xl:max-w-[1200px]">
        <section className="grow p-9 md:order-last">
          <h2 className="text-xl font-semibold">SEND A MESSAGE</h2>
          <p className="!mb-10 !mt-1.5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <ContactForm />
        </section>
        <section className="bg-white/5 p-9 backdrop-blur-xl lg:w-2/5">
          <h2 className="text-xl font-semibold">REACH OUT TO US</h2>
          <p className="mb-10 mt-1.5">Lorem ipsum dolor sit amet.</p>
          <div className="min-h-[calc(100%-112px)] justify-between max-sm:space-y-10 sm:flex md:flex-col">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <PiMapPinLight size={24} />
                <p className="text-[13px]">
                  Maples Road, New York, United States
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <PiPhoneLight size={24} />
                <p className="text-[13px]">+880 1752-859362</p>
              </div>
              <div className="flex items-center gap-2.5">
                <PiEnvelopeSimpleLight size={24} />
                <p className="text-[13px]">f-commerce-ltd@gmail.com</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-base text-neutral-600">Or, get in touch via</p>
              <ul className="social-links flex items-center gap-x-2">
                <li>
                  <TransitionLink
                    href="https://www.facebook.com/fashion-commerce/"
                    target="_blank"
                  >
                    <LuFacebook />
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="https://www.instagram.com/fashion-commerce/"
                    target="_blank"
                  >
                    <FaInstagram />
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="https://www.twitter.com/fashion-commerce/"
                    target="_blank"
                  >
                    <FaXTwitter />
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="https://www.tiktok.com/fashion-commerce/"
                    target="_blank"
                  >
                    <TbBrandTiktok />
                  </TransitionLink>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

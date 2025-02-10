import Image from "next/image";
import { paymentMethods } from "@/app/data/paymentMethods";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function PaymentMethodPartners() {
  return (
    <div className="space-y-2.5 max-lg:col-span-full lg:max-w-60 lg:text-sm xl:max-w-80">
      <h3 className="font-semibold uppercase max-lg:text-center">
        OUR SECURED PAYMENT METHODS
      </h3>
      <ul className="payment-method-partners flex flex-wrap gap-2.5 max-lg:items-stretch max-lg:justify-center">
        {paymentMethods.map((paymentMethod) => {
          return (
            <li
              key={paymentMethod.name}
              className="overflow-hidden rounded-md shadow-[2px_2px_8px_0_rgba(0,0,0,0.1)] transition-shadow duration-300 ease-in-out hover:shadow-[2px_2px_16px_0_rgba(0,0,0,0.175)]"
            >
              <TransitionLink
                key={paymentMethod.name}
                href={paymentMethod.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5"
                style={{
                  backgroundColor: paymentMethod.bgColor,
                }}
              >
                <Image
                  className="h-7 w-12 object-contain"
                  src={paymentMethod.imgSrc}
                  alt={paymentMethod.name}
                />
              </TransitionLink>
            </li>
          );
        })}
        <li className="flex min-h-full w-[68px] cursor-pointer items-center justify-center overflow-hidden rounded-md p-2.5 shadow-[2px_2px_8px_0_rgba(0,0,0,0.1)] transition-shadow duration-300 ease-in-out hover:shadow-[2px_2px_16px_0_rgba(0,0,0,0.175)]">
          <p className="text-center text-xs/[28px] font-bold text-neutral-600 lg:text-[13px]/[28px]">
            More...
          </p>
        </li>
      </ul>
    </div>
  );
}

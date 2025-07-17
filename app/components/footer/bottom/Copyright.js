import { COMPANY_NAME } from "@/app/config/company";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function Copyright() {
  return (
    <div className="flex flex-col items-center justify-between py-3 lg:flex-row lg:py-4 xl:py-5 2xl:py-6">
      <p className="text-center text-[13px] md:text-[14px]">
        Copyright ©{" "}
        <TransitionLink className="font-bold" href="/">
          {COMPANY_NAME}
        </TransitionLink>{" "}
        - {new Date().getFullYear()}. All Rights Reserved.
      </p>
      <div className="text-[14px]">
        Developed by <span className="font-bold">YouthLink Tech.</span>
      </div>
    </div>
  );
}

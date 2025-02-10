import { Checkbox } from "@nextui-org/react";
import TransitionLink from "../../ui/TransitionLink";

export default function CheckoutAgreement({
  isAgreementCheckboxSelected,
  setIsAgreementCheckboxSelected,
}) {
  return (
    <div
      className={`flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_span]:text-xs lg:[&_span]:text-[13px] ${isAgreementCheckboxSelected ? "[&_a]:text-[#57944e]" : "[&_a]:text-[#f31260]"}`}
    >
      <Checkbox
        className="[&_span:has(svg):after]:bg-[#d4ffce] [&_span:has(svg)]:text-neutral-700"
        defaultSelected
        isRequired
        isSelected={isAgreementCheckboxSelected}
        onValueChange={setIsAgreementCheckboxSelected}
        isInvalid={!isAgreementCheckboxSelected}
      >
        I have read and agree to the{" "}
        <TransitionLink href={"/terms-and-condition"}>
          terms and conditions
        </TransitionLink>
        ,{" "}
        <TransitionLink href={"/privacy-policy"}>privacy policy</TransitionLink>
        ,{" "}
        <TransitionLink href={"/shipping-policy"}>
          shipping policy
        </TransitionLink>
        , and{" "}
        <TransitionLink href={"/refund-policy"}>refund policy</TransitionLink>.
      </Checkbox>
    </div>
  );
}

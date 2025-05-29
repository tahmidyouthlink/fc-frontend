import Link from "next/link";
import { Checkbox } from "@nextui-org/react";
import usePolicyPages from "@/app/hooks/usePolicyPages";

export default function CheckoutAgreement({
  isAgreementCheckboxSelected,
  setIsAgreementCheckboxSelected,
}) {
  const [[legalPolicyPdfLinks] = [], isLegalDataLoading, legalDataRefetch] =
    usePolicyPages();

  return (
    <div
      className={`flex gap-x-2 [&_a]:underline [&_a]:underline-offset-2 [&_span]:text-xs lg:[&_span]:text-[13px] ${isAgreementCheckboxSelected ? "[&_a]:text-[var(--color-primary-900)]" : "[&_a]:text-[#f31260]"}`}
    >
      <Checkbox
        className="[&_span:has(svg):after]:bg-[var(--color-primary-500)] [&_span:has(svg)]:text-neutral-700"
        defaultSelected
        isRequired
        isSelected={isAgreementCheckboxSelected}
        onValueChange={setIsAgreementCheckboxSelected}
        isInvalid={!isAgreementCheckboxSelected}
      >
        I have read and agree to the{" "}
        <Link target="_blank" href={legalPolicyPdfLinks?.terms || "#"}>
          terms and conditions
        </Link>
        ,{" "}
        <Link target="_blank" href={legalPolicyPdfLinks?.privacy || "#"}>
          privacy policy
        </Link>
        ,{" "}
        <Link target="_blank" href={legalPolicyPdfLinks?.shipping || "#"}>
          shipping policy
        </Link>
        , and{" "}
        <Link target="_blank" href={legalPolicyPdfLinks?.refund || "#"}>
          refund policy
        </Link>
        .
      </Checkbox>
    </div>
  );
}

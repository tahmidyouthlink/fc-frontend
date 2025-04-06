import LegalDoc from "@/app/components/legal/LegalDoc";
import { fetchLegalPolicyData } from "@/app/utils/fetchLegalPolicyData";

export default async function FAQ() {
  const data = await fetchLegalPolicyData("all-faqs");

  return (
    <LegalDoc
      pageTitle={data?.pageTitle}
      docContent={data?.faqDescription}
      faqs={data?.faqs}
    />
  );
}

import LegalDoc from "@/app/components/legal/LegalDoc";
import { fetchLegalPolicyData } from "@/app/utils/fetchLegalPolicyData";

export default async function TermsAndConditions() {
  const data = await fetchLegalPolicyData("all-terms-conditions");

  return (
    <LegalDoc
      pageTitle={data?.pageTitle}
      docContent={data?.termsAndConditions}
    />
  );
}

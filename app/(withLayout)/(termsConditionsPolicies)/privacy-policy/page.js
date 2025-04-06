import LegalDoc from "@/app/components/legal/LegalDoc";
import { fetchLegalPolicyData } from "@/app/utils/fetchLegalPolicyData";

export default async function PrivacyPolicy() {
  const data = await fetchLegalPolicyData("all-privacy-policies");

  return (
    <LegalDoc pageTitle={data?.pageTitle} docContent={data?.privacyAndPolicy} />
  );
}

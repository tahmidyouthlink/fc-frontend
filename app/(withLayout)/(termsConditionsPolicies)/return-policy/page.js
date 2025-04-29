import LegalDoc from "@/app/components/legal/LegalDoc";
import { fetchLegalPolicyData } from "@/app/utils/fetchLegalPolicyData";

export const dynamic = "force-dynamic";

export default async function ReturnPolicy() {
  const data = await fetchLegalPolicyData("all-return-policies");

  return (
    <LegalDoc pageTitle={data?.pageTitle} docContent={data?.returnAndPolicy} />
  );
}

import LegalDoc from "@/app/components/legal/LegalDoc";
import { fetchLegalPolicyData } from "@/app/utils/fetchLegalPolicyData";

export const dynamic = "force-dynamic";

export default async function RefundPolicy() {
  const data = await fetchLegalPolicyData("all-refund-policies");

  return (
    <LegalDoc pageTitle={data?.pageTitle} docContent={data?.refundAndPolicy} />
  );
}

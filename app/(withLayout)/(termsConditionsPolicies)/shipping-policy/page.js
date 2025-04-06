import LegalDoc from "@/app/components/legal/LegalDoc";
import { fetchLegalPolicyData } from "@/app/utils/fetchLegalPolicyData";

export default async function ShippingPolicy() {
  const data = await fetchLegalPolicyData("all-shipping-policies");

  return (
    <LegalDoc
      pageTitle={data?.pageTitle}
      docContent={data?.shippingAndPolicy}
    />
  );
}

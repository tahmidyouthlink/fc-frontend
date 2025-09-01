import LegalDoc from "@/app/components/legal/LegalDoc";
import { samplePolicy } from "@/app/data/samplePolicy";

export default async function ShippingPolicy() {
  return <LegalDoc pageTitle="Shipping Policy" docContent={samplePolicy} />;
}

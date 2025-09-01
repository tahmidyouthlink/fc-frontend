import LegalDoc from "@/app/components/legal/LegalDoc";
import { samplePolicy } from "@/app/data/samplePolicy";

export default async function RefundPolicy() {
  return <LegalDoc pageTitle="Refund Policy" docContent={samplePolicy} />;
}

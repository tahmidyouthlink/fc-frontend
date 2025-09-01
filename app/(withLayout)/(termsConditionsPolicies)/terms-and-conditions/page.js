import LegalDoc from "@/app/components/legal/LegalDoc";
import { sampleTermsConditions } from "@/app/data/sampleTermsConditions";

export default async function TermsAndConditions() {
  return (
    <LegalDoc
      pageTitle="Terms & Conditions"
      docContent={sampleTermsConditions}
    />
  );
}

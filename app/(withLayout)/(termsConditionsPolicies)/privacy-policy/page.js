import LegalDoc from "@/app/components/legal/LegalDoc";
import { samplePolicy } from "@/app/data/samplePolicy";

export default async function PrivacyPolicy() {
  return <LegalDoc pageTitle="Privacy Policy" docContent={samplePolicy} />;
}

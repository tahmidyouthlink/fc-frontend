import Link from "next/link";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";

export const dynamic = "force-dynamic";

export default async function Importantlinks() {
  let legalPolicyPdfLinks;

  try {
    const response = await rawFetch("/get-all-policy-pdfs");
    [legalPolicyPdfLinks] = response.data || [];
  } catch (error) {
    console.error("FetchError (importantLinks/legalPdfLinks):", error.message);
  }

  return (
    <div className="col-span-1 space-y-2.5">
      <h3 className="font-semibold uppercase">Important Links</h3>
      <ul>
        <li>
          <Link target="_blank" href={legalPolicyPdfLinks?.terms}>
            Terms & Conditions
          </Link>
        </li>
        <li>
          <Link target="_blank" href={legalPolicyPdfLinks?.privacy}>
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link target="_blank" href={legalPolicyPdfLinks?.refund}>
            Refund Policy
          </Link>
        </li>
        <li>
          <Link target="_blank" href={legalPolicyPdfLinks?.shipping}>
            Shipping Policy
          </Link>
        </li>
        <li>
          <Link target="_blank" href={legalPolicyPdfLinks?.return}>
            Return Policy
          </Link>
        </li>
      </ul>
    </div>
  );
}

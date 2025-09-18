import Link from "next/link";

export default async function Importantlinks() {
  return (
    <div className="col-span-1 space-y-2.5">
      <h3 className="font-semibold uppercase">Important Links</h3>
      <ul>
        <li>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
        </li>
        <li>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/return-refund-cancellation-policy">
            Return & Refund Policy
          </Link>
        </li>
        <li>
          <Link href="/shipping-policy">Shipping Policy</Link>
        </li>
      </ul>
    </div>
  );
}

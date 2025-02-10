import TransitionLink from "@/app/components/ui/TransitionLink";

export default function Importantlinks() {
  return (
    <div className="col-span-1 space-y-2.5">
      <h3 className="font-semibold uppercase">Important Links</h3>
      <ul>
        <li>
          <TransitionLink href="/terms-and-conditions">
            Terms & Conditions
          </TransitionLink>
        </li>
        <li>
          <TransitionLink href="/privacy-policy">Privacy Policy</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/refund-policy">Refund Policy</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/shipping-policy">
            Shipping Policy
          </TransitionLink>
        </li>
        <li>
          <TransitionLink href="/return-policy">Return Policy</TransitionLink>
        </li>
      </ul>
    </div>
  );
}

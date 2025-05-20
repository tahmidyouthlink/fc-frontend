import TransitionLink from "@/app/components/ui/TransitionLink";

export default function CompanyLinks() {
  return (
    <div className="col-span-1 space-y-2.5">
      <h3 className="font-semibold uppercase">Company Links</h3>
      <ul>
        <li>
          <TransitionLink href="/our-story">Souls</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/shop">Threadz</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/faq">FAQ</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/contact-us">Contact Us</TransitionLink>
        </li>
      </ul>
    </div>
  );
}

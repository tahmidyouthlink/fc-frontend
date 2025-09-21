import TransitionLink from "@/app/components/ui/TransitionLink";

export default function CompanyLinks({ isLoggedIn }) {
  return (
    <div className="col-span-1 space-y-2.5">
      <h3 className="font-semibold uppercase">Company Links</h3>
      <ul>
        <li>
          <TransitionLink href="/story">Souls</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/shop">Threadz</TransitionLink>
        </li>
        <li>
          <TransitionLink href="/help">Help Center</TransitionLink>
        </li>
        {isLoggedIn && (
          <li>
            <TransitionLink href="/contact-us">Contact Us</TransitionLink>
          </li>
        )}
      </ul>
    </div>
  );
}

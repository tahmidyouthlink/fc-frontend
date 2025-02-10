import CompanyInfo from "./subcomponents/CompanyInfo";
import CompanyLinks from "./subcomponents/ComanyLinks";
import Importantlinks from "./subcomponents/ImportantLinks";
import PaymentMethodPartners from "./subcomponents/PaymentMethodPartners";

export default function FooterMenu() {
  return (
    <div className="grid grid-cols-2 justify-between pb-8 pt-12 max-lg:gap-12 sm:grid-cols-[auto,auto,auto] lg:grid-cols-[auto,auto,auto,auto]">
      <CompanyInfo />
      <CompanyLinks />
      <Importantlinks />
      <PaymentMethodPartners />
    </div>
  );
}

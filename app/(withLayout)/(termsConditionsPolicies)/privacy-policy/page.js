import { COMPANY_EMAIL, COMPANY_PHONE } from "@/app/config/company";
import LegalDoc from "@/app/components/legal/LegalDoc";

export default async function PrivacyPolicy() {
  const docContent = `
    <h2>Introduction</h2>
    <p>POSHAX (“we,” “our,” “us”) operates this website and online store (the “Services”) to provide a curated shopping experience to our customers. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you visit or use the Services, make a purchase, or communicate with us.</p>
    <p>By using our Services, you acknowledge and agree to the terms of this Privacy Policy. If there is any conflict between our Terms &amp; Conditions and this Privacy Policy, this Privacy Policy governs the collection, processing, and disclosure of your personal information.</p>
    <h2>Personal Information We Collect</h2>
    <p>“Personal information” refers to information that identifies or can reasonably be linked to you. This excludes anonymized or de-identified data. We may collect the following categories of personal information:</p>
    <ul>
      <li><strong>Contact details</strong> — name, billing address, shipping address, phone number, email address.</li>
      <li><strong>Financial information</strong> — payment method, transaction details, payment confirmation.</li>
      <li><strong>Account information</strong> — username, password, preferences, and settings.</li>
      <li><strong>Transaction history</strong> — items viewed, purchased, returned, or exchanged.</li>
      <li><strong>Communications</strong> — content of your inquiries or correspondence with us.</li>
      <li><strong>Device information</strong> — IP address, browser type, device identifiers.</li>
      <li><strong>Usage information</strong> — browsing activity and interaction with the Services.</li>
    </ul>
    <h2>Sources of Personal Information</h2>
    <p>We may collect personal information:</p>
    <ul>
      <li><strong>Directly from you</strong> — through account creation, purchases, or direct communication.</li>
      <li><strong>Automatically</strong> — via cookies, analytics tools, and similar technologies.</li>
      <li><strong>From service providers</strong> — such as payment processors, logistics providers, and marketing platforms.</li>
      <li><strong>From partners or other third parties</strong> — where legally permitted.</li>
    </ul>
    <h2>How We Use Personal Information</h2>
    <p>We may use your personal information for the following purposes:</p>
    <ul>
      <li><strong>Provision of Services</strong> — processing orders, managing accounts, facilitating payments, delivering products, and handling returns or exchanges.</li>
      <li><strong>Personalization</strong> — remembering preferences, tailoring product recommendations, and improving user experience.</li>
      <li><strong>Marketing and advertising</strong> — sending promotional offers, advertising products, and conducting remarketing (subject to your consent where required by law).</li>
      <li><strong>Security and fraud prevention</strong> — verifying transactions, preventing fraud, and maintaining system security.</li>
      <li><strong>Customer support</strong> — responding to inquiries and resolving disputes.</li>
      <li><strong>Legal compliance</strong> — fulfilling obligations under Bangladeshi laws and responding to lawful requests from authorities.</li>
    </ul>
    <h2>Disclosure of Personal Information</h2>
    <p>We do not sell personal information. We may disclose your personal information:</p>
    <ul>
      <li>To <strong>service providers</strong> — including payment gateways, logistics companies, IT service providers, and analytics partners, strictly for service-related purposes.</li>
      <li>To <strong>marketing partners</strong> — to deliver relevant advertisements, with your consent where applicable.</li>
      <li>To <strong>legal authorities</strong> — when required by law or legal process.</li>
      <li>In connection with <strong>business transactions</strong> — such as mergers, acquisitions, or restructuring.</li>
    </ul>
    <h2>Cookies and Tracking Technologies</h2>
    <p>We use cookies and similar technologies to:</p>
    <ul>
      <li>Enable website functionality.</li>
      <li>Store shopping preferences and cart items.</li>
      <li>Measure site performance and usage trends.</li>
    </ul>
    <p>You can disable cookies in your browser settings; however, certain features of the Services may not function properly.</p>
    <h2>Children’s Data</h2>
    <p>Our Services are not intended for individuals under the age of 18 in Bangladesh. We do not knowingly collect data from individuals under the age of 18.</p>
    <h2>Data Security and Retention</h2>
    <p>We employ industry-standard security measures to protect personal data. However, no method of transmission or storage is entirely secure.</p>
    <p>We retain personal data only as long as necessary to:</p>
    <ul>
      <li>Provide the Services.</li>
      <li>Comply with legal obligations.</li>
      <li>Resolve disputes.</li>
      <li>Enforce our agreements.</li>
    </ul>
    <h2>Your Rights</h2>
    <p>Depending on applicable law, you may have the right to:</p>
    <ul>
      <li>Access the personal information we hold about you.</li>
      <li>Request correction or deletion of your personal information.</li>
      <li>Withdraw consent for marketing communications.</li>
      <li>Request a copy of your personal information in a portable format.</li>
    </ul>
    <p>Requests must be submitted using the contact details provided below. We may require verification of your identity before processing such requests.</p>
    <h2>Changes to This Policy</h2>
    <p>We may update this Privacy Policy periodically. Any changes will be posted on this page with the updated “Last updated” date.</p>
    <h2>Contact Information</h2>
    <p>For questions, concerns, or to exercise your privacy rights, please contact us:</p>
    <p>📧 <strong>Email:</strong> <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a></p>
    <p>☎️ <strong>Hotline:</strong> <a href="tel:+88${COMPANY_PHONE.replace(/\s/g, "")}">${COMPANY_PHONE}</a> (Sunday - Thursday | 9 AM - 6 PM)</p>
  `;

  return <LegalDoc pageTitle="Privacy Policy" docContent={docContent} />;
}

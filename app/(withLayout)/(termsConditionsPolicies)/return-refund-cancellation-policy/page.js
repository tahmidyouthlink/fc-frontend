import LegalDoc from "@/app/components/legal/LegalDoc";

export default async function ReturnPolicy() {
  const docContent = `
    <h2><strong>Return Policy</strong></h2>
    <p><strong>We have a 3-day return policy</strong>, which means you must report your return request within 3 days after receiving your item.</p>
    <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You will also need the receipt or proof of purchase. <strong>All refunds or replacements are subject to product inspection.</strong></p>
    <p><strong>How to Start a Return:</strong> To start a return, simply log in to your user account on our website. Navigate to your order history and select the item you wish to return, then follow the on-screen instructions to initiate the process.</p>
    <p><strong>Damages and Issues:</strong> Please inspect your order upon reception and contact us immediately if the item is defective, damaged, or if you receive the wrong item. This allows us to evaluate the issue and make it right for you.</p>
    <p><strong>Exceptions / Non-Returnable Items:</strong> Unfortunately, we cannot accept returns on <strong>sale items</strong> or <strong>gift cards</strong>.</p>
    <h2><strong>Exchanges</strong></h2>
    <p>If you wish to exchange an item, please follow our return process. The replacement of an item is <strong>subject to stock availability</strong>. If the item you want is not in stock, a refund will be issued instead.</p>
    <h2><strong>Refunds</strong></h2>
    <p>Refunds are processed after the returned product has been inspected and approved. Refunds typically take <strong>10-14 working days</strong> to be credited to your original payment method.</p>
    <p><strong>Please note:</strong></p>
    <ul>
      <li><strong>Delivery charges</strong> and <strong>payment processing fees</strong> are non-refundable.</li>
      <li>If a payment is made multiple times due to a technical error, any extra payments will be fully refunded.</li>
      <li>It can take some time for your bank or credit card company to process and post the refund. If more than 15 working days have passed since we approved your return, please contact our support team for assistance.</li>
    </ul>
    <h2><strong>Order Cancellation</strong></h2>
    <p>You may cancel your order <strong>before it is shipped</strong> by contacting our Customer Care team promptly. After the order has been shipped, cancellations are not possible.</p>
  `;

  return (
    <LegalDoc
      pageTitle="Return, Refund & Cancellation Policy"
      docContent={docContent}
    />
  );
}

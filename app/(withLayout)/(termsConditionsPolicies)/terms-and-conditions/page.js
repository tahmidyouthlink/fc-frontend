export default function TermsAndConditions() {
  const termsConditionsMarkdown = `
    <p>
      Welcome to F-commerce.com also hereby known as "we",
      "us" or "F-commerce". Please read these Terms &
      conditions carefully before using this Site. By using the Site, you
      hereby accept these terms and conditions and represent that you agree to
      comply with these terms and conditions (the "User Agreement").
      This User Agreement is deemed effective upon your use of the Site which
      signifies your acceptance of these terms. If you do not agree to be
      bound by this User Agreement please do not access, register with or use
      this Site. This Site is owned and operated by F-commerce. (Registration
      number: TRAD/DNCC/025698/2024)
    </p>
    <p>
      The Site reserves the right to change, modify, add, or remove portions
      of these Terms and Conditions at any time without any prior
      notification. Changes will be effective when posted on the Site with no
      other notice provided. Please check these Terms and Conditions regularly
      for updates. Your continued use of the Site following the posting of
      changes to Terms and Conditions of use constitutes your acceptance of
      those changes.
    </p>
    <h2>Introduction</h2>
    <p>
      The domain name www.F-commerce.com (referred to as "Website")
      is owned by "F-commerce" a company incorporated under the
      Companies Act, 1994 (Act XVIII of 1994).
    </p>
    <p>
      By accessing this Site, you confirm your understanding of the Terms of
      Use. If you do not agree to these Terms, you shall not use this website.
      The Site reserves the right to change, modify, add, or remove portions
      of these Terms at any time. Changes will be effective when posted on the
      Site with no other notice provided. Please check these Terms of Use
      regularly for updates. Your continued use of the Site following the
      posting of changes to these Terms of Use constitutes your acceptance of
      those changes.
    </p>
    <h2>User Account, Password, and Security</h2>
    <p>
      You will receive a password and account designation upon completing the
      Website's registration process. You shall be responsible for
      maintaining the confidentiality of your account & its password as well
      as all the transactions/requests done/received under your password or
      account. You agree to (a) immediately notify F-commerce.com of any
      unauthorized use of your password or account or any other breach of
      security, and (b) ensure that you exit from your account at the end of
      each session. F-commerce.com shall not be liable for any loss or damage
      arising from your failure to comply with the T&C.
    </p>
    <h2>Services</h2>
    <p>
      F-commerce.com provides a number of Internet-based services through the
      Web Site (all such services, collectively, the "Service"). One
      such service enables users to purchase custom merchandise from
      F-commerce and various sellers.(Collectively, "Products"). The
      Products can be purchased through the Website through various methods of
      payments offered. Upon placing an order, F-commerce.com shall ship the
      product to you and you shall be responsible for its payment.
    </p>
    <h2>Privacy</h2>
    <p>
      The User hereby consents, expresses and agrees that he has read and
      fully understands the Privacy Policy of F-commerce.com. The user further
      consents that the terms and contents of such Privacy Policy are
      acceptable to him.
    </p>
    <h2>Limited User</h2>
    <p>
      The User agrees and undertakes not to reverse engineer, modify, copy,
      distribute, transmit, display, perform, reproduce, publish, license,
      create derivative works from, transfer, or sell any information or
      software obtained from the Website. Limited reproduction and copying of
      the content of the Website is permitted provided that F-commerce's
      name is stated as the source and prior written permission of
      F-commerce.com is sought. For the removal of doubt, it is clarified that
      unlimited or wholesale reproduction, copying of the content for
      commercial or non-commercial purposes and unwarranted modification of
      data and information within the content of the Website is not permitted.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores eveniet
      voluptatibus aut, dolorum ipsam explicabo molestiae quasi fuga modi!
      Expedita eaque possimus cupiditate, maiores et vero. Expedita autem
      labore doloribus quia voluptates tempora error amet, animi
      exercitationem odio rerum quasi culpa nobis nemo pariatur nostrum
      dignissimos magnam excepturi quidem enim?
    </p>
  `;

  return (
    <>
      <h1>Terms & Conditions</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: termsConditionsMarkdown,
        }}
      ></div>
    </>
  );
}

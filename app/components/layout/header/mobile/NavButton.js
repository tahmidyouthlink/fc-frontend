"use client";

import { useEffect, useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import NavMenu from "./NavMenu";

export default function NavButton({ logoWithTextSrc, legalPolicyPdfLinks }) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isNavMenuOpen ? "hidden" : "unset";
  }, [isNavMenuOpen]);

  return (
    <>
      <li className="my-auto">
        <IoMenuOutline
          className="h-5 w-auto cursor-pointer sm:h-6 lg:hidden"
          onClick={() => setIsNavMenuOpen(true)}
        />
      </li>
      <NavMenu
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
        logoWithTextSrc={logoWithTextSrc}
        legalPolicyPdfLinks={legalPolicyPdfLinks}
      />
    </>
  );
}

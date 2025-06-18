"use client";

import { useState, useEffect } from "react";
import { LuFileText } from "react-icons/lu";
import { useLoading } from "@/app/contexts/loading";

const OrderInvoiceButton = ({ selectedOrder }) => {
  const { setIsPageLoading } = useLoading();
  const [pdfModule, setPdfModule] = useState(null);

  useEffect(() => {
    // Dynamically import @react-pdf/renderer for client-side rendering only
    import("@react-pdf/renderer")
      .then((module) => setPdfModule(module))
      .catch((error) =>
        console.error("Failed to load @react-pdf/renderer:", error),
      );
  }, []);

  const handlePreview = async () => {
    if (!selectedOrder || !pdfModule) return;

    setIsPageLoading(true);

    try {
      // Dynamically import the PDFDocument only on client when needed
      const PDFDocument = (await import("../../layout/PDFDocument")).default;

      const { pdf } = pdfModule;
      const blob = await pdf(<PDFDocument order={selectedOrder} />).toBlob();
      const pdfURL = URL.createObjectURL(blob);

      window.open(pdfURL, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--color-primary-500)] py-3 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
      onClick={handlePreview}
    >
      View Invoice
      <LuFileText size={14} />
    </button>
  );
};

export default OrderInvoiceButton;

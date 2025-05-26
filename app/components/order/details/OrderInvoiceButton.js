"use client";

import { useState, useEffect } from "react";
import { LuFileText } from "react-icons/lu";
import { useLoading } from "@/app/contexts/loading";
import PDFDocument from "../../layout/PDFDocument";

const OrderInvoiceButton = ({ selectedOrder }) => {
  const { setIsPageLoading } = useLoading();
  const [pdfModule, setPdfModule] = useState(null);

  useEffect(() => {
    // Dynamically import @react-pdf/renderer for client-side rendering only
    import("@react-pdf/renderer")
      .then((module) => {
        setPdfModule(module); // Store the pdf module for later use
      })
      .catch((error) => {
        console.error("Failed to load @react-pdf/renderer:", error);
      });
  }, []);

  const handlePreview = async () => {
    if (!selectedOrder || !pdfModule) return;

    setIsPageLoading(true); // Show loading state

    try {
      const { pdf } = pdfModule; // Use the dynamically imported pdf function
      const blob = await pdf(<PDFDocument order={selectedOrder} />).toBlob();
      const pdfURL = URL.createObjectURL(blob);

      window.open(pdfURL, "_blank"); // Opens the PDF in a new tab
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPageLoading(false); // Hide loading state
    }
  };

  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-regular)] py-3 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[var(--color-primary-dark)]"
      onClick={handlePreview}
    >
      View Invoice
      <LuFileText size={14} />
    </button>
  );
};

export default OrderInvoiceButton;

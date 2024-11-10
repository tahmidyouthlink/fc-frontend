// components/PrintButton.js
import { pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';

const CustomerPrintButton = ({ selectedOrder }) => {

  if (!selectedOrder) {
    return null; // or display a message like "No order selected"
  }

  const handlePreview = async () => {
    const blob = await pdf(<PDFDocument order={selectedOrder} />).toBlob();
    const pdfURL = URL.createObjectURL(blob);
    const printWindow = window.open(pdfURL, '_blank'); // Opens the PDF in a new tab
    // Automatically trigger print dialog
    printWindow.onload = function () {
      printWindow.focus(); // Make sure the window is focused
      printWindow.print(); // Trigger the print dialog
    };
  };

  return (
    <>
      <span className="text-sm font-mono cursor-pointer text-blue-600 hover:text-blue-800" onClick={handlePreview}>
        {selectedOrder?.orderNumber}
      </span>
    </>
  );
};

export default CustomerPrintButton;
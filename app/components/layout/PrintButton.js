// components/PrintButton.js
import { pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';
import { Button } from '@nextui-org/react';
import { PiDownloadBold } from 'react-icons/pi';

const PrintButton = ({ selectedOrder }) => {

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
      <Button color="primary" size='sm' onClick={handlePreview}>
        Download Invoice <PiDownloadBold size={18} />
      </Button>
    </>
  );
};

export default PrintButton;
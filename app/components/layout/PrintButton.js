import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@nextui-org/react';

// Function to add gaps between every letter
function addGaps(text, gap = ' ') {
  return text.split('').join(gap);
}

// Generate Barcode as PNG Data URL
const generateBarcodeData = (orderNumber) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, orderNumber, {
    format: 'CODE128',
    displayValue: false,       // Make sure this is true to display the text
    fontSize: 20,             // Adjusted font size for better readability
    width: 2,                 // Thicker lines
    height: 60,               // Increased height for clarity
    textAlign: 'center',      // Center-align the text
    textMargin: 2,           // Margin between barcode and text
    background: '#ffffff',    // White background for better contrast
    lineColor: '#000000'      // Black lines for maximum contrast
  });
  return canvas.toDataURL('image/png');
};

const PrintButton = ({ selectedOrder }) => {

  const handlePrint = async (selectedOrder) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!selectedOrder || !selectedOrder.orderNumber) {
      console.error('Order number is missing or undefined');
      return;
    }

    const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAgCAYAAADqgqNBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHBSURBVHgB7Ze/TsJQFMa/cynqYlISSBjZdOQNxMlRou5AeAB8A19BZ2PwBSSQuDApg6ORQRKc7OCA0aEmDtXgPR4IyJ+2iUWQAX7LvXyc06/ntqe3BZbMAfL7o7gfK0BTViJMTArD1sQn+dLLOX5rXkybCaiVR0wLrbdz5dfrcVl5BlO4iGlCdOQpjwtSdVKqvsO08ajeXbkKFzADmCjtsnKHUQozgIgysqqmr3kxHcvKkMBsMLVazcLPXO6ADGaIYr07atdj6u3lh/6M5Mq23T2ZvtaGkXAFEhyPdBteeMV65hvJ/uzH3EC7LoM1HMYaVZcZUR3EzRGNUecv1MZc7F7+MJY4Wf0fof6k0nSc9MZ6hcERUh1jqrHCPZgfqHN1FL8z6JaBGxkbkvJBxG1m1RCtJmVYchJvRFiTsamBC0l76mqKOxaX0KFcrtyyBgvjwdle9FDcJn+muyA7X3o+HlcV5sjSfPHMDQSEmE1ppx2ZxXuSIz3TYs012bnsIMcKbq5oS3p3c0RkxGXXcqSbq0GOFXzZ2fedLo6ALO/2xTPvbiynB9GUodUV/ovem2y31Yy29Ceh/qevk0AM9vTF5Buk7I7utuWMlAAAAABJRU5ErkJggg==";

    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.width;

    // Set up fonts and colors
    pdf.setFont('helvetica', 'normal');
    const primaryColor = [0, 0, 0];
    const secondaryColor = [128, 128, 128];
    const textColor = [0, 0, 0]; // Black color for text

    // Top Section - Order Details and Company Information
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);

    const logoX = margin; // X position of the logo
    const logoY = margin; // Y position of the logo
    const textX = logoX + 12; // X position of the text, adjust to position relative to the logo
    const textY = logoY + 8; // Y position of the text, adjust as needed

    // Define sizes for the logo and text
    const textSizeLogo = 20; // Font size for the logo text
    const textSize = 10; // Font size for the company information text
    const logoWidth = 10; // Width of the logo
    const logoHeight = 10; // Height of the logo

    // Add the logo image to the PDF
    pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Add the logo text below or alongside the logo
    pdf.setFontSize(textSizeLogo);
    pdf.setTextColor(...textColor);
    pdf.text('F-Commerce', textX, textY);

    // Company Information on the right
    pdf.setFontSize(textSize); // Set font size for company information
    pdf.setTextColor(...textColor);

    // Right-align company information
    pdf.text('Fashion Commerce', pageWidth - margin, margin, { align: 'right' });
    pdf.text('Mirpur, Dhaka, 1100', pageWidth - margin, margin + 5, { align: 'right' });
    pdf.text('Email: fashion@commerce.com', pageWidth - margin, margin + 10, { align: 'right' });
    pdf.text('Phone: +88 019 999 99999', pageWidth - margin, margin + 15, { align: 'right' });

    // Customer Info
    pdf.setFontSize(10);
    pdf.setTextColor(...primaryColor);
    pdf.text('Delivery Address', margin, margin + 31);

    const lineHeight = 7;
    const charGap = ' '; // Gap between characters
    // Define font sizes and styles
    const largeFontSize = 14; // Font size for customer name and phone number
    const smallFontSize = 10; // Font size for address
    const boldFontStyle = 'normal'; // Bold style

    // Define text color (replace ...secondaryColor with actual color values)

    pdf.setTextColor(...textColor);

    // Format the phone numbers with gaps between characters
    const phoneNumberWithGaps = addGaps(selectedOrder.phoneNumber, charGap);
    const phoneNumber2WithGaps = selectedOrder.phoneNumber2 && selectedOrder.phoneNumber2 !== '0'
      ? addGaps(selectedOrder.phoneNumber2, charGap)
      : null;

    // Create an array of lines with different formatting
    const customerDetails = [
      { text: selectedOrder.customerName.toUpperCase(), fontSize: largeFontSize, fontWeight: boldFontStyle, },
      { text: `${selectedOrder.address1}${selectedOrder.address2 ? ', ' + selectedOrder.address2 : ''}, ${selectedOrder.city}, ${selectedOrder.postalCode}`, fontSize: smallFontSize, fontWeight: '' },
      { text: phoneNumberWithGaps, fontSize: largeFontSize, fontWeight: boldFontStyle },
      { text: phoneNumber2WithGaps, fontSize: largeFontSize, fontWeight: boldFontStyle },
    ].filter(item => item.text); // Filter out any null values

    // Calculate the starting Y position
    let yPosition = margin + 37;

    // Add each line of text to the PDF with specific formatting
    customerDetails.forEach(({ text, fontSize, fontWeight }) => {
      pdf.setFontSize(fontSize);
      pdf.text(text, margin, yPosition);
      yPosition += lineHeight; // Increment Y position for the next line
    });

    // Barcode
    const barcodeDataUrl = generateBarcodeData(selectedOrder.orderNumber);
    pdf.addImage(barcodeDataUrl, 'PNG', margin, yPosition, 80, 30);

    // Additional Info aligned to the right with smaller font size
    pdf.setFontSize(10);
    let yPositionInvoice = 41;

    // Set constant xPosition for right alignment
    const xPosition = pageWidth - margin;

    // Bold "Invoice" text, aligned right
    pdf.setFont('helvetica', 'bold');
    pdf.text('Invoice', xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Normal font for the rest
    pdf.setFont('helvetica', 'normal');

    pdf.text(`Invoice ID: ${selectedOrder.orderNumber}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Order date
    pdf.text(`Order Date: ${selectedOrder.dateTime.trim()}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Item count
    const itemCount = selectedOrder.productInformation.length;
    pdf.text(`Items Count: ${itemCount}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Shipping method
    pdf.text(`Shipping Method: ${selectedOrder.shippingMethod.trim()}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Payment status
    const paymentStatus = selectedOrder.paymentStatus
      ? selectedOrder.paymentStatus.trim()
      : `Payable: ${selectedOrder.paymentPayable.trim()}`;
    pdf.text(`Payment Status: ${paymentStatus}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    const subtotal = parseFloat(selectedOrder.productInformation.reduce((total, product) => total + (product.unitPrice * product.sku), 0).toFixed(2));
    const shippingCharge = parseFloat(selectedOrder.shippingCharge?.toFixed(2) || "0.00");

    // Check if Promo or Offer is applied
    const promoCode = selectedOrder.promoCode;
    const promoDiscountValue = parseFloat(selectedOrder?.promoDiscountValue?.toFixed(2) || "0.00");
    const offerCode = selectedOrder.offerCode; // Use offerCode instead of offerCode
    const offerDiscountValue = parseFloat(selectedOrder?.offerDiscountValue?.toFixed(2) || "0.00");

    // Determine if Promo or Offer is applied and calculate the discount accordingly
    let discountAmount = 0;
    let discountLabel = '';

    if (promoCode) {
      // Promo Discount
      if (selectedOrder.promoDiscountType === 'Percentage') {
        discountAmount = (subtotal * (promoDiscountValue / 100)).toFixed(2);
      } else if (selectedOrder.promoDiscountType === 'Amount') {
        discountAmount = promoDiscountValue.toFixed(2);
      }
      discountLabel = `Promo Discount (${promoCode}) :`;
    } else if (offerCode) {
      // Offer Discount
      if (selectedOrder.offerDiscountType === 'Percentage') {
        discountAmount = (subtotal * (offerDiscountValue / 100)).toFixed(2);
      } else if (selectedOrder.offerDiscountType === 'Amount') {
        discountAmount = offerDiscountValue.toFixed(2);
      }
      discountLabel = `Offer Discount (${offerCode}) :`;
    }

    const total = (subtotal - discountAmount + shippingCharge).toFixed(2);

    pdf.autoTable({
      startY: margin + 90, // Adjust starting Y position
      head: [['#Title', 'Color', 'Size', 'Price', 'QTY', 'Total']], // Table headers
      body: [
        ...selectedOrder.productInformation.map(product => [
          product.productTitle,
          product.color?.label || '',
          product.size || '',
          `${product.unitPrice?.toFixed(2)}`,
          product.sku,
          `BDT ${(product.unitPrice * product.sku).toFixed(2)}`
        ]), // Add all product rows

        // Subtotal Row
        [{ content: 'Subtotal:', colSpan: 5, styles: { halign: 'right', border: 'none' } }, `BDT ${subtotal.toFixed(2)}`],

        // Discount Row (only show if applicable)
        ...(discountAmount > 0
          ? [[{ content: discountLabel, colSpan: 5, styles: { halign: 'right', border: 'none' } }, `BDT -${discountAmount}`]]
          : []),

        // Shipping Charge Row
        [{ content: 'Shipping Charge:', colSpan: 5, styles: { halign: 'right', border: 'none' } }, `BDT ${shippingCharge.toFixed(2)}`],

        // Total Row
        [{ content: 'Total:', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, `BDT ${total}`]
      ],
      theme: 'plain', // No borders for the table
      styles: {
        fontSize: 10, // Font size for table content
        valign: 'middle',
        halign: 'center',
        cellPadding: 3, // Adjust cell padding as needed
      },
      columnStyles: {
        0: { halign: 'left' }, // Align product titles to the left
        5: { halign: 'right', fontStyle: 'bold' }, // Right align price columns, bold total
      }
    });

    const additionalDetails = [
      ['Shipping Zone:', selectedOrder.shippingZone, 'Shipping Method:', selectedOrder.shippingMethod],
      ['Payment Method:', selectedOrder.paymentMethod, 'Payment Status:', selectedOrder.paymentStatus],
      ['Vendor:', selectedOrder.vendor, 'Tracking Number:', selectedOrder.trackingNumber],
    ];

    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 15,
      body: additionalDetails,
      theme: 'grid',
      styles: { fontSize: 10, valign: 'middle', halign: 'left' },
      columnStyles: {
        0: { cellWidth: pageWidth / 4 - 2 * margin },
        1: { cellWidth: pageWidth / 4 - 2 * margin },
        2: { cellWidth: pageWidth / 4 - 2 * margin },
        3: { cellWidth: pageWidth / 4 - 2 * margin },
      },
    });

    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);

    const disclaimerText = 'If this invoice is for ongoing services and you have requested us to take payment using the continuous authority credit or debit card details stored on our system, then we will do so and no further action is required.';
    const disclaimerWidth = pageWidth - 2 * margin;
    const disclaimerHeight = pdf.getTextDimensions(disclaimerText, { maxWidth: disclaimerWidth }).h + 4;
    const disclaimerX = margin;
    const disclaimerY = pdf.autoTable.previous.finalY + 45;

    pdf.rect(disclaimerX, disclaimerY, disclaimerWidth, disclaimerHeight, 'S');

    pdf.text(disclaimerText, disclaimerX + disclaimerWidth / 2, disclaimerY + disclaimerHeight / 2, {
      align: 'center',
      maxWidth: disclaimerWidth,
      baseline: 'middle',
    });

    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // Open the PDF in a new window
    const printWindow = window.open(blobUrl);

    // Automatically trigger print dialog
    printWindow.onload = function () {
      printWindow.focus(); // Make sure the window is focused
      printWindow.print(); // Trigger the print dialog
    };
  };

  return (
    <>
      <Button color="primary" onPress={() => handlePrint(selectedOrder)}>
        Print Invoice
      </Button>
    </>
  );
};

export default PrintButton;
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
    height: 40,               // Increased height for clarity
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
    pdf.addImage(barcodeDataUrl, 'PNG', margin, yPosition + 10, 80, 30);

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

    // Shipping zone
    pdf.text(`Shipping Zone: ${selectedOrder.shippingZone.trim()}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Payment status
    pdf.text(`Payment Status: ${selectedOrder.paymentStatus.trim()}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Payment method
    pdf.text(`Payment Method: ${selectedOrder.paymentMethod.trim()}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Vendor
    pdf.text(`Vendor: ${selectedOrder.vendor.trim()}`, xPosition, yPositionInvoice, { align: 'right' });
    yPositionInvoice += lineHeight;

    // Tracking Number
    pdf.text(
      `Tracking Number: ${selectedOrder.trackingNumber?.trim() || "--"}`,
      xPosition,
      yPositionInvoice,
      { align: 'right' }
    );
    yPositionInvoice += lineHeight;

    // Check if any product has an offer
    const hasOffers = selectedOrder.productInformation.some(product => product.offerTitle);

    // Prepare the product rows
    const productRows = selectedOrder.productInformation.map(product => {
      let productTotal = product.unitPrice * product.sku; // Original price
      let offerDiscount = 0;

      // Apply offer discount per product
      if (product.offerTitle) {
        if (product.offerDiscountType === 'Percentage') {
          offerDiscount = (productTotal * (product.offerDiscountValue / 100)).toFixed(2);
        } else if (product.offerDiscountType === 'Amount') {
          offerDiscount = product.offerDiscountValue.toFixed(2);
        }
        productTotal = (productTotal - offerDiscount).toFixed(2);
      }

      return [
        product.productTitle,   // Title
        product.color?.label || '',  // Color
        product.size || '',         // Size
        `BDT ${product.unitPrice.toFixed(2)}`, // Unit Price
        product.sku,                // QTY
        `BDT ${productTotal}`,       // Total
        product.offerTitle ? `${product.offerTitle} (-BDT ${offerDiscount})` : '' // Offer details
      ];
    });

    // Calculate subtotal
    const subtotal = parseFloat(
      selectedOrder.productInformation.reduce((total, product) => {
        const productTotal = product.unitPrice * product.sku;
        let offerDiscount = 0;
        if (product.offerTitle) {
          if (product.offerDiscountType === 'Percentage') {
            offerDiscount = (productTotal * (product.offerDiscountValue / 100));
          } else if (product.offerDiscountType === 'Amount') {
            offerDiscount = product.offerDiscountValue;
          }
        }
        return total + (productTotal - offerDiscount);
      }, 0).toFixed(2)
    );

    // Apply promo discount based on subtotal
    const promoCode = selectedOrder.promoCode;
    const promoDiscountValue = parseFloat(selectedOrder.promoDiscountValue || 0);
    let promoDiscount = 0;

    if (promoCode) {
      if (selectedOrder.promoDiscountType === 'Percentage') {
        promoDiscount = (subtotal * (promoDiscountValue / 100)).toFixed(2);
      } else if (selectedOrder.promoDiscountType === 'Amount') {
        promoDiscount = promoDiscountValue.toFixed(2);
      }
    }

    const shippingCharge = parseFloat(selectedOrder.shippingCharge || 0);
    const total = (subtotal - (promoDiscount || 0) + shippingCharge).toFixed(2);

    // Generate PDF table with the offer and promo discounts applied
    pdf.autoTable({
      startY: margin + 100,
      head: [['Title', 'Color', 'Size', 'Unit Price', 'QTY', 'Total', hasOffers ? 'Offers' : '']],
      body: [
        ...productRows.map(product => {
          return [
            product[0],   // Title
            product[1],   // Color
            product[2],   // Size
            product[3],   // Unit Price
            product[4],   // QTY
            product[5],   // Total
            hasOffers ? product[6] : '' // Offers (new column for offers)
          ];
        }),
        // Conditional column spans based on offers
        ...(hasOffers ? [
          [{ content: 'Subtotal:', colSpan: 5, styles: { halign: 'right' } }, `BDT ${subtotal.toFixed(2)}`],
          ...(promoDiscount > 0 ? [
            [{ content: `Promo Discount (${promoCode}):`, colSpan: 5, styles: { halign: 'right' } }, `BDT -${promoDiscount}`]
          ] : []),
          [{ content: 'Shipping Charge:', colSpan: 5, styles: { halign: 'right' } }, `BDT ${shippingCharge.toFixed(2)}`],
          [{ content: 'Total:', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, `BDT ${total}`]
        ] : [
          [{ content: 'Subtotal:', colSpan: 4, styles: { halign: 'right' } }, `BDT ${subtotal.toFixed(2)}`],
          ...(promoDiscount > 0 ? [
            [{ content: `Promo Discount (${promoCode}):`, colSpan: 4, styles: { halign: 'right' } }, `BDT -${promoDiscount}`]
          ] : []),
          [{ content: 'Shipping Charge:', colSpan: 4, styles: { halign: 'right' } }, `BDT ${shippingCharge.toFixed(2)}`],
          [{ content: 'Total:', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } }, `BDT ${total}`]
        ]),
      ],
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { halign: 'center' },    // Title aligned to center
        1: { halign: 'center' },    // Color aligned to center
        2: { halign: 'center' },    // Size aligned to center
        3: { halign: 'center' },    // Unit Price aligned to center
        4: { halign: 'center' },    // QTY aligned to center
        5: { halign: 'center' },    // Total aligned to center
        6: { halign: 'left' }       // Offers aligned to left
      }
    });

    // Define footer text
    const footerText = "www.f-commerce.com | info@f-commerce.com | Hotline: 01700000000";

    // Get the width of the text to center it
    const textWidth = pdf.getTextWidth(footerText);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const xCenter = (pdfWidth - textWidth) / 2;

    // Set the Y position for the bottom of the page
    const yBottom = pdf.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    // Add the footer text to the PDF
    pdf.setFontSize(10); // Ensure font size is set before adding the text
    pdf.setTextColor(0, 0, 0); // Optional: set the color for the footer text
    pdf.text(footerText, xCenter, yBottom); // No need for align: 'center' here

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
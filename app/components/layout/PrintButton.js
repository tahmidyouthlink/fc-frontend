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
    pdf.addImage(barcodeDataUrl, 'PNG', margin, yPosition + 5, 80, 30);

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

    // Prepare the product rows without applying discount at this point
    const productRows = selectedOrder.productInformation.map(product => {
      const productTotal = (product.unitPrice * product.sku).toFixed(2); // Original price without discount

      return [
        product.productTitle,   // Title
        product.color?.label || '',  // Color
        product.size || '',         // Size
        `${product.unitPrice.toFixed(2)}`, // Unit Price
        product.sku,                // QTY
        `BDT ${productTotal}`,       // Total (without discount)
        product.offerTitle ? { offerTitle: product.offerTitle, offerDiscount: 0, productTitle: product.productTitle } : null // Store offer details without applying discount yet
      ];
    });

    // Calculate subtotal without offer discounts initially
    const subtotal = parseFloat(
      selectedOrder.productInformation.reduce((total, product) => {
        const productTotal = product.unitPrice * product.sku;
        return total + productTotal;
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
    let total = subtotal - promoDiscount + shippingCharge;

    // Add the offer discount after calculating the promo
    productRows.forEach((productRow, index) => {
      const offerDetails = productRow[6];
      if (offerDetails) {
        let offerDiscount = 0;
        const productInfo = selectedOrder.productInformation[index]; // Get the current product's info
        const productTotal = parseFloat((productInfo.unitPrice * productInfo.sku).toFixed(2)); // Recalculate product total

        // Apply offer discount for this product
        if (offerDetails.offerTitle) {
          if (productInfo.offerDiscountType === 'Percentage') {
            offerDiscount = (productTotal * (productInfo.offerDiscountValue / 100)).toFixed(2);
          } else if (productInfo.offerDiscountType === 'Amount') {
            offerDiscount = productInfo.offerDiscountValue.toFixed(2);
          }
          total -= offerDiscount; // Reduce total by the offer discount for this product
        }

        // Update the offer details with the actual discount applied
        offerDetails.offerDiscount = offerDiscount;
      }
    });

    total = total.toFixed(2);

    pdf.autoTable({
      startY: margin + 100,
      head: [['Title', 'Color', 'Size', 'Unit Price', 'QTY', 'Total']],
      body: productRows.map(product => [
        { content: product[0], styles: { halign: 'center' } },   // Title aligned to left
        { content: product[1], styles: { halign: 'center' } },   // Color aligned to left
        { content: product[2], styles: { halign: 'center' } }, // Size aligned to center
        { content: product[3], styles: { halign: 'center' } },  // Unit Price aligned to center
        { content: product[4], styles: { halign: 'center' } },  // QTY aligned to right
        { content: product[5], styles: { halign: 'center' } }    // Total aligned to right
      ]),
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }, // Uniform padding
      },
      headStyles: {
        fontStyle: 'bold',          // Bold text for headers
        halign: 'center',             // Default header alignment to the left (can be overridden by 
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 'auto' },    // Title aligned to left
        1: { halign: 'left', cellWidth: 'auto' },    // Color aligned to left
        2: { halign: 'center', cellWidth: 'auto' },  // Size aligned to center
        3: { halign: 'center', cellWidth: 'auto' },  // Unit Price aligned to center
        4: { halign: 'left', cellWidth: 'auto' },   // QTY aligned to right
        5: { halign: 'left', cellWidth: 'auto' }    // Total aligned to right
      }
    });

    // Now add subtotal, promo discount, and total aligned to the right with extra padding
    pdf.autoTable({
      startY: pdf.lastAutoTable.finalY + 3, // Start just below the previous table
      body: [
        [
          { content: 'Subtotal:', styles: { fillColor: [255, 255, 255] } },
          `BDT ${subtotal.toFixed(2)}`
        ], // Increased padding
        ...(promoDiscount > 0 ? [
          [
            { content: `Promo (${promoCode}):` },
            `BDT -${promoDiscount}`
          ]
        ] : []), // Increased padding
        ...(hasOffers ? productRows.map((product, index) => {
          const offerDetails = product[6];
          if (offerDetails) {
            return [
              { content: `Offer (${offerDetails.offerTitle}) on ${offerDetails.productTitle}:` },
              `BDT -${offerDetails.offerDiscount}`
            ];
          }
        }).filter(Boolean) : []),
        [
          { content: 'Shipping Charge:' },
          `BDT +${shippingCharge.toFixed(2)}`
        ], // Increased padding
        [
          { content: 'Total:', styles: { fontStyle: 'bold' } },
          `BDT ${total}`
        ] // Increased padding
      ],
      theme: 'plain',
      styles: {
        fontSize: 10,
        minCellHeight: 6, // Optional: Adjust row height
      },
      columnStyles: {
        0: { halign: 'right', cellWidth: 'auto', cellPadding: { left: 4 } },  // Align labels to the right, extra padding
        1: { halign: 'right', cellWidth: 40, cellPadding: { left: 8, right: 12 } }
      }
    });

    // Define footer text
    const footerText = "www.fashion-commerce.com | info@fashion-commerce.com | Hotline: 01700000000";

    // Get the width of the text to center it
    const textWidth = pdf.getTextWidth(footerText);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const xCenter = (pdfWidth - textWidth) / 2;

    // Set the Y position for the bottom of the page
    const yBottom = pdf.internal.pageSize.getHeight() - 20; // 20 units from the bottom

    // Add custom slim/thin font (make sure you've included the font in your jsPDF instance)
    // pdf.addFont('path_to_thin_font.ttf', 'SlimFont', 'normal'); // Load the font if required
    pdf.setFont('SlimFont', 'normal'); // Use the custom thin font

    // Set the font size and color
    pdf.setFontSize(10); // Ensure font size is set before adding the text
    pdf.setTextColor(0, 0, 0); // Optional: set the color for the footer text

    // Add the footer text to the PDF
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
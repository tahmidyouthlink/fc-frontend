import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CustomerPrintButton = ({ selectedOrder }) => {

  const handlePrint = async (selectedOrder) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!selectedOrder || !selectedOrder.orderNumber) {
      console.error('Order number is missing or undefined');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.width;

    // Set up fonts and colors
    pdf.setFont('Oxygen', 'normal');
    const primaryColor = [0, 102, 204];
    const secondaryColor = [0, 0, 0];

    // Top Section - Order Details and Company Information
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);

    // Order Details on the left
    const orderDetails = [
      `Customer ID: ${selectedOrder.customerId}`,
      `Order Id: #${selectedOrder.orderNumber}`,
      `Order Date & Time: ${selectedOrder.dateTime}`,
    ].join('\n');
    pdf.text(orderDetails, margin, margin + 10);

    // Company Information on the right
    pdf.text('Fashion Commerce', pageWidth - margin, margin + 10, { align: 'right' });
    pdf.text('Mirpur, Dhaka, 1100', pageWidth - margin, margin + 15, { align: 'right' });
    pdf.text('Email: fashion@commerce.com', pageWidth - margin, margin + 20, { align: 'right' });
    pdf.text('Phone: +88 019 999 99999', pageWidth - margin, margin + 25, { align: 'right' });

    // Customer Info
    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('Customer Details', margin, margin + 45);

    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    const customerDetails = [
      `Name: ${selectedOrder.customerName}`,
      `Email: ${selectedOrder.email}`,
      `Phone: ${selectedOrder.phoneNumber}`,
      selectedOrder.phoneNumber2 && selectedOrder.phoneNumber2 !== '0' ? `Phone 2: ${selectedOrder.phoneNumber2}` : null,
      `Address: ${selectedOrder.address1}${selectedOrder.address2 ? ', ' + selectedOrder.address2 : ''}, ${selectedOrder.city}, ${selectedOrder.postalCode}`,
    ].filter(Boolean).join('\n'); // Filter out any null values
    pdf.text(customerDetails, margin, margin + 50);

    pdf.setFontSize(16);
    pdf.setTextColor(...primaryColor);
    pdf.text('INVOICE', pageWidth / 2, margin + 85, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('Product Details', margin, margin + 95);

    pdf.autoTable({
      startY: margin + 100,
      head: [['Product Title', 'Color', 'Size', 'Unit Price', 'SKU', 'Gross Amount (Tk)']],
      body: selectedOrder.productInformation.map(product => [
        product.productTitle,
        product.color?.label || '',
        product.size || '',
        `${product.unitPrice?.toFixed(2)}`,
        product.sku,
        `${(product.unitPrice * product.sku).toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      styles: { fontSize: 10, valign: 'middle', halign: 'center' },
    });

    const subtotal = parseFloat(selectedOrder.productInformation.reduce((total, product) => total + (product.unitPrice * product.sku), 0).toFixed(2));
    const shippingCharge = parseFloat(selectedOrder.shippingCharge?.toFixed(2) || "0.00");

    // Check if Promo or Offer is applied
    const promoCode = selectedOrder.promoCode;
    const promoDiscountValue = parseFloat(selectedOrder?.promoDiscountValue?.toFixed(2) || "0.00");
    const offerTitle = selectedOrder.offerTitle; // Use offerTitle instead of offerCode
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
    } else if (offerTitle) {
      // Offer Discount
      if (selectedOrder.offerDiscountType === 'Percentage') {
        discountAmount = (subtotal * (offerDiscountValue / 100)).toFixed(2);
      } else if (selectedOrder.offerDiscountType === 'Amount') {
        discountAmount = offerDiscountValue.toFixed(2);
      }
      discountLabel = `Offer Discount (${offerTitle}) :`;
    }

    const total = (subtotal - discountAmount + shippingCharge).toFixed(2);

    pdf.autoTable({
      startY: margin + 100,
      head: [['Product Title', 'Color', 'Size', 'Unit Price', 'SKU', 'Gross Amount (Tk)']],
      body: [
        ...selectedOrder.productInformation.map(product => [
          product.productTitle,
          product.color?.label || '',
          product.size || '',
          `${product.unitPrice?.toFixed(2)}`,
          product.sku,
          `${(product.unitPrice * product.sku).toFixed(2)}`
        ]),
        [{ content: 'Subtotal:', colSpan: 5, styles: { halign: 'right', border: 'none' } }, `${subtotal.toFixed(2)}`],
        ...(discountAmount > 0 ? [[{ content: discountLabel, colSpan: 5, styles: { halign: 'right', border: 'none' } }, `-${discountAmount}`]] : []),
        [{ content: 'Shipping Charge:', colSpan: 5, styles: { halign: 'right', border: 'none' } }, `+${shippingCharge.toFixed(2)}`],
        [{ content: 'Total:', colSpan: 5, styles: { halign: 'right', border: 'none' } }, `${total}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      styles: { fontSize: 10, valign: 'middle', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 'auto' },
        5: { fontStyle: 'bold', halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      }
    });

    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('Additional Details', margin, pdf.autoTable.previous.finalY + 10);

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
      <span className="text-sm font-mono cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => handlePrint(selectedOrder)}>
        {selectedOrder?.orderNumber}
      </span>
    </>
  );
};

export default CustomerPrintButton;
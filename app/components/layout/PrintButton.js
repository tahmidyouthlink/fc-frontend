import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@nextui-org/react';

const PrintButton = ({ selectedOrder }) => {

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

    // Clickable Email and Phone
    pdf.textWithLink('Email: fashion@commerce.com', pageWidth - margin, margin + 20, {
      url: 'mailto:fashion@commerce.com',
      align: 'right',
    });
    pdf.textWithLink('Phone: +88 019 999 99999', pageWidth - margin, margin + 25, {
      url: 'tel:+8801999999999',
      align: 'right',
    });

    // Customer Info
    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('Customer Details', margin, margin + 45);

    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    const customerDetails = [
      `Name: ${selectedOrder.customerName}`,
      `Email: ${selectedOrder.email}`,
      `Address: ${selectedOrder.address1}${selectedOrder.address2 ? ', ' + selectedOrder.address2 : ''}, ${selectedOrder.city}, ${selectedOrder.postalCode}`,
    ].join('\n');
    pdf.text(customerDetails, margin, margin + 50);

    let currentY = margin + 70;

    // Clickable Customer Phone Numbers
    pdf.textWithLink(`Phone: ${selectedOrder.phoneNumber}`, margin, currentY, {
      url: `tel:${selectedOrder.phoneNumber}`,
      align: 'left',
    });

    currentY += 5;

    if (selectedOrder.phoneNumber2 && selectedOrder.phoneNumber2 !== '0') {
      pdf.textWithLink(`Phone 2: ${selectedOrder.phoneNumber2}`, margin, currentY, {
        url: `tel:${selectedOrder.phoneNumber2}`,
        align: 'left',
      });
    }

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
    const promoDiscount = parseFloat(selectedOrder.promoDiscount?.toFixed(2) || "0.00");
    const shippingCharge = parseFloat(selectedOrder.shippingCharge?.toFixed(2) || "0.00");
    const total = (subtotal - promoDiscount + shippingCharge).toFixed(2);

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
        [{ content: `Promo Discount (${selectedOrder.promoCode || ''}) :`, colSpan: 5, styles: { halign: 'right', border: 'none' } }, `-${promoDiscount.toFixed(2)}`],
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
    <Button color="primary"
      onPress={() => handlePrint(selectedOrder)}
    >
      Print Invoice
    </Button>
  );
};

export default PrintButton;
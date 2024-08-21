import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@nextui-org/react';

const PrintButton = ({ selectedOrder }) => {

  // Create custom content using the selectedOrder data
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
    pdf.setFont('helvetica', 'normal');
    const primaryColor = [0, 102, 204]; // Blue color for headings
    const secondaryColor = [0, 0, 0]; // Black color for text

    // Top Section - Order Details and Company Information
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);

    // Order Details on the left
    const orderDetails = [
      `Customer ID: ${selectedOrder._id}`,
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
      `Phone: ${selectedOrder.phoneNumber}${selectedOrder.phoneNumber2 ? `, ${selectedOrder.phoneNumber2}` : ''}`,
      `Address: ${selectedOrder.address1}${selectedOrder.address2 ? ', ' + selectedOrder.address2 : ''}, ${selectedOrder.city}, ${selectedOrder.postalCode}`,
    ].join('\n');
    pdf.text(customerDetails, margin, margin + 50);

    // Clickable Customer Email and Phone
    pdf.textWithLink(`Email: ${selectedOrder.email}`, margin, margin + 65, {
      url: `mailto:${selectedOrder.email}`,
    });
    pdf.textWithLink(`Phone: ${selectedOrder.phoneNumber}`, margin, margin + 70, {
      url: `tel:${selectedOrder.phoneNumber}`,
    });
    if (selectedOrder.phoneNumber2) {
      pdf.textWithLink(`Phone: ${selectedOrder.phoneNumber2}`, margin, margin + 75, {
        url: `tel:${selectedOrder.phoneNumber2}`,
      });
    }

    // Invoice Title - Centered between Customer Details and Product Details
    pdf.setFontSize(16);
    pdf.setTextColor(...primaryColor);
    pdf.text('INVOICE', pageWidth / 2, margin + 85, { align: 'center' });

    // Product Table 
    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('Product Details', margin, margin + 95);

    pdf.autoTable({
      startY: margin + 100,
      head: [['Product Title', 'Color', 'Size', 'Unit Price', 'SKU', 'Gross Amount']],
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

    // Calculate Totals
    const subtotal = parseFloat(selectedOrder.productInformation.reduce((total, product) => total + (product.unitPrice * product.sku), 0).toFixed(2));
    const promoDiscount = parseFloat(selectedOrder.promoDiscount?.toFixed(2) || "0.00");
    const shippingCharge = parseFloat(selectedOrder.shippingCharge?.toFixed(2) || "0.00");
    const total = (subtotal - promoDiscount + shippingCharge).toFixed(2);

    // Totals Section
    const totalsYPosition = pdf.autoTable.previous.finalY + 10;
    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('Order Summary', margin, totalsYPosition);

    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    const orderSummary = [
      `Subtotal: ${subtotal.toFixed(2)}`,
      `Promo Discount (${selectedOrder.promoCode || ''}) : -${promoDiscount.toFixed(2)}`,
      `Shipping Charge: +${shippingCharge.toFixed(2)}`,
      `Total: ${total}`,
    ].join('\n');
    pdf.text(orderSummary, margin, totalsYPosition + 5);

    // Additional Details Section
    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('Additional Details', margin, totalsYPosition + 35);

    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    const additionalDetails = [
      `Shipping Zone: ${selectedOrder.shippingZone}`,
      `Shipping Method: ${selectedOrder.shippingMethod}`,
      `Payment Method: ${selectedOrder.paymentMethod}`,
      `Payment Status: ${selectedOrder.paymentStatus}`,
      `Vendor: ${selectedOrder.vendor}`,
      `Tracking Number: ${selectedOrder.trackingNumber}`,
    ].join('\n');
    pdf.text(additionalDetails, margin, totalsYPosition + 40);

    // Footer Disclaimer
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      'If this invoice is for ongoing services and you have requested us to take payment using the continuous authority credit or debit card details stored on our system, ' +
      'then we will do so and no further action is required.',
      margin, totalsYPosition + 75
    );

    // Save the PDF
    pdf.save(`Fashion_Commerce_Order_${selectedOrder.orderNumber}.pdf`);
  };

  return (
    <Button color="primary" onPress={() => handlePrint(selectedOrder)}>
      Print
    </Button>
  );
};

export default PrintButton;
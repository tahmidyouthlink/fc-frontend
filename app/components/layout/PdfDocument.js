// PdfDocument.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Define your custom fonts if needed
Font.register({
  family: 'Arial',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/arial/v11/Arial.woff' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Arial',
    fontSize: 14,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
  },
  tableHeader: {
    display: 'table-header-group',
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
  },
  tableCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
  },
  tableRow: {
    display: 'table-row',
  },
  tableData: {
    display: 'table-cell',
    textAlign: 'left',
  },
  totalSection: {
    marginBottom: 20,
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    border: '1px solid #000',
  },
});

const PdfDocument = ({ selectedOrder }) => (

  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text>Customer ID: {selectedOrder?._id}</Text>
          <Text>Order Ref: #{selectedOrder?.orderNumber}</Text>
          <Text>Order Date & Time: {selectedOrder?.dateTime}</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text>Company Name</Text>
          <Text>Fashion Commerce</Text>
          <Text>Mirpur, Dhaka, 1100</Text>
          <Text>Email: fashion@commerce.com</Text>
          <Text>Phone: +88 019 999 99999</Text>
        </View>
      </View>

      {/* Customer Details */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Customer Details</Text>
        <Text>Name: {selectedOrder?.customerName}</Text>
        <Text>Email: {selectedOrder?.email}</Text>
        <Text>Phone: {selectedOrder?.phoneNumber}{selectedOrder?.phoneNumber2 ? `, ${selectedOrder?.phoneNumber2}` : ''}</Text>
        <Text>Address: {selectedOrder?.address1}{selectedOrder?.address2 ? `, ${selectedOrder?.address2}` : ''}, {selectedOrder?.city}, {selectedOrder?.postalCode}</Text>
      </View>

      {/* Invoice Title */}
      <Text style={{ textAlign: 'center', fontSize: 24, marginVertical: 20, fontWeight: 'bold' }}>INVOICE</Text>

      {/* Product Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.tableCell}>
            <Text>Product Title</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Color</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Size</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Unit Price</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>SKU</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Gross Amount</Text>
          </View>
        </View>
        {selectedOrder?.productInformation?.map((product, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableData}>
              <Text>{product?.productTitle}</Text>
            </View>
            <View style={styles.tableData}>
              <Text>{product?.color?.label}</Text>
            </View>
            <View style={styles.tableData}>
              <Text>{product?.size}</Text>
            </View>
            <View style={styles.tableData}>
              <Text>৳ {product?.unitPrice?.toFixed(2)}</Text>
            </View>
            <View style={styles.tableData}>
              <Text>{product?.sku}</Text>
            </View>
            <View style={styles.tableData}>
              <Text>৳ {(product?.unitPrice * product?.sku).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totals Section */}
      <View style={styles.totalSection}>
        <Text>Subtotal: ৳ {selectedOrder?.productInformation?.reduce((total, product) => total + (product.unitPrice * product.sku), 0)?.toFixed(2)}</Text>
        <Text>Promo Discount: -৳ {selectedOrder?.promoDiscount?.toFixed(2) || "0.00"} ({selectedOrder?.promoCode || ''})</Text>
        <Text>Shipping Charge: +৳ {selectedOrder?.shippingCharge?.toFixed(2) || "0.00"}</Text>
        <Text style={{ fontWeight: 'bold' }}>Total: ৳ {(
          selectedOrder?.productInformation?.reduce((total, product) => total + (product.unitPrice * product.sku), 0)
          - selectedOrder?.promoDiscount
          + selectedOrder?.shippingCharge
        )?.toFixed(2)}
        </Text>
      </View>

      {/* Additional Details */}
      <View style={styles.section}>
        <Text>Shipping Zone: {selectedOrder?.shippingZone}</Text>
        <Text>Shipping Method: {selectedOrder?.shippingMethod}</Text>
        <Text>Payment Method: {selectedOrder?.paymentMethod}</Text>
        <Text>Payment Status: {selectedOrder?.paymentStatus}</Text>
        <Text>Vendor: {selectedOrder?.vendor}</Text>
        <Text>Tracking Number: {selectedOrder?.trackingNumber}</Text>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text>If this invoice is for ongoing services and you have requested us to take payment using the continuous authority credit or debit card details stored on our system, then we will do so and no further action is required.</Text>
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
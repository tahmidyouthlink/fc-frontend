import React, { useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import sidebarImageBase64 from './sidebarImageBase64';
import JsBarcode from 'jsbarcode';
import { montserratNormal } from './Base64NormalMontserrat';
import { montserratSemibold } from './MontserratSemibold';
import { montserratBold } from './MontserratBold';
import { montserratBlack } from './MontserratBlack';
import { montserratMedium } from './MontserratMedium';
import { lilitaOne } from './LilitaOne';

// Generate Barcode as PNG Data URL
const generateBarcodeData = (order) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, order, {
    format: 'CODE128',
    displayValue: false,        // Set to false if you do not want to display the text
    fontSize: 20,               // Adjust font size for readability, if needed
    width: 2,                   // Thicker lines
    height: 40,                 // Increased height for clarity
    textAlign: 'center',        // Center-align the text
    textMargin: 2,              // Margin between barcode and text
    background: null,           // Make background transparent
    lineColor: '#000000'        // Black lines for maximum contrast
  });
  return canvas.toDataURL('image/png');
};

// Define styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFDE7',
    fontSize: 10,
    flexDirection: 'row', // Row layout to keep sidebar and content side by side
    fontFamily: 'Montserrat',
  },
  sidebar: {
    width: 108,
    height: '100%',
    backgroundColor: '#3bc9a7',
  },
  contentContainer: {
    flex: 1,
    padding: 40, // Add padding for the content area only
  },
  header: {
    fontSize: 30,
    textAlign: 'left',
    color: '#E74C3A',
    marginTop: 25,
    marginBottom: 10,
    fontWeight: 900,
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderInfo2: {
    marginTop: 10,
    fontWeight: 700
  },
  orderInfo3: {
    marginTop: 10,
    width: "100%",
    letterSpacing: 1,
    fontWeight: 500
  },
  barcode: {
    display: 'flex',
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: -5,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  subTable: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  subtotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "50%",
    marginBottom: 10,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  discount: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "50%",
    marginBottom: 10,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "50%",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
    borderCollapse: 'collapse', // For a clean layout
    height: 250,
    letterSpacing: 1,
    fontWeight: 500,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 4,
    paddingVertical: 4,
    width: "100%",
    color: '#00B8AC',
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "Lilita One"
  },
  tableRaw: {
    marginVertical: 10,
    marginBottom: 10,
  },
  border: {
    borderBottom: '2px solid #000000', // Subtle border for header
    marginBottom: 20,
  },
  tableCellLeft: {
    textAlign: 'left',  // Left-align for text-based cells
    paddingHorizontal: 4,
    flex: 1,
  },
  tableCellRight: {
    textAlign: 'right',  // Right-align for numeric cells
    paddingHorizontal: 4,
    flex: 1,
  },
  tableCellCenter: {
    textAlign: 'center', // Center alignment for specific cells
    paddingHorizontal: 4,
    flex: 1,
  },
  footerAlign: {
    display: 'flex',
    flexDirection: 'row',         // Arrange the details and "THANK YOU" in a row
    justifyContent: 'space-between', // Space between the two sections
    alignItems: 'flex-start',      // Align items at the top
    paddingTop: 40,
    letterSpacing: 1,
  },
  footerDetails: {
    display: 'flex',
    flexDirection: 'column',    // Stack the footer details vertically
    justifyContent: 'flex-start', // Align the details at the top
    fontWeight: 500
  },
  footer: {
    color: '#00B8AC',
    fontSize: 30,
    letterSpacing: 1,
    fontWeight: 400,
    fontFamily: "Lilita One"
  }
});

const PDFDocument = ({ order }) => {

  useEffect(() => {
    // Register the Montserrat font
    Font.register({
      family: 'Montserrat',
      fonts: [
        {
          src: montserratNormal,
          fontWeight: 400
        },
        {
          src: montserratMedium,
          fontWeight: 500
        },
        {
          src: montserratSemibold,
          fontWeight: 600
        },
        {
          src: montserratBold,
          fontWeight: 700
        },
        {
          src: montserratBlack,
          fontWeight: 900
        },
      ],
    });

    // Register Lilita One font family
    Font.register({
      family: 'Lilita One',
      fonts: [
        {
          src: lilitaOne, // Adjust the path to the font file
          fontWeight: 400,  // Assuming only one weight
        },
      ],
    });
  }, []);

  const barcodeDataUrl = React.useMemo(() => generateBarcodeData(order?.orderNumber), [order?.orderNumber]);

  if (!order) {
    console.error("Order data is missing");
    return null;
  }

  // Check if any product has an offer
  const hasOffers = order?.productInformation.some(product => product.offerTitle);

  // Prepare the product rows without applying discount at this point
  const productRows = order?.productInformation.map(product => {
    const productTotal = (
      product?.offerInfo ? (Number(product?.regularPrice) || 0) : product?.finalPrice * product?.sku).toFixed(2);    // Original price without discount

    return [
      product.productTitle,   // Title
      product.color?.label || '',  // Color
      product.size || '',         // Size
      `${product?.offerInfo ? product?.regularPrice : product?.finalPrice}`, // Unit Price
      product.sku,                // QTY
      `${productTotal}`,       // Total (without discount)
      product.offerTitle ? { offerTitle: product.offerTitle, offerDiscount: 0, productTitle: product.productTitle } : null // Store offer details without applying discount yet
    ];
  });

  // Calculate subtotal without offer discounts initially
  const subtotal = parseFloat(
    order.productInformation.reduce((total, product) => {
      const productTotal = product.unitPrice * product.sku;
      return total + productTotal;
    }, 0).toFixed(2)
  );

  // Apply promo discount based on subtotal
  const promoCode = order.promoCode;
  const promoDiscountValue = parseFloat(order.promoDiscountValue || 0);
  let promoDiscount = 0;

  if (promoCode) {
    if (order.promoDiscountType === 'Percentage') {
      promoDiscount = (subtotal * (promoDiscountValue / 100)).toFixed(2);
    } else if (order.promoDiscountType === 'Amount') {
      promoDiscount = promoDiscountValue.toFixed(2);
    }
  }

  const shippingCharge = parseFloat(order.shippingCharge || 0);
  let total = subtotal - promoDiscount + shippingCharge;

  // Add the offer discount after calculating the promo
  productRows.forEach((productRow, index) => {
    const offerDetails = productRow[6];
    if (offerDetails) {
      let offerDiscount = 0;
      const productInfo = order.productInformation[index]; // Get the current product's info
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

  return (
    <Document>
      <Page style={styles.page}>
        {/* Sidebar Image */}
        <View style={styles.sidebar}>
          <Image src={sidebarImageBase64} style={{ width: '100%', height: '100%' }} alt="pdf-image" />
        </View>

        {/* Main content with padding */}
        <View style={styles.contentContainer}>
          <Text style={styles.header}>FASHION COMMERCE</Text>

          <View style={styles.orderInfo}>
            {/* Order Information */}
            <View style={styles.orderInfo2}>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase' }}>#{order?.orderNumber}</Text>
              <View style={styles.barcode}>
                <Image src={barcodeDataUrl} style={{ width: 180, height: 65 }} alt="Barcode" />
              </View>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase', fontSize: 14, marginBottom: 5 }}>
                {order?.customerInfo?.customerName}
              </Text>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase', width: "70%", marginBottom: 5 }}>
                {`${order?.deliveryInfo?.address1}${order?.deliveryInfo?.address2 ? ' ' + order?.deliveryInfo?.address2 : ' '} ${order?.deliveryInfo?.city} ${order?.deliveryInfo?.postalCode}`}
              </Text>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase' }}>
                {order?.customerInfo?.phoneNumber}
              </Text>
              {order?.customerInfo?.phoneNumber2 && order?.customerInfo?.phoneNumber2 !== "0" && (
                <Text style={{ letterSpacing: 4, textTransform: 'uppercase' }}>
                  {order?.customerInfo?.phoneNumber2}
                </Text>
              )}
            </View>
            <View style={styles.orderInfo3}>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>{order?.dateTime}</Text>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>Shipping Method : {order?.deliveryInfo?.deliveryMethod}</Text>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>Payment Method : {order?.paymentInfo?.paymentMethod}</Text>
              <Text style={{ textAlign: "right" }}>Payment Status : {order?.paymentInfo?.paymentStatus}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellLeft}>TITLE</Text>
              <Text style={styles.tableCellCenter}>VARIANT</Text>
              <Text style={styles.tableCellCenter}>PRICE</Text>
              <Text style={styles.tableCellCenter}>QTY</Text>
              <Text style={styles.tableCellRight}>TOTAL</Text>
            </View>

            <View style={styles.tableRaw}>
              {productRows.map((product, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.tableCellLeft}>{product[0]}</Text>
                  <Text style={styles.tableCellCenter}>{product[1]} - {product[2]}</Text>
                  <Text style={styles.tableCellCenter}>{product[3]}</Text>
                  <Text style={styles.tableCellCenter}>{product[4]}</Text>
                  <Text style={styles.tableCellRight}>{product[5]}</Text>
                </View>
              ))}
            </View>

          </View>

          <View style={styles.border}></View>

          <View style={styles.subTable}>
            {/* Subtotal, Promo Discount, Offer Discount, Shipping Charge, and Total */}
            <View style={styles.subtotal}>
              <Text style={{ color: "#E74C3A", fontWeight: 400, fontFamily: "Lilita One" }}>Subtotal</Text>
              <Text style={{ fontWeight: 500 }}>{subtotal.toFixed(2)}</Text>
            </View>

            {promoDiscount > 0 && (
              <View style={styles.discount}>
                <Text style={{
                  color: "#E74C3A", fontWeight: 400, fontFamily: "Lilita One", flexWrap: 'wrap',
                  width: '70%',
                  marginBottom: 2,
                }}>{`Promo (${promoCode})`}</Text>
                <Text style={{ fontWeight: 500 }}>-{promoDiscount}</Text>
              </View>
            )}

            {hasOffers &&
              productRows.map((product, index) => {
                const offerDetails = product[6];
                if (offerDetails) {
                  return (
                    <View key={index} style={styles.discount}>
                      <Text style={{
                        color: "#E74C3A", fontWeight: 400, fontFamily: "Lilita One", flexWrap: 'wrap',
                        width: '70%',
                        marginBottom: 2,
                      }}>{`Offer (${offerDetails.offerTitle}) on ${offerDetails.productTitle}`}</Text>
                      <Text style={{ fontWeight: 500 }}>-{offerDetails.offerDiscount}</Text>
                    </View>
                  );
                }
              })}

            <View style={styles.subtotal}>
              <Text style={{ color: "#E74C3A", fontWeight: 400, fontFamily: "Lilita One" }}>Shipping</Text>
              <Text style={{ fontWeight: 500 }}>+{shippingCharge.toFixed(2)}</Text>
            </View>

            <View style={styles.total}>
              <Text style={{ color: "#E74C3A", fontWeight: 400, fontFamily: "Lilita One" }}>Total</Text>
              <Text style={{ fontWeight: 500 }}>{total}</Text>
            </View>

          </View>

          {/* Footer */}
          <View style={styles.footerAlign}>
            <View style={styles.footerDetails}>
              <Text>Fashion Commerce</Text>
              <Text>Mirpur, Dhaka, 1100</Text>
              <Text>Email: fashion@commerce.com</Text>
              <Text>Phone: +88 019 999 99999</Text>
              <Text>www.fashioncommerce.com</Text>
            </View>
            <View>
              <Text style={styles.footer}>THANK YOU</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  )
};

export default PDFDocument;
// components/PDFDocument.js
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import sidebarImageBase64 from './sidebarImageBase64';
import JsBarcode from 'jsbarcode';
import { montserratNormal } from './Base64NormalMontserrat';
import { montserratSemibold } from './MontserratSemibold';
import { montserratBold } from './MontserratBold';
import { montserratBlack } from './MontserratBlack';
import { montserratMedium } from './MontserratMedium';

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
    marginTop: 30,
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
    marginBottom: 10,
    fontWeight: 700
  },
  orderInfo3: {
    marginTop: 40,
    width: "100%",
    letterSpacing: 1,
    fontWeight: 500
  },
  barcode: {
    display: 'flex',
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: -5,
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
  subtotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 60,
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 600
  },
  discount: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 58,
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 600
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 60,
    fontWeight: 'bold',
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 600
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
    borderCollapse: 'collapse', // For a clean layout
    height: 250,
    letterSpacing: 1,
    fontWeight: 600
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 4,
    paddingVertical: 4,
    width: "100%",
    color: '#00B8AC',
    fontSize: 11,
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
    paddingTop: 65,
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
    fontWeight: 900
  }
});

const PDFDocument = ({ order }) => {

  // Check if any product has an offer
  const hasOffers = order.productInformation.some(product => product.offerTitle);

  // Prepare the product rows without applying discount at this point
  const productRows = order.productInformation.map(product => {
    const productTotal = (product.unitPrice * product.sku).toFixed(2); // Original price without discount

    return [
      product.productTitle,   // Title
      product.color?.label || '',  // Color
      product.size || '',         // Size
      `${product.unitPrice}`, // Unit Price
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

  const barcodeDataUrl = generateBarcodeData(order?.orderNumber);

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
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase', marginBottom: 5 }}>#{order.orderNumber}</Text>
              <Text style={{ letterSpacing: 5, textTransform: 'uppercase', fontSize: 16, marginBottom: 5 }}>
                {order.customerName}
              </Text>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase', width: "40%", marginBottom: 5 }}>
                {`${order.address1}${order.address2 ? ' ' + order.address2 : ' '} ${order.city} ${order.postalCode}`}
              </Text>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase' }}>
                {order?.phoneNumber}
              </Text>
              {order?.phoneNumber2 && order.phoneNumber2 !== "0" && (
                <Text style={{ letterSpacing: 4, textTransform: 'uppercase' }}>
                  {order.phoneNumber2}
                </Text>
              )}

            </View>
            <View style={styles.orderInfo3}>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>{order?.dateTime}</Text>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>Shipping Method : {order?.shippingMethod}</Text>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>Payment Method : {order?.paymentMethod}</Text>
              <Text style={{ textAlign: "right" }}>Payment Status : {order?.paymentStatus}</Text>
              <View style={styles.barcode}>
                <Image src={barcodeDataUrl} style={{ width: 180, height: 60 }} alt="Barcode" />
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellLeft}>TITLE</Text>    {/* Left-aligned */}
              <Text style={styles.tableCellCenter}>VARIANT</Text>  {/* Left-aligned */}
              <Text style={styles.tableCellCenter}>PRICE</Text>   {/* Right-aligned */}
              <Text style={styles.tableCellCenter}>QTY</Text>     {/* Right-aligned */}
              <Text style={styles.tableCellRight}>TOTAL</Text>   {/* Right-aligned */}
            </View>

            <View style={styles.tableRaw}>
              {productRows.map((product, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.tableCellLeft}>{product[0]}</Text> {/* TITLE */}
                  <Text style={styles.tableCellCenter}>{product[1]} - {product[2]}</Text> {/* VARIANT */}
                  <Text style={styles.tableCellCenter}>{product[3]}</Text> {/* PRICE */}
                  <Text style={styles.tableCellCenter}>{product[4]}</Text> {/* QTY */}
                  <Text style={styles.tableCellRight}>{product[5]}</Text> {/* TOTAL */}
                </View>
              ))}
            </View>

          </View>

          <View style={styles.border}></View>

          {/* Subtotal, Promo Discount, Offer Discount, Shipping Charge, and Total */}
          <View style={styles.subtotal}>
            <Text style={{ color: "#E74C3A" }}>Subtotal</Text>
            <Text>{subtotal.toFixed(2)}</Text>
          </View>

          {promoDiscount > 0 && (
            <View style={styles.discount}>
              <Text style={{ color: "#E74C3A" }}>{`Promo (${promoCode})`}</Text>
              <Text>-{promoDiscount}</Text>
            </View>
          )}

          {hasOffers &&
            productRows.map((product, index) => {
              const offerDetails = product[6];
              if (offerDetails) {
                return (
                  <View key={index} style={styles.discount}>
                    <Text style={{ color: "#E74C3A" }}>{`Offer (${offerDetails.offerTitle}) on ${offerDetails.productTitle}`}</Text>
                    <Text>-{offerDetails.offerDiscount}</Text>
                  </View>
                );
              }
            })}

          <View style={styles.subtotal}>
            <Text style={{ color: "#E74C3A" }}>Shipping</Text>
            <Text>+{shippingCharge.toFixed(2)}</Text>
          </View>

          <View style={styles.total}>
            <Text style={{ color: "#E74C3A" }}>Total</Text>
            <Text>{total}</Text>
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
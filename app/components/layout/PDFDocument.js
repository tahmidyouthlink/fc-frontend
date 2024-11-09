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

// Define styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFDE7',
    fontSize: 10,
    flexDirection: 'row', // Row layout to keep sidebar and content side by side
  },
  sidebar: {
    width: 100,
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
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderInfo2: {
    marginTop: 20,
    marginBottom: 10,
  },
  orderInfo3: {
    marginTop: 10,
    width: "100%"
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productList: {
    marginVertical: 10,
  },
  productRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    color: '#00B8AC',
  },
  subtotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  discount: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 20,
    borderCollapse: 'collapse', // For a clean layout
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    width: "100%",
    color: '#00B8AC',
  },
  tableCell: {
    textAlign: 'center', // Center-align the text
    flex: 1,
  },
  tableCell2: {
    textAlign: 'right', // Center-align the text
    flex: 1,
  },
  tableRaw: {
    marginVertical: 10,
    marginBottom: 10,
  },
  border: {
    borderBottom: '2px solid #000000', // Subtle border for header
    marginBottom: 10,
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
              <Text style={{ letterSpacing: 6, textTransform: 'uppercase', fontSize: 14, marginBottom: 5 }}>
                {order.customerName}
              </Text>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase', width: "50%", marginBottom: 5 }}>
                {`${order.address1}${order.address2 ? ' ' + order.address2 : ' '} ${order.city} ${order.postalCode}`}
              </Text>
              <Text style={{ letterSpacing: 4, textTransform: 'uppercase' }}>
                {order?.phoneNumber}
              </Text>

            </View>
            <View style={styles.orderInfo3}>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>{order?.dateTime}</Text>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>Shipping Method : {order?.shippingMethod}</Text>
              <Text style={{ textAlign: "right", marginBottom: 3 }}>Payment Method : {order?.paymentMethod}</Text>
              <Text style={{ textAlign: "right" }}>Payment Status : {order?.paymentStatus}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text>TITLE</Text>
              <Text style={styles.tableCell2}>VARIANT</Text>
              <Text style={styles.tableCell}>PRICE</Text>
              <Text style={styles.tableCell}>QTY</Text>
              <Text>TOTAL</Text>
            </View>

            <View style={styles.tableRaw}>
              {productRows.map((product, index) => (
                <View key={index} style={styles.row}>
                  <Text>{product[0]}</Text>
                  <Text style={styles.tableCell2}>{product[1]} - {product[2]}</Text>
                  <Text style={styles.tableCell}>{product[3]}</Text>
                  <Text style={styles.tableCell}>{product[4]}</Text>
                  <Text>{product[5]}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.border}></View>

          {/* Subtotal, Promo Discount, Offer Discount, Shipping Charge, and Total */}
          <View style={styles.subtotal}>
            <Text style={{ color: "#E74C3A" }}>Subtotal:</Text>
            <Text>{subtotal.toFixed(2)}</Text>
          </View>

          {promoDiscount > 0 && (
            <View style={styles.discount}>
              <Text style={{ color: "#E74C3A" }}>{`Promo (${promoCode}):`}</Text>
              <Text>-{promoDiscount}</Text>
            </View>
          )}

          {hasOffers &&
            productRows.map((product, index) => {
              const offerDetails = product[6];
              if (offerDetails) {
                return (
                  <View key={index} style={styles.discount}>
                    <Text style={{ color: "#E74C3A" }}>{`Offer (${offerDetails.offerTitle}) on ${offerDetails.productTitle}:`}</Text>
                    <Text>-{offerDetails.offerDiscount}</Text>
                  </View>
                );
              }
            })}

          <View style={styles.subtotal}>
            <Text style={{ color: "#E74C3A" }}>Shipping Charge:</Text>
            <Text>+{shippingCharge.toFixed(2)}</Text>
          </View>

          <View style={styles.total}>
            <Text style={{ color: "#E74C3A" }}>Total:</Text>
            <Text>{total}</Text>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>THANK YOU</Text>
        </View>
      </Page>
    </Document>
  )
};

export default PDFDocument;
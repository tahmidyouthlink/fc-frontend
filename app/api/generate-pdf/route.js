import puppeteer from 'puppeteer';

export async function POST(req) {
  try {
    const { selectedOrder } = await req.json();

    if (!selectedOrder) {
      return new Response('No order data provided', { status: 400 });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Generate the HTML content for the PDF
    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { text-align: center; }
          .content { margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          table, th, td { border: 1px solid black; }
          th, td { padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Invoice</h1>
          <p>Customer ID: ${selectedOrder.customerId}</p>
          <p>Order ID: #${selectedOrder.orderNumber}</p>
        </div>
        <div class="content">
          <h2>Order Details</h2>
          <p>Order Date & Time: ${selectedOrder.dateTime}</p>
          <h2>Customer Details</h2>
          <p>Name: ${selectedOrder.customerName}</p>
          <p>Email: ${selectedOrder.email}</p>
          <p>Phone: ${selectedOrder.phoneNumber}</p>
          <p>Address: ${selectedOrder.address1}${selectedOrder.address2 ? ', ' + selectedOrder.address2 : ''}, ${selectedOrder.city}, ${selectedOrder.postalCode}</p>
          <h2>Product Details</h2>
          <table>
            <thead>
              <tr>
                <th>Product Title</th>
                <th>Color</th>
                <th>Size</th>
                <th>Unit Price</th>
                <th>SKU</th>
                <th>Gross Amount (Tk)</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrder.productInformation.map(product => `
                <tr>
                  <td>${product.productTitle}</td>
                  <td>${product.color?.label || ''}</td>
                  <td>${product.size || ''}</td>
                  <td>${product.unitPrice?.toFixed(2)}</td>
                  <td>${product.sku}</td>
                  <td>${(product.unitPrice * product.sku).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <h2>Summary</h2>
          <p>Subtotal: ${parseFloat(selectedOrder.productInformation.reduce((total, product) => total + (product.unitPrice * product.sku), 0).toFixed(2))}</p>
          <p>Shipping Charge: ${parseFloat(selectedOrder.shippingCharge?.toFixed(2) || "0.00")}</p>
          ${selectedOrder.promoCode ? `<p>Promo Discount: ${parseFloat(selectedOrder.promoDiscountValue?.toFixed(2) || "0.00")}</p>` : ''}
          ${selectedOrder.offerCode ? `<p>Offer Discount: ${parseFloat(selectedOrder.offerDiscountValue?.toFixed(2) || "0.00")}</p>` : ''}
          <p>Total: ${((parseFloat(selectedOrder.productInformation.reduce((total, product) => total + (product.unitPrice * product.sku), 0).toFixed(2)) - (selectedOrder.promoDiscountValue || 0) + (selectedOrder.shippingCharge || 0)).toFixed(2))}</p>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice.pdf"',
      },
    });
  } catch (error) {
    return new Response('Error generating PDF', { status: 500 });
  }
}

export const placeSteadfastOrder = async (order) => {
  try {
    const payload = {
      invoice: order?.orderNumber,
      recipient_name: order?.customerInfo?.customerName,
      recipient_phone: order?.customerInfo?.phoneNumber,
      recipient_address: `${order?.deliveryInfo?.address1 || ""}, ${order?.deliveryInfo?.address2 || ""}, ${order?.deliveryInfo?.city || ""}, ${order?.deliveryInfo?.postalCode || ""}`,
      cod_amount: order?.totalAmount || 0, // this needs to be change
      note: order?.noteToSeller?.note || "Handle with care",
    };

    const response = await fetch("https://portal.packzy.com/api/v1/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.NEXT_PUBLIC_STEADFAST_API_ID,
        "Secret-Key": process.env.NEXT_PUBLIC_STEADFAST_SECRET_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data?.status === 200 && data?.consignment?.tracking_code) {
      return data?.consignment?.tracking_code;
    } else {
      throw new Error(data?.message || "Failed to place Steadfast order.");
    }
  } catch (err) {
    console.error("Steadfast API Error:", err);
    throw err;
  }
};
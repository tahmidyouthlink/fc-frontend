export default function getTodaysLastOrderNumber(orderIds) {
  // Get today's date in the format YYMMDD (e.g., 240804)
  const today = new Date();
  const year = String(today.getFullYear()).slice(2); // Last 2 digits of the year
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month (2 digits)
  const day = String(today.getDate()).padStart(2, "0"); // Day (2 digits)
  const todayPrefix = `${year}${month}${day}`;

  // Filter order IDs for today's orders
  const todaysOrders = orderIds.filter((orderId) =>
    orderId.startsWith(todayPrefix),
  );

  // Extract the order numbers (7th and 8th digits) and find the max
  const lastOrderNumber = Math.max(
    0, // Include 0 to handle cases where no matching orders exist
    ...todaysOrders.map((orderId) => parseInt(orderId.slice(6, 8), 10)),
  );

  return lastOrderNumber;
}

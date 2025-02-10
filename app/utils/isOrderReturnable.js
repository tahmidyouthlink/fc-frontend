export default function isOrderReturnable(orderStatus, dateTime) {
  if (orderStatus !== "Delivered" || !dateTime) return false;

  const [datePart, timePart] = dateTime.split(" | ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const orderDate = new Date(year + 2000, month - 1, day, hour, minute);
  const currentDate = new Date();

  const differenceInMilliseconds = currentDate - orderDate;
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return differenceInDays <= 7;
}

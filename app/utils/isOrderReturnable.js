export default function isOrderReturnable(orderStatus, deliveryDateStr) {
  if (orderStatus !== "Delivered" || !deliveryDateStr) return false;

  const deliveryDate = new Date(deliveryDateStr);
  const currentDate = new Date();

  const differenceInMilliseconds = currentDate - deliveryDate;
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return differenceInDays <= 7;
}

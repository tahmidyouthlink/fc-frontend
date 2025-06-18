import axios from "axios";
import CheckoutContents from "@/app/components/checkout/CheckoutContents";

export default async function Checkout() {
  let productList,
    specialOffers,
    shippingZones,
    primaryLocation,
    allOrderIds,
    allCustomerIds,
    legalPolicyPdfLinks,
    promos;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allProducts`,
    );
    productList = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (checkout/products):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allOffers`,
    );
    specialOffers = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (checkout/specialOffers):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allShippingZones`,
    );
    shippingZones = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (checkout/shippingZones):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allLocations`,
    );

    const locations = response.data || [];
    primaryLocation = locations?.find(
      (location) => location?.isPrimaryLocation == true,
    )?.locationName;
  } catch (error) {
    console.error(
      "Fetch error (checkout/locations):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allOrders`,
    );

    const orders = response.data || [];
    allOrderIds = orders?.map((order) => order.orderNumber);
  } catch (error) {
    console.error(
      "Fetch error (checkout/orders):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allCustomerDetails`,
    );

    const customers = response.data || [];
    allCustomerIds = customers?.map(
      (customer) => customer.userInfo?.customerId,
    );
  } catch (error) {
    console.error(
      "Fetch error (checkout/customers):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/get-all-policy-pdfs`,
    );
    legalPolicyPdfLinks = response.data[0] || {};
  } catch (error) {
    console.error(
      "Fetch error (checkout/legalPolicyPdfLinks):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allPromoCodes`,
    );
    promos = response.data || {};
  } catch (error) {
    console.error(
      "Fetch error (checkout/promos):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  return (
    <CheckoutContents
      productList={productList}
      specialOffers={specialOffers}
      shippingZones={shippingZones}
      primaryLocation={primaryLocation}
      allOrderIds={allOrderIds}
      allCustomerIds={allCustomerIds}
      legalPolicyPdfLinks={legalPolicyPdfLinks}
      promos={promos}
    />
  );
}

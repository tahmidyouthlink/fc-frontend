import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import CheckoutContents from "@/app/components/checkout/CheckoutContents";

export default async function Checkout() {
  let productList,
    specialOffers,
    shippingZones,
    primaryLocation,
    legalPolicyPdfLinks;

  try {
    const result = await rawFetch("/allProducts");
    productList = result.data || [];
  } catch (error) {
    console.error("FetchError (checkout/products):", error.message);
  }

  try {
    const result = await rawFetch("/allOffers");
    specialOffers = result.data || [];
  } catch (error) {
    console.error("FetchError (checkout/specialOffers):", error.message);
  }

  try {
    const result = await rawFetch("/allShippingZones");
    shippingZones = result.data || [];
  } catch (error) {
    console.error("FetchError (checkout/shippingZones):", error.message);
  }

  try {
    const result = await rawFetch("/primary-location");
    primaryLocation = result.data?.primaryLocation || null;
  } catch (error) {
    console.error("FetchError (checkout/primaryLocation):", error.message);
  }

  try {
    const result = await rawFetch("/get-all-policy-pdfs");
    [legalPolicyPdfLinks] = result.data || [];
  } catch (error) {
    console.error("FetchError (checkout/legalPdfLinks):", error.message);
  }

  return (
    <CheckoutContents
      productList={productList}
      specialOffers={specialOffers}
      shippingZones={shippingZones}
      primaryLocation={primaryLocation}
      legalPolicyPdfLinks={legalPolicyPdfLinks}
    />
  );
}

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import EmptyOrderHistory from "@/app/components/order/history/EmptyOrderHistory";
import OrderHistory from "@/app/components/order/history/OrderHistory";

export default async function Orders() {
  const session = await getServerSession(authOptions);

  let userOrders, legalPolicyPdfLinks;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allOrders`,
    );

    const orders = response.data || [];
    userOrders = orders?.filter(
      (order) => order?.customerInfo?.email === session?.user?.email,
    );
  } catch (error) {
    console.error(
      "Fetch error (orderHistory/orders):",
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
      "Fetch error (orderHistory/legalPolicyPdfLinks):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  if (!userOrders?.length) return <EmptyOrderHistory />;
  else
    return (
      <OrderHistory
        orders={userOrders}
        legalPolicyPdfLinks={legalPolicyPdfLinks}
      />
    );
}

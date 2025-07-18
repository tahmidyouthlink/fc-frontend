import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import EmptyOrderHistory from "@/app/components/order/history/EmptyOrderHistory";
import OrderHistory from "@/app/components/order/history/OrderHistory";

export default async function Orders() {
  const session = await getServerSession(authOptions);

  let userOrders, legalPolicyPdfLinks;

  if (session?.user?.email) {
    try {
      const result = await tokenizedFetch(
        `/customer-orders?email=${session?.user?.email}`,
      );

      userOrders = result.data || [];
    } catch (error) {
      console.error("FetchError (orderHistory/userOrders):", error.message);
    }
  }

  try {
    const result = await rawFetch("/get-all-policy-pdfs");
    [legalPolicyPdfLinks] = result.data || [];
  } catch (error) {
    console.error("FetchError (orderHistory/legalPdfLinks):", error.message);
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

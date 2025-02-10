"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useOrders from "@/app/hooks/useOrders";
import EmptyOrderHistory from "@/app/components/order/history/EmptyOrderHistory";
import OrderHistory from "@/app/components/order/history/OrderHistory";

export default function Orders() {
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [orderList, isOrderListLoading, orderRefetch] = useOrders();

  const userOrders = orderList?.filter(
    (order) => order?.customerInfo?.email === user?.email,
  );

  useEffect(() => {
    setIsPageLoading(isOrderListLoading || !orderList?.length);

    return () => setIsPageLoading(false);
  }, [isOrderListLoading, orderList]);

  return (
    <>
      {!userOrders?.length ? (
        <EmptyOrderHistory />
      ) : (
        <OrderHistory orders={userOrders} />
      )}
    </>
  );
}

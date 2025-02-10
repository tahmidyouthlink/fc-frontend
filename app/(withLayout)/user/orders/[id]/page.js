"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useOrders from "@/app/hooks/useOrders";
import TransitionLink from "@/app/components/ui/TransitionLink";
import OrderDetailsHeader from "@/app/components/order/details/OrderDetailsHeader";
import OrderCustomerDetails from "@/app/components/order/details/OrderCustomerDetails";
import OrderShipmentDetails from "@/app/components/order/details/OrderShippingDetails";
import OrderDeliveryDetails from "@/app/components/order/details/OrderDeliveryDetails";
import OrderItems from "@/app/components/order/details/OrderItems";
import OrderItemsInfo from "@/app/components/order/details/OrderItemsInfo";
import OrderInvoiceButton from "@/app/components/order/details/OrderInvoiceButton";

export default function ProductDetails({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [orderList, isOrderListLoading, orderRefetch] = useOrders();

  const order = orderList?.find(
    (order) =>
      order?.orderNumber === params.id.toUpperCase() &&
      order?.customerInfo?.email === user?.email,
  );

  useEffect(() => {
    setIsPageLoading(isOrderListLoading || !orderList?.length);

    return () => setIsPageLoading(false);
  }, [isOrderListLoading, orderList, setIsPageLoading]);

  useEffect(() => {
    if (!!orderList?.length && !order) router.push("/user/orders");
  }, [orderList, order, router]);

  return (
    <section className="grow auto-rows-max rounded-xl bg-white p-3.5 shadow-[2px_2px_20px_0_rgba(0,0,0,0.075)] xl:p-5">
      {/* Go Back Button */}
      <TransitionLink
        href="/user/orders"
        className="mb-5 flex h-fit w-fit items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-[color] duration-300 ease-in-out hover:text-neutral-700"
      >
        <HiArrowNarrowLeft className="size-[18px]" />
        Go back
      </TransitionLink>
      <OrderDetailsHeader order={order} />
      <div className="max-xl:space-y-4 xl:grid xl:grid-cols-2 xl:gap-4">
        <div>
          <OrderCustomerDetails customer={order?.customerInfo} />
          <OrderShipmentDetails
            shipment={order?.shipmentInfo}
            isDeliveryDone={!!order?.deliveryInfo?.deliveredAt}
          />
          <OrderDeliveryDetails delivery={order?.deliveryInfo} />
        </div>
        <div className="bottom-5 top-5 h-fit w-full rounded-md border-2 border-neutral-200 p-3.5 font-semibold xl:p-5">
          <div className="relative flex w-full flex-col">
            <OrderItems orderItems={order?.productInformation} />
            <div className="space-y-4 bg-white text-[13px] max-lg:order-last md:text-sm">
              <hr className="h-0.5 w-full bg-neutral-100" />
              <OrderItemsInfo
                totalSpecialOfferDiscount={order?.totalSpecialOfferDiscount}
                promoInfo={order?.promoInfo}
                subtotal={order?.subtotal}
                shippingCharge={order?.shippingCharge}
                total={order?.total}
              />
              <OrderInvoiceButton selectedOrder={order} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

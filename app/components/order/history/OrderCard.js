import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { LuFileText, LuTruck } from "react-icons/lu";
import { IoReturnDownBack } from "react-icons/io5";
import getOrderStatusWithColor from "@/app/utils/getOrderStatusColor";
import formatOrderDateTime from "@/app/utils/formatOrderDateTime";
import isOrderReturnable from "@/app/utils/isOrderReturnable";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function OrderCard({
  order,
  setValue,
  setIsTrackModalOpen,
  setActiveTrackOrder,
  setIsReturnModalOpen,
  setActiveReturnOrder,
}) {
  const orderStatus = getOrderStatusWithColor(order?.orderStatus);
  const {
    orderMonthFirstThreeLetters,
    orderMonthRestOfLetters,
    orderDayAndYear,
    orderTime,
  } = formatOrderDateTime(order?.dateTime);
  const isOrderTrackable =
    orderStatus?.text == "Processing" ||
    orderStatus?.text == "Confirmed" ||
    orderStatus?.text == "On Its Way" ||
    orderStatus?.text == "On Hold";

  return (
    <div className="h-fit w-full rounded-md border-2 border-neutral-300 p-3.5 text-sm xl:p-5">
      <div className="mb-4 items-start justify-between gap-2 max-sm:space-y-2 sm:flex">
        <h2 className="text-sm font-semibold md:text-base">
          Order #{order?.orderNumber}
        </h2>
        {orderStatus?.text !== "Request Declined" ? (
          <div
            className={`w-fit cursor-default text-nowrap rounded-md px-2 py-1.5 text-xs font-semibold max-sm:ml-auto ${orderStatus?.bgColor} ${orderStatus?.textColor}`}
          >
            {orderStatus?.text}
          </div>
        ) : (
          <Popover
            classNames={{
              content: [
                "p-3.5 max-w-[65dvw] sm:max-w-48 lg:max-w-60 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)] text-[13px]",
              ],
            }}
            placement="bottom-end"
          >
            <PopoverTrigger
              className={`w-fit cursor-pointer text-nowrap rounded-md px-2 py-1.5 text-xs font-semibold max-sm:ml-auto ${orderStatus?.bgColor} ${orderStatus?.textColor}`}
            >
              {orderStatus?.text}
            </PopoverTrigger>
            <PopoverContent>
              <p>{order?.declinedReason}</p>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="space-y-2 [&>div]:flex [&>div]:justify-between [&>div]:gap-4 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold sm:[&_h4]:text-nowrap">
        <div>
          <h4>Date & Time</h4>
          <p className="text-right">
            {orderMonthFirstThreeLetters}
            <span className="max-sm:hidden">{orderMonthRestOfLetters}</span>
            {" " + orderDayAndYear}, {orderTime}
          </p>
        </div>
        <div>
          <h4>Payment Method</h4>
          <p className="text-right">{order?.paymentInfo?.paymentMethod}</p>
        </div>
        <div>
          <h4>Paid Amount</h4>
          <p className="text-right">৳ {order?.total?.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2.5">
        <TransitionLink
          href={`/user/orders/${order?.orderNumber?.toLowerCase()}`}
          className="flex items-center gap-2 rounded-lg bg-[#ffddc2] px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#fbcfb0] max-sm:w-full max-sm:justify-center"
        >
          View Details
          <LuFileText size={14} />
        </TransitionLink>
        {isOrderTrackable && (
          <button
            className="flex items-center gap-2 rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] max-sm:w-full max-sm:justify-center"
            onClick={() => {
              setActiveTrackOrder(order);
              setIsTrackModalOpen(true);
            }}
          >
            Track Order
            <LuTruck size={14} />
          </button>
        )}
        {isOrderReturnable(
          order?.orderStatus,
          order?.deliveryInfo?.deliveredAt,
        ) &&
          orderStatus?.text !== "Return Requested" && (
            <button
              className="flex items-center gap-2 rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] max-sm:w-full max-sm:justify-center"
              onClick={() => {
                setValue(
                  "items",
                  Array.from(order?.productInformation, () => ({
                    isRequested: false,
                    quantity: 0,
                  })),
                );

                setActiveReturnOrder(order);
                setIsReturnModalOpen(true);
              }}
            >
              Return Order
              <IoReturnDownBack size={14} />
            </button>
          )}
      </div>
    </div>
  );
}

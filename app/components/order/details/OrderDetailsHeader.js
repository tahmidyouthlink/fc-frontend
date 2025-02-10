import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import getOrderStatusWithColor from "@/app/utils/getOrderStatusColor";
import formatOrderDateTime from "@/app/utils/formatOrderDateTime";

export default function OrderDetailsHeader({ order }) {
  const orderStatus = getOrderStatusWithColor(order?.orderStatus);
  const {
    orderMonthFirstThreeLetters,
    orderMonthRestOfLetters,
    orderDayAndYear,
    orderTime,
  } = formatOrderDateTime(order?.dateTime);

  return (
    <div className="mb-7 items-start justify-between gap-2 max-sm:space-y-2 sm:flex">
      <div>
        <h1 className="mb-1 text-lg font-bold md:text-xl">
          Order #{order?.orderNumber}
        </h1>
        <p className="text-xs lg:text-[13px]">
          {orderMonthFirstThreeLetters}
          <span className="max-sm:hidden">{orderMonthRestOfLetters}</span>
          {" " + orderDayAndYear}, {orderTime}
        </p>
      </div>
      {orderStatus?.text !== "Request Declined" ? (
        <div
          className={`h-fit w-fit cursor-default text-nowrap rounded-md px-3 py-2 text-xs font-semibold max-sm:ml-auto ${orderStatus?.bgColor} ${orderStatus?.textColor}`}
        >
          {orderStatus?.text}
        </div>
      ) : (
        <Popover
          classNames={{
            content: [
              "p-3.5 max-w-[80dvw] sm:max-w-60 lg:max-w-80 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)] text-sm",
            ],
          }}
          placement="bottom-end"
        >
          <PopoverTrigger
            className={`h-fit w-fit cursor-pointer text-nowrap rounded-md px-3 py-2 text-xs font-semibold max-sm:ml-auto ${orderStatus?.bgColor} ${orderStatus?.textColor}`}
          >
            {orderStatus?.text}
          </PopoverTrigger>
          <PopoverContent>
            <p>{order?.declinedReason}</p>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

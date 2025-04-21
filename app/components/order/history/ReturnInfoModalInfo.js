import formatOrderDateTime from "@/app/utils/formatOrderDateTime";

export default function ReturnInfoModalInfo({
  orderStatus,
  returnInfo,
  declinedReason,
}) {
  const {
    orderMonthFirstThreeLetters,
    orderMonthRestOfLetters,
    orderDayAndYear,
    orderTime,
  } = formatOrderDateTime(returnInfo?.dateTime);

  return (
    <>
      <h2 className="text-sm font-semibold uppercase md:text-[15px]/[1]">
        Return Information
      </h2>
      <div className="space-y-3 rounded-md border-2 border-neutral-200 p-3 text-sm sm:px-5 sm:py-4 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold [&_h4]:text-neutral-600 sm:[&_h4]:text-nowrap">
        <div>
          <h4>Return Requested at</h4>
          <p className="text-right">
            {orderMonthFirstThreeLetters}
            <span className="max-sm:hidden">{orderMonthRestOfLetters}</span>
            {" " + orderDayAndYear}, {orderTime}
          </p>
        </div>
        <div>
          <h4>Return Status</h4>
          <p className="text-right">{orderStatus}</p>
        </div>
        <div>
          <h4>
            {orderStatus === "Refunded" ? "Refunded" : "Expected Refund"} Amount
          </h4>
          <p className="text-right">
            ৳ {returnInfo?.refundAmount?.toLocaleString()}
          </p>
        </div>
        <div>
          <h4>Provided Reason</h4>
          <p className="text-right">
            {!returnInfo?.description
              ? `${returnInfo?.reason} (${returnInfo?.issue})`
              : `"${returnInfo?.description}"`}
          </p>
        </div>
        {declinedReason && (
          <div>
            <h4>Reason of Decline</h4>
            <p className="text-right">{declinedReason}</p>
          </div>
        )}
      </div>
    </>
  );
}

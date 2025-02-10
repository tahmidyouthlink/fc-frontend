export default function OrderCustomerDetails({ customer }) {
  return (
    <div className="mb-4 h-fit w-full rounded-md border-2 border-neutral-200 p-3.5 text-sm xl:p-5">
      <h2 className="mb-3 text-sm font-semibold md:text-base">
        Customer Details
      </h2>
      <div className="space-y-1 [&>div]:flex [&>div]:justify-between [&>div]:gap-3 sm:[&>div]:gap-10 xl:[&>div]:gap-20 [&_h4]:font-semibold sm:[&_h4]:text-nowrap">
        <div>
          <h4>Name</h4>
          <p className="text-right">{customer?.customerName}</p>
        </div>
        <div>
          <h4>Email Address</h4>
          <p className="flex flex-wrap justify-end text-right max-sm:flex-col">
            <span>{customer?.email.split("@")[0]}</span>@
            {customer?.email.split("@")[1]}
          </p>
        </div>
        <div>
          <h4>Phone Number</h4>
          <p className="text-right">{customer?.phoneNumber}</p>
        </div>
        {!!customer?.phoneNumber2 && (
          <div>
            <h4>Alt. Phone Number</h4>
            <p className="text-right">{customer?.phoneNumber2}</p>
          </div>
        )}
      </div>
    </div>
  );
}

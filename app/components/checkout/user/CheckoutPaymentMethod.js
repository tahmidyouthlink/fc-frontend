export default function CheckoutPaymentMethod({ register, errors }) {
  const paymentMethods = [
    {
      id: "cards",
      value: "visacard,mastercard,amexcard,othercard",
      imgUrl: "/payment-methods/cards.webp",
    },
    {
      id: "mobile-bank",
      value: "mobilebank",
      imgUrl: "/payment-methods/mobile-banking.webp",
    },
    {
      id: "internet-bank",
      value: "internetbank",
      imgUrl: "/payment-methods/internet-banking.webp",
    },
  ];

  return (
    <section className="w-full space-y-4 rounded-md border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <h2 className="text-base font-semibold md:text-lg">
        Select Payment Method
      </h2>
      <div className="payment-methods relative grid gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
        {paymentMethods.map((paymentMethod, index) => (
          <input
            key={paymentMethod.id}
            type="radio"
            {...register("paymentMethod", {
              required: {
                value: true,
                message: "Select one of the payment methods.",
              },
            })}
            id={paymentMethod.id}
            value={paymentMethod.value}
            className={
              index === paymentMethods.length - 1
                ? "lg:col-span-2"
                : "lg:col-span-1"
            }
            style={{
              "--img-url": `url('${paymentMethod.imgUrl}')`,
            }}
            required
          />
        ))}
      </div>
      {errors.paymentMethod && (
        <p className="text-xs font-semibold text-red-500">
          {errors.paymentMethod?.message}
        </p>
      )}
    </section>
  );
}

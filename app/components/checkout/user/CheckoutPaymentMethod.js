export default function CheckoutPaymentMethod({
  register,
  errors,
  isPromoCodeValid,
}) {
  const paymentMethods = [
    {
      id: "mobile-bank",
      value: "mobilebank",
      imgUrl: "/payment-methods/sslcz-mobile-banking.webp",
    },
    {
      id: "cards",
      value: "visacard,mastercard,amexcard,othercard",
      imgUrl: "/payment-methods/sslcz-cards.webp",
    },
    {
      id: "internet-bank",
      value: "internetbank",
      imgUrl: "/payment-methods/sslcz-internet-banking.webp",
    },
  ];

  return (
    <section
      className="w-full space-y-4 rounded-md border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl"
      style={{
        paddingBottom: !isPromoCodeValid ? "20px" : "52px",
      }}
    >
      <h2 className="text-base font-semibold transition-[padding-bottom] duration-300 ease-in-out md:text-lg">
        Select Payment Method
      </h2>
      <div className="payment-methods relative grid gap-2.5">
        {paymentMethods.map((paymentMethod) => (
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

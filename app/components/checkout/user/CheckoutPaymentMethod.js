export default function CheckoutPaymentMethod({
  register,
  errors,
  isPromoCodeValid,
}) {
  const isBkashCashbackAvailable = true;

  return (
    <section
      className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl"
      style={{
        paddingBottom: !isPromoCodeValid ? "20px" : "52px",
      }}
    >
      <h2 className="text-base font-semibold transition-[padding-bottom] duration-300 ease-in-out md:text-lg">
        Select Payment Method
      </h2>
      <div className="payment-methods relative grid gap-2.5 sm:grid-cols-2">
        <div>
          <input
            className={
              isBkashCashbackAvailable
                ? "before:bg-[url('/payment-methods/bkash-cashback-10.webp')]"
                : "before:bg-[url('/payment-methods/bkash.webp')]"
            }
            type="radio"
            {...register("paymentMethod", {
              required: {
                value: true,
                message: "Select one of the payment methods.",
              },
            })}
            id="bkash"
            value="bkash"
            required
            disabled={isBkashCashbackAvailable && isPromoCodeValid}
          />
        </div>
        <input
          className="before:bg-[url('/payment-methods/mobile-banking.webp')]"
          type="radio"
          {...register("paymentMethod", {
            required: {
              value: true,
              message: "Select one of the payment methods.",
            },
          })}
          id="mobile-banking"
          value="mobile-banking"
          required
        />
        <input
          className="before:bg-[url('/payment-methods/cards.webp')]"
          type="radio"
          {...register("paymentMethod", {
            required: {
              value: true,
              message: "Select one of the payment methods.",
            },
          })}
          id="debit-credit-card"
          value="debit-credit-card"
          required
        />
        <input
          className="before:bg-[url('/payment-methods/online-banking.webp')]"
          type="radio"
          {...register("paymentMethod", {
            required: {
              value: true,
              message: "Select one of the payment methods.",
            },
          })}
          id="online-banking"
          value="online-banking"
          required
        />
        {isBkashCashbackAvailable && (
          <p
            className={`pointer-events-none absolute left-0 text-xs transition-[transform,opacity] sm:text-[13px] ${!isPromoCodeValid ? "scale-0 opacity-0" : "scale-100 opacity-100"} ${errors.paymentMethod ? "-bottom-[60px]" : "-bottom-7"}`}
          >
            Note: bKash is not applicable when promo code is applied.
          </p>
        )}
      </div>
      {errors.paymentMethod && (
        <p className="text-xs font-semibold text-red-500">
          {errors.paymentMethod?.message}
        </p>
      )}
    </section>
  );
}

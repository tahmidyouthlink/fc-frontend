"use client";

export default function OrderTracking() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[url('/delivery-partners/order-tracking.webp'),_linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))] bg-cover bg-center bg-no-repeat px-5 bg-blend-overlay sm:px-8 lg:px-12 xl:mx-auto xl:px-0">
      <div className="max-w-[500px] text-center">
        <h1 className="text-3xl font-bold uppercase text-neutral-50 sm:text-4xl">
          Track Your Order
        </h1>
        <p className="mt-1.5 text-neutral-200">
          Enter the tracking code given in your invoice to track your parcel.
        </p>
        <form
          className="mt-9 gap-1.5 max-sm:space-y-2 sm:flex"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            name="promoCode"
            type="text"
            className="h-10 w-full rounded-lg border-2 border-neutral-50/20 bg-white/20 px-3 text-xs text-neutral-50 outline-none backdrop-blur-2xl transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-300 focus:border-white/50 md:text-sm"
            placeholder="Enter your tracking code"
            autoComplete="off"
          />
          <button className="block w-full self-end text-nowrap rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] sm:w-fit">
            Track Order
          </button>
        </form>
      </div>
    </main>
  );
}

export default function OutOfStockBanner() {
  return (
    <p className="pointer-events-none absolute left-0 right-0 top-1/2 w-full -translate-y-1/2 bg-neutral-600 bg-opacity-25 py-2.5 text-center font-semibold text-white backdrop-blur-md">
      Out of Stock
    </p>
  );
}

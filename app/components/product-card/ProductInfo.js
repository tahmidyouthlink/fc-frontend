export default function ProductInfo({ product, calculateFinalPrice }) {
  return (
    <>
      <div className="flex gap-x-3 [&_p]:w-fit [&_p]:bg-white">
        <p
          className={`relative w-fit text-base font-semibold xl:text-lg ${!!Number(product.discountValue) ? "text-neutral-400 before:absolute before:left-0 before:right-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-neutral-400 before:content-['']" : "text-neutral-800"}`}
        >
          ৳ {Number(product.regularPrice).toLocaleString()}
        </p>
        {!!Number(product.discountValue) && (
          <p className="text-base font-semibold text-neutral-800 xl:text-lg">
            ৳ {Number(calculateFinalPrice(product)).toLocaleString()}
          </p>
        )}
      </div>
      <h3 className="line-clamp-1 w-fit bg-white text-base font-semibold text-neutral-800 xl:text-lg">
        {product.productTitle}
      </h3>
      <p className="mt-1.5 line-clamp-1 w-fit bg-white text-xs text-neutral-700 xl:text-sm">
        {product.category}
      </p>
    </>
  );
}

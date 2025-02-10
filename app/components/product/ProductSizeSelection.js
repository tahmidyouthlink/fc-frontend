export default function ProductSizeSelection({
  productSizes,
  selectedOptions,
  setSelectedOptions,
}) {
  return (
    <div className="mb-3.5 flex items-center gap-x-2.5">
      <h4 className="font-semibold text-neutral-600">Sizes:</h4>
      <div className="flex flex-wrap gap-x-1.5">
        {productSizes?.map((size) => {
          return (
            <span
              key={"product-size-" + size}
              className={`h-9 w-12 cursor-pointer content-center rounded-lg text-center text-sm font-semibold text-neutral-500 transition-[background-color] duration-300 ease-in-out ${selectedOptions?.size === size ? "bg-[#F4D3BA] text-neutral-700" : "bg-neutral-100 hover:bg-[#FBEDE2]"}`}
              onClick={() =>
                setSelectedOptions((prevOptions) => ({
                  ...prevOptions,
                  size: size,
                  quantity: 1,
                }))
              }
            >
              {size}
            </span>
          );
        })}
      </div>
    </div>
  );
}

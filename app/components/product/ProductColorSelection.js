export default function ProductColorSelection({
  productColors,
  selectedOptions,
  setSelectedOptions,
  setActiveImageIndex,
  setNumOfTimesThumbnailsMoved,
}) {
  return (
    <div className="mb-3.5 flex items-center gap-x-2.5">
      <h4 className="font-semibold text-neutral-600">Colors:</h4>
      <div className="flex flex-wrap gap-x-1.5">
        {productColors?.map((color) => {
          return (
            <div
              key={"product-color-" + color._id}
              className={`grid size-8 cursor-pointer place-items-center rounded-full border-2 transition-[border-color] duration-300 ease-in-out hover:border-[#b96826] ${selectedOptions?.color._id === color._id ? "border-[#b96826]" : "border-transparent"}`}
              onClick={() => {
                setActiveImageIndex(0);
                setNumOfTimesThumbnailsMoved(0);
                setSelectedOptions((prevOptions) => ({
                  ...prevOptions,
                  color: color,
                  quantity: 1,
                }));
              }}
            >
              <div
                className="size-[22px] rounded-full ring-1 ring-neutral-300"
                style={{
                  backgroundColor: color.color,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

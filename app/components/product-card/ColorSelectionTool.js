export default function ColorSelectionTool({ productTitle, productColors }) {
  const changeActiveColorAndImage = (event, colorIndex) => {
    const selectedColorElement = event.currentTarget,
      colorElements = selectedColorElement.parentElement.children,
      imageContainerElements =
        selectedColorElement.parentElement.parentElement.parentElement.querySelectorAll(
          ".img-container",
        );

    Object.values(colorElements).forEach(
      (colorElement) => (colorElement.style.borderColor = "transparent"),
    );

    selectedColorElement.style.borderColor = "#c18d6c";

    Object.values(imageContainerElements).forEach((imageElement) => {
      imageElement.style.opacity = "0";
      imageElement.style.pointerEvents = "none";
    });

    Object.values(imageContainerElements)[colorIndex].style.opacity = "1";
    Object.values(imageContainerElements)[colorIndex].style.pointerEvents =
      "auto";
  };

  return (
    <div
      id="color-select"
      className="absolute left-1/2 top-[250px] flex w-full -translate-x-1/2 -translate-y-2/3 items-center gap-x-1.5 rounded-b-[20px] border border-[#F0F0F0] bg-white bg-opacity-75 px-4 py-3 opacity-0 transition-[transform,opacity] duration-300 ease-in-out sm:top-[320px] sm:gap-x-2.5 lg:top-[26vh]"
    >
      <h5 className="text-[13px] font-semibold text-neutral-600">
        <span className="max-sm:hidden">Available </span>Colors:
      </h5>
      <div className="flex items-center justify-center sm:gap-x-1">
        {productColors.map((color, colorIndex) => {
          return (
            <div
              key={productTitle + color._id}
              className="grid size-[26px] cursor-pointer place-items-center rounded-full border-3 transition-[border-color] duration-300 ease-in-out hover:border-[#c18d6c]"
              style={{
                borderColor: colorIndex === 0 ? "#c18d6c" : "transparent",
              }}
              onClick={(event) => changeActiveColorAndImage(event, colorIndex)}
            >
              <div
                className={`size-4 rounded-full ring-1 ${color.label === "White" ? "ring-neutral-200" : "ring-transparent"}`}
                style={{
                  background:
                    color.label !== "Multicolor"
                      ? color.color
                      : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
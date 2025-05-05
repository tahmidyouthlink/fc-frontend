import Image from "next/image";
import { HiCheckCircle } from "react-icons/hi2";

export default function addToCartToast(
  defaultToast,
  productImg,
  productTitle,
  variantSize,
  variantColor,
) {
  if (document == undefined) return null;

  const headerHeight = document.querySelector("#header")?.offsetHeight;

  if (!headerHeight) return null;

  const offset = headerHeight - window.scrollY;
  const isHeaderOutOfViewport = offset < 0;
  const marginTopVal = isHeaderOutOfViewport ? 0 : offset;

  return (
    <div
      ref={(el) => {
        if (el) {
          requestAnimationFrame(() => {
            el.style.transform = `translateY(${defaultToast.visible ? "0px" : "-24px"})`;
            el.style.opacity = defaultToast.visible ? "1" : "0";
          });
        }
      }}
      className="z-[99] min-w-60 -translate-y-6 rounded-lg bg-white p-2.5 opacity-0 shadow-[4px_4px_16px_0_rgba(0,0,0,0.15)] transition-[opacity,transform] duration-400 ease-out"
      style={{
        marginTop: `${marginTopVal}px`,
      }}
    >
      {/* Confirmation of Addition to Cart */}
      <div className="flex items-center gap-1.5">
        <HiCheckCircle className="size-5 text-green-500" />
        <p className="text-[15px]/[1] font-semibold text-neutral-600">
          Item added to cart
        </p>
      </div>
      {/* Divider */}
      <hr className="my-2.5 h-0.5 w-full bg-neutral-100" />
      {/* Cart Item Information */}
      <div className="flex w-fit items-stretch justify-between gap-x-2.5">
        {/* Cart Item Image */}
        <div className="relative min-h-full grow overflow-hidden rounded-md bg-[#F0F0F0] max-sm:w-16 sm:aspect-[1.1/1] sm:h-[52px]">
          <Image
            className="h-full w-full object-contain"
            src={productImg}
            alt={productTitle}
            fill
            sizes="15vh"
          />
        </div>
        <div className="space-y-1.5 font-semibold text-neutral-400 [&_:is(h4,h5,p)]:text-nowrap">
          {/* Cart Item Title */}
          <h4 className="text-sm/[1] text-neutral-500">{productTitle}</h4>
          {/* Cart Item Size */}
          <div className="flex gap-x-1.5 text-[11px]/[1] sm:text-xs/[1]">
            <h5>Size:</h5>
            <span>{variantSize}</span>
          </div>
          {/* Cart Item Color */}
          <div className="flex gap-x-1.5 text-[11px]/[1] sm:text-xs/[1]">
            <h5>Color:</h5>
            <div className="flex items-center gap-x-1">
              <div
                style={{
                  background:
                    variantColor?.label !== "Multicolor"
                      ? variantColor?.color
                      : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
                }}
                className="size-2.5 rounded-full ring-1 ring-neutral-300"
              />
              {variantColor?.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

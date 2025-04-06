import Image from "next/image";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import ProductInfoOverview from "./ProductInfoOverview";
import ProductInfoDetails from "./ProductInfoDetails";
import ProductInfoFooter from "./ProductInfoFooter";

export default function ProductInfo({
  product,
  specialOffers,
  primaryLocation,
  selectedOptions,
  setSelectedOptions,
  setActiveImageIndex,
  setNumOfTimesThumbnailsMoved,
  hasSpecialOffer,
  specialOffer,
}) {
  const splitSizeFitIntoColumns = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const items = Array.from(doc.querySelectorAll("li")).map(
      (li) => li.outerHTML,
    );
    const midIndex = Math.ceil(items.length / 2);

    return `
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="space-y-1.5">${items.slice(0, midIndex).join("")}</div>
        <div class="space-y-1.5">${items.slice(midIndex).join("")}</div>
      </div>
    `;
  };

  return (
    <div className="relative mt-4 flex flex-col xl:mt-0 xl:h-[calc(100dvh-(var(--header-height-lg)+var(--section-padding-double)))] xl:grow">
      {/* Shape/SVG (circle with star) */}
      <div className="absolute -right-16 top-10 z-[-1] aspect-square w-52 translate-x-1/2 opacity-85 sm:-right-10 sm:max-md:w-64 lg:-right-20 min-[1200px]:hidden">
        <Image
          src={circleWithStarShape}
          alt="circle with star shape"
          className="object-contain"
          height={0}
          width={0}
          sizes="25vw"
        />
      </div>
      {/* Overview Section */}
      <ProductInfoOverview
        product={product}
        specialOffers={specialOffers}
        primaryLocation={primaryLocation}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        setActiveImageIndex={setActiveImageIndex}
        setNumOfTimesThumbnailsMoved={setNumOfTimesThumbnailsMoved}
        hasSpecialOffer={hasSpecialOffer}
        specialOffer={specialOffer}
      />
      {/* Divider */}
      <hr className="mt-7 h-0.5 bg-neutral-100 sm:max-md:mb-4 xl:mb-4" />
      {/* Details Section */}
      <ProductInfoDetails
        productInfoDetails={{
          productDetails: product?.productDetails,
          sizeFit: product?.sizeFit
            ? splitSizeFitIntoColumns(product.sizeFit)
            : null,
          materialCare: product?.materialCare,
        }}
      />
      {/* Divider */}
      <hr className="mb-3 mt-auto h-0.5 bg-neutral-100" />
      {/* Product Info Footer */}
      <ProductInfoFooter
        productId={product?.productId}
        productTitle={product?.productTitle}
      />
    </div>
  );
}

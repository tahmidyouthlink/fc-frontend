import Image from "next/image";
import curvedDottedLineShape from "@/public/shapes/curved-dotted-line-narrow.svg";
import ProductMainImage from "./ProductMainImage";
import ProductThumbnailImages from "./ProductThumbnailImages";

export default function ProductImageGallery({
  productTitle,
  activeImageSet,
  activeImageUrl,
  selectedColorLabel,
  activeImageIndex,
  setActiveImageIndex,
  setIsImageExpanded,
  numOfTimesThumbnailsMoved,
  setNumOfTimesThumbnailsMoved,
  isTrending,
  isNewArrival,
  hasDiscount,
  discount,
  hasSpecialOffer,
  specialOffer,
}) {
  return (
    <section className="relative flex flex-col gap-2 sm:max-md:flex-row xl:sticky xl:top-[14px] xl:h-[calc(100dvh-112px-14px)]">
      {/* Shape (curved dotted line) */}
      <div className="absolute -bottom-16 right-0 z-[-1] aspect-[3.5/1] w-[1150px] opacity-50 sm:-bottom-28 sm:w-[1050px] md:w-[1100px] lg:w-[1200px]">
        <Image
          src={curvedDottedLineShape}
          alt="Curved dotted line shape"
          className="object-contain"
          height={0}
          width={0}
          sizes="25vw"
        />
      </div>
      <ProductMainImage
        productTitle={productTitle}
        selectedColorLabel={selectedColorLabel}
        activeImageIndex={activeImageIndex}
        setIsImageExpanded={setIsImageExpanded}
        activeImageUrl={activeImageUrl}
        isTrending={isTrending}
        isNewArrival={isNewArrival}
        hasDiscount={hasDiscount}
        discount={discount}
        hasSpecialOffer={hasSpecialOffer}
        specialOffer={specialOffer}
      />
      {/* Image Thumbnails Section (Horizontal) - for mobile devices */}
      <ProductThumbnailImages
        placementOfThumbnails="horizontal"
        isMobileOnly={true}
        productTitle={productTitle}
        selectedColorLabel={selectedColorLabel}
        activeImageSet={activeImageSet}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        numOfTimesThumbnailsMoved={numOfTimesThumbnailsMoved}
        setNumOfTimesThumbnailsMoved={setNumOfTimesThumbnailsMoved}
      />
      {/* Image Thumbnails Section (Vertical) - for small tablet devices */}
      <ProductThumbnailImages
        placementOfThumbnails="vertical"
        isMobileOnly={false}
        productTitle={productTitle}
        selectedColorLabel={selectedColorLabel}
        activeImageSet={activeImageSet}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        numOfTimesThumbnailsMoved={numOfTimesThumbnailsMoved}
        setNumOfTimesThumbnailsMoved={setNumOfTimesThumbnailsMoved}
      />
      {/* Image Thumbnails Section (Horizontal) - for large tablet and desktop devices */}
      <ProductThumbnailImages
        placementOfThumbnails="horizontal"
        isMobileOnly={false}
        productTitle={productTitle}
        selectedColorLabel={selectedColorLabel}
        activeImageSet={activeImageSet}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        numOfTimesThumbnailsMoved={numOfTimesThumbnailsMoved}
        setNumOfTimesThumbnailsMoved={setNumOfTimesThumbnailsMoved}
      />
    </section>
  );
}

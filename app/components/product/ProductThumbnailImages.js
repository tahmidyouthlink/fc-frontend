import Image from "next/image";
import { Button } from "@nextui-org/react";
import {
  CgChevronDown,
  CgChevronLeft,
  CgChevronRight,
  CgChevronUp,
} from "react-icons/cg";

export default function ProductThumbnailImages({
  placementOfThumbnails,
  isMobileOnly,
  productTitle,
  selectedColorLabel,
  activeImageSet,
  activeImageIndex,
  setActiveImageIndex,
  numOfTimesThumbnailsMoved,
  setNumOfTimesThumbnailsMoved,
}) {
  const MAX_NUM_OF_THUMBNAILS_VISIBLE_AT_A_TIME = 4;
  const maxNumOfTimesThumbnailsAllowedToMove =
    activeImageSet?.images?.length - MAX_NUM_OF_THUMBNAILS_VISIBLE_AT_A_TIME;

  return (
    <div
      className={`relative ${isMobileOnly ? "sm:hidden" : placementOfThumbnails === "horizontal" ? "max-md:hidden md:w-80 lg:w-[424px]" : "hidden h-[35vh] sm:max-md:block"}`}
    >
      {/* Thumbnail Images */}
      <div
        className={`relative flex w-full gap-2 ${placementOfThumbnails === "vertical" ? "h-full flex-col sm:overflow-hidden" : "max-sm:overflow-x-auto md:overflow-hidden"}`}
      >
        {activeImageSet?.images?.length &&
          activeImageSet?.images?.map((imageURL, imageURLIndex) => {
            return (
              /* Thumbnail Image Wrapper */
              <div
                key={imageURL + "-thumbnail-" + imageURLIndex}
                className={`relative shrink-0 cursor-pointer overflow-hidden rounded-md bg-[#F0F0F0] transition-[border-color,transform] duration-300 ease-in-out ${placementOfThumbnails === "vertical" ? "aspect-[1/1.1] xl:h-32" : "aspect-[1/1.2] md:h-32"} ${activeImageIndex === imageURLIndex ? "border-2 border-[#b96826]" : ""}`}
                onClick={() => setActiveImageIndex(imageURLIndex)}
                style={{
                  [placementOfThumbnails === "vertical" ? "height" : "width"]:
                    `calc(
                      (100% - 8px * 3) / 4
                    )`,
                  transform: `${placementOfThumbnails === "vertical" ? "translateY" : "translateX"}(
                    calc((100% + 8px) * ${numOfTimesThumbnailsMoved} * -1)
                  )`,
                }}
              >
                {/* Thumbnail Image */}
                {!!imageURL && (
                  <Image
                    src={imageURL}
                    alt={`${productTitle} ${selectedColorLabel} Thumbnail ${imageURLIndex + 1}`}
                    className="h-full w-full object-cover transition-[transform] duration-300 ease-in-out"
                    sizes="50vw"
                    fill
                  />
                )}
              </div>
            );
          })}
      </div>
      {/* Thumbnail Nav Buttons */}
      {activeImageSet?.images?.length >
        MAX_NUM_OF_THUMBNAILS_VISIBLE_AT_A_TIME && (
        <>
          {/* Previous Nav Button */}
          <Button
            className={`absolute size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] [&>svg]:mx-auto ${placementOfThumbnails === "vertical" ? "left-1/2 top-0 -translate-x-1/2 translate-y-2" : "top-1/2 -translate-x-2 -translate-y-1/2 max-sm:hidden md:block md:-translate-x-1/2"} ${numOfTimesThumbnailsMoved === 0 ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
            isIconOnly
            disableRipple
            startContent={
              placementOfThumbnails === "vertical" ? (
                <CgChevronUp />
              ) : (
                <CgChevronLeft />
              )
            }
            onClick={() =>
              setNumOfTimesThumbnailsMoved((prevNumber) => prevNumber - 1)
            }
          ></Button>
          {/* Next Nav Button */}
          <Button
            className={`absolute size-10 rounded-md bg-white p-0 text-xl shadow-[0_0_12px_0_rgba(0,0,0,0.15)] transition-[background-color,opacity] duration-300 ease-in-out hover:bg-[#FBEDE2] [&>svg]:mx-auto ${placementOfThumbnails === "vertical" ? "bottom-0 left-1/2 -translate-x-1/2 -translate-y-2" : "right-0 top-1/2 -translate-y-1/2 translate-x-2 max-sm:hidden md:translate-x-1/2"} ${numOfTimesThumbnailsMoved === maxNumOfTimesThumbnailsAllowedToMove ? "pointer-events-none !opacity-0" : "pointer-events-auto !opacity-100"}`}
            isIconOnly
            disableRipple
            startContent={
              placementOfThumbnails === "vertical" ? (
                <CgChevronDown />
              ) : (
                <CgChevronRight />
              )
            }
            onClick={() =>
              setNumOfTimesThumbnailsMoved((prevNumber) => prevNumber + 1)
            }
          ></Button>
        </>
      )}
    </div>
  );
}

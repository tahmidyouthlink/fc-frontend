import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CgArrowLeft,
  CgArrowRight,
  CgClose,
  CgMathPlus,
  CgMathMinus,
} from "react-icons/cg";

const zoomScales = [100, 125, 150, 175, 200]; // 100-200%

export default function ExpandedImagesModal({
  modalFor,
  productTitle,
  selectedColorLabel,
  expandedImgUrl,
  totalImages,
  activeImageIndex,
  setActiveImageIndex,
  isImageExpanded,
  setIsImageExpanded,
}) {
  const [zoomLevel, setZoomLevel] = useState(0); // 0-4 zoom levels

  const handleZoomIn = () => {
    if (zoomLevel < 4) {
      setZoomLevel(zoomLevel + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  };

  useEffect(() => {
    if (modalFor === "products") {
      document.body.style.overflow = isImageExpanded ? "hidden" : "unset";
    }

    // Reset zoom when modal opens/closes or image changes
    if (!isImageExpanded) {
      setZoomLevel(0);
    }
  }, [isImageExpanded, modalFor]);

  // Reset zoom when switching images
  useEffect(() => {
    setZoomLevel(0);
  }, [activeImageIndex]);

  return (
    <div
      className={`fixed inset-0 z-[6] flex h-dvh w-dvw items-center justify-center bg-black bg-opacity-80 text-neutral-300 backdrop-blur ${isImageExpanded ? "" : "hidden"}`}
      id="expanded-img-bg"
      onClick={(event) =>
        event.target.id === "expanded-img-bg" && setIsImageExpanded(false)
      }
    >
      {/* Text that displays the number of current active image */}
      <p className="absolute left-5 top-5 text-sm">
        {activeImageIndex + 1}/{totalImages}
      </p>
      {/* Modal Close Button */}
      <CgClose
        className="absolute right-5 top-5 cursor-pointer transition-[color] duration-300 ease-in-out hover:text-white"
        size={24}
        onClick={() => setIsImageExpanded(false)}
      />
      {/* Zoom Controls - Only on mobile and tablet */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 xl:hidden">
        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel === 0}
          className={`flex size-10 items-center justify-center rounded-[4px] bg-neutral-800 bg-opacity-50 backdrop-blur transition-opacity duration-300 ${
            zoomLevel === 0 ? "pointer-events-none opacity-30" : ""
          }`}
        >
          <CgMathMinus size={20} />
        </button>
        {/* Zoom Level Indicator */}
        <div className="flex h-10 items-center justify-center rounded-[4px] bg-neutral-800 bg-opacity-50 px-4 backdrop-blur">
          <span className="text-sm font-medium">{zoomScales[zoomLevel]}%</span>
        </div>
        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel === 4}
          className={`flex size-10 items-center justify-center rounded-[4px] bg-neutral-800 bg-opacity-50 backdrop-blur transition-opacity duration-300 ${
            zoomLevel === 4 ? "pointer-events-none opacity-30" : ""
          }`}
        >
          <CgMathPlus size={20} />
        </button>
      </div>
      {/* Left Nav Button */}
      <CgArrowLeft
        className={`absolute left-2.5 top-1/2 size-5 -translate-y-1/2 cursor-pointer transition-[opacity,color] duration-300 ease-in-out sm:left-5 sm:size-6 ${activeImageIndex === 0 ? "pointer-events-none opacity-0" : "pointer-events-auto hover:text-white hover:opacity-100"}`}
        onClick={() => setActiveImageIndex(activeImageIndex - 1)}
      />
      {/* Right Nav Button */}
      <CgArrowRight
        className={`absolute right-2.5 top-1/2 size-5 -translate-y-1/2 cursor-pointer transition-[opacity,color] duration-300 ease-in-out sm:right-5 sm:size-6 ${activeImageIndex === totalImages - 1 ? "pointer-events-none opacity-0" : "pointer-events-auto hover:text-white hover:opacity-100"}`}
        size={24}
        onClick={() => setActiveImageIndex(activeImageIndex + 1)}
      />
      {/* Image Container with Zoom */}
      <div className="overflow-hidden">
        {!!expandedImgUrl && (
          <Image
            src={expandedImgUrl}
            alt={
              modalFor === "products"
                ? `${productTitle} ${selectedColorLabel} ${activeImageIndex + 1} Expanded`
                : `Provided proof image ${activeImageIndex + 1} Expanded`
            }
            height={0}
            width={0}
            className="bg-[var(--product-default)] object-contain transition-transform duration-300 ease-in-out portrait:h-auto portrait:max-h-[calc(100dvh-20*2*2px-40*2px)] portrait:w-[calc(100dvw-10*4px-20px*2)] portrait:sm:w-[calc(100dvw-20*4px-24px*2)] portrait:md:max-h-[calc(100dvh-20*2*2px-40*2px-60px)] landscape:h-[90vh] landscape:w-auto"
            sizes="90vh"
            style={{
              transform: `scale(${zoomScales[zoomLevel] / 100})`,
            }}
          />
        )}
      </div>
    </div>
  );
}

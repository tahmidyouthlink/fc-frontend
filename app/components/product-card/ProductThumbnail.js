import Image from "next/image";
import { useEffect } from "react";

export default function ProductThumbnail({ product, imageSets }) {
  // console.log("chk imageSets", imageSets);
  useEffect(() => {
    const imageContainers = document.querySelectorAll(".img-container");
    let hoverTimer;

    const onMouseEnter = (event) => {
      let counter = 1,
        prevCount = 0;
      const images = event.currentTarget.querySelectorAll("img");

      if (!!images[prevCount] && !!images[counter])
        hoverTimer = setInterval(() => {
          images[prevCount].style.opacity = "0";
          images[counter].style.opacity = "1";

          prevCount = counter;
          counter = counter === images.length - 1 ? 0 : ++counter;
        }, 1000);
    };

    const onMouseLeave = (event) => {
      clearInterval(hoverTimer);

      const images = event.currentTarget.querySelectorAll("img");

      images.forEach((image, imageIndex) => {
        if (imageIndex === 0) image.style.opacity = "1";
        else image.style.opacity = "0";
      });
    };

    imageContainers.forEach((imageContainer) => {
      imageContainer.addEventListener("mouseenter", onMouseEnter);
      imageContainer.addEventListener("mouseleave", onMouseLeave);
    });

    imageContainers.forEach((imageContainer) => {
      return () => {
        imageContainer.removeEventListener("mouseenter", onMouseEnter);
        imageContainer.removeEventListener("mouseleave", onMouseLeave);
        if (hoverTimer) clearTimeout(hoverTimer);
      };
    });
  }, []);

  return (
    <div className="relative mb-3 h-[250px] w-full overflow-hidden rounded-[20px] bg-[#F0F0F0] sm:h-80 lg:h-[26vh]">
      {imageSets.map((imgSet, imgSetIndex) => {
        return (
          <div
            key={imgSet.color.label + imgSetIndex}
            className="img-container absolute h-[250px] w-full transition-[opacity] duration-300 ease-in-out sm:h-80 lg:h-[26vh]"
            style={{
              opacity: imgSetIndex === 0 ? "1" : "0",
              pointerEvents: imgSetIndex === 0 ? "auto" : "none",
            }}
          >
            {imgSet.images.map((imgUrl, imgIndex) => {
              return (
                <Image
                  key={imgSet.color.label + imgUrl + imgIndex}
                  className={`h-full w-full object-contain transition-[transform,opacity] duration-300 ease-in-out ${imgIndex === 0 ? "opacity-100" : "opacity-0"}`}
                  src={imgUrl}
                  alt={
                    product.productTitle +
                    imgSet.color.label +
                    (Number(imgIndex) + 1)
                  }
                  sizes="50vw"
                  fill
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

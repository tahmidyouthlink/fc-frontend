import Image from "next/image";
import { useEffect } from "react";
import TransitionLink from "../ui/TransitionLink";
import CardOutOfStockBanner from "./CardOutOfStockBanner";
import CardColorSelectionTool from "./CardColorSelectionTool";

export default function CardProductThumbnail({
  productTitle,
  productColors,
  isProductOutOfStock,
  imageSets,
}) {
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
    <div className="product-card relative aspect-[4/5] w-full overflow-hidden bg-[var(--product-default)] sm:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px]">
      <TransitionLink
        href={`/product/${productTitle.split(" ").join("-").toLowerCase()}`}
      >
        {imageSets.map((imgSet, imgSetIndex) => {
          return (
            <div
              key={
                "card-thumbnail-img-" +
                productTitle +
                imgSet.color.label +
                imgSetIndex
              }
              className="img-container absolute aspect-[4/5] w-full transition-[opacity] duration-300 ease-in-out sm:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px]"
              style={{
                opacity: imgSetIndex === 0 ? "1" : "0",
                pointerEvents: imgSetIndex === 0 ? "auto" : "none",
              }}
            >
              {!!imgSet &&
                imgSet.images.map((imgUrl, imgIndex) => {
                  return (
                    <Image
                      key={
                        "card-thumbnail-sub-img-" +
                        productTitle +
                        imgSet.color.label +
                        imgUrl +
                        imgIndex
                      }
                      className={`h-full w-full object-contain transition-[transform,opacity] duration-300 ease-in-out ${imgIndex === 0 ? "opacity-100" : "opacity-0"}`}
                      src={imgUrl}
                      alt={
                        productTitle +
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
        {isProductOutOfStock && <CardOutOfStockBanner />}
      </TransitionLink>
      {!isProductOutOfStock && (
        <CardColorSelectionTool
          productTitle={productTitle}
          productColors={productColors}
        />
      )}
    </div>
  );
}

import Image from "next/image";
import { useEffect, useState } from "react";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import curvedDottedLineShape from "@/public/shapes/curved-dotted-line-large.svg";

export default function Shapes({ rows }) {
  const [cardHeight, setCardHeight] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardHeight(250);
      } else if (window.innerWidth < 1024) {
        setCardHeight(300);
      } else {
        setCardHeight(194);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!!cardHeight)
    return [...Array(rows)].map((_, index) => (
      <div className="absolute inset-0" key={"shop-shapes-" + (index + 1)}>
        {index % 3 === 0 && (
          <div
            className="absolute -right-9 z-[-1] size-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#ebc6a6] blur-3xl"
            style={{
              top: `${(142 + cardHeight) * index + cardHeight / 2}px`,
            }}
          />
        )}
        {index % 3 === 0 && (
          <div
            className="absolute -left-5 aspect-[1.5/1] w-dvw opacity-50 sm:-left-8 sm:aspect-[2/1] lg:-left-12 lg:aspect-[3.5/1] min-[1200px]:-left-[calc((100dvw-1200px)/2)]"
            style={{
              top: `${(142 + cardHeight) * index + cardHeight / 2}px`,
            }}
          >
            <Image
              src={curvedDottedLineShape}
              alt="Curved dotted line"
              className="object-cover sm:object-contain"
              height={0}
              width={0}
              sizes="25vw"
              fill
            />
          </div>
        )}
        {(index + 1) % 3 === 0 && (
          <div
            className="absolute -left-7 aspect-square w-52 sm:max-lg:w-64 2xl:-left-12"
            style={{
              top: `${(142 + cardHeight) * index + cardHeight / 2}px`,
            }}
          >
            <Image
              src={circleWithStarShape}
              alt="Circle with star"
              className="object-contain"
              height={0}
              width={0}
              sizes="25vw"
              fill
            />
          </div>
        )}
      </div>
    ));
}

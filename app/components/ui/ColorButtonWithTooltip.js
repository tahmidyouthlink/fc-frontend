"use client";

import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@nextui-org/react";

export default function ColorButtonWithTooltip({
  color,
  colorIndex,
  toolLocation,
  selectedOptions,
  setSelectedOptions,
  setActiveImageIndex,
  setNumOfTimesThumbnailsMoved,
  changeActiveColorAndImage,
}) {
  const isActiveColor =
    toolLocation === "card"
      ? colorIndex === 0
      : selectedOptions?.color._id === color._id;

  const [openTooltipId, setOpenTooltipId] = useState(null);
  const isTouchDevice =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "ontouchstart" in window;

  const timeoutRef = useRef(null);

  const handleColorClick = (event) => {
    if (toolLocation === "page") {
      setActiveImageIndex(0);
      setNumOfTimesThumbnailsMoved(0);
    } else if (toolLocation === "card") {
      changeActiveColorAndImage(event, colorIndex);
    }

    if (toolLocation !== "card") {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        color: color,
        quantity: 1,
      }));
    }

    if (isTouchDevice) {
      // Toggle tooltip
      const isSame = openTooltipId === color._id;
      setOpenTooltipId(isSame ? null : color._id);

      // Clear existing timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!isSame) {
        // Auto-close after 3 seconds
        timeoutRef.current = setTimeout(() => {
          setOpenTooltipId(null);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Tooltip
      content={color.label}
      shouldFlip
      classNames={{
        content: [
          "px-3 rounded-[4px] py-2 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]",
        ],
      }}
      isOpen={isTouchDevice ? openTooltipId === color._id : undefined}
      onOpenChange={(open) => {
        if (!isTouchDevice) {
          setOpenTooltipId(open ? color._id : null);
        }
      }}
    >
      {/* Button Wrapper */}
      <div
        className={`grid cursor-pointer place-items-center rounded-full border-2 transition-[border-color] duration-300 ease-in-out hover:border-[var(--color-secondary-900)] ${isActiveColor ? "border-[var(--color-secondary-900)]" : "border-transparent"} ${toolLocation === "card" ? "size-[26px]" : "size-8"}`}
        onClick={(event) => handleColorClick(event)}
      >
        {/* Color Button */}
        <button
          className={`rounded-full ring-1 ring-neutral-300 ${toolLocation === "card" ? "size-4" : "size-[22px]"}`}
          style={{
            background:
              color.label !== "Multicolor"
                ? color.color
                : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
          }}
        ></button>
      </div>
    </Tooltip>
  );
}

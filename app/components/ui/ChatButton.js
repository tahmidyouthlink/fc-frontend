"use client";

import { useState } from "react";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { PiMessengerLogo, PiWhatsappLogo } from "react-icons/pi";

const bigBtnWithCanvasSize = 80;
const canvasOffset = 20;
const bigBtnSize = bigBtnWithCanvasSize - canvasOffset;
const gapFromBigBtn = 6;

export default function ChatButton() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  return (
    <div
      className="pointer-events-none fixed right-3 top-1/2 z-[4] -translate-y-1/2 rounded-full lg:right-5"
      style={{
        marginTop: `-${canvasOffset * 2}px`, // Adjust position (push upwards about twice the size of the offset) due to position adjustment of the big button
      }}
    >
      <div className="relative flex size-28 items-end justify-end">
        <button
          style={{
            margin: `0 -${canvasOffset}px -${canvasOffset}px 0`, // Adjust position (move a bit to the right and bottom) due to canvas offset
            width: `${bigBtnWithCanvasSize}px`,
            height: `${bigBtnWithCanvasSize}px`,
          }}
          className={`pointer-events-auto size-20 scale-100 transition-[opacity,transform] duration-400 ease-out hover:scale-125 hover:opacity-100 ${
            isButtonClicked ? "opacity-100" : "opacity-60"
          }`}
          onClick={() => setIsButtonClicked((prevState) => !prevState)}
        >
          <DotLottieReact
            className="h-full w-full object-contain"
            src="/chat/chat.lottie"
            loop
            autoplay
          />
        </button>
        <Link
          target="_blank"
          href="https://wa.me/8801611556355"
          rel="noopener noreferrer"
          className={`chat-sub-btn bg-[#aeffbd] delay-0 ${isButtonClicked ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          style={{
            transform: `
              translate(${isButtonClicked ? `-${bigBtnSize * 0.8 + gapFromBigBtn}px, -${bigBtnSize * 0.4 + gapFromBigBtn}px` : "0, 0"})
              scale(${isButtonClicked ? "1" : "0"})
              rotate(${isButtonClicked ? "720deg" : "0deg"})
            `,
          }}
        >
          <PiWhatsappLogo />
        </Link>
        <Link
          target="_blank"
          href="https://m.me/manutd.heartbeatoffootball"
          rel="noopener noreferrer"
          className={`chat-sub-btn bg-[#ced0ff] delay-75 ${isButtonClicked ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          style={{
            transform: `
              translate(${isButtonClicked ? `-${bigBtnSize * 0.8 + gapFromBigBtn}px, ${bigBtnSize * 0.4 + gapFromBigBtn}px` : "0, 0"})
              scale(${isButtonClicked ? "1" : "0"})
              rotate(${isButtonClicked ? "720deg" : "0deg"})
            `,
          }}
        >
          <PiMessengerLogo />
        </Link>
      </div>
    </div>
  );
}

"use client";

import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";

export default function TrackingCode({ trackingCode }) {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      toast.success("Tracking code copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy the tracking code.");
    }
  };

  return (
    <div>
      <h4 className="text-nowrap font-semibold">Tracking Code</h4>
      <span
        className="flex cursor-pointer items-center gap-1 hover:text-neutral-800 sm:gap-2 [&>*]:transition-[color] [&>*]:duration-300 [&>*]:ease-in-out"
        onClick={handleCopyToClipboard}
      >
        {trackingCode && <LuCopy className="" size={16} />}
        <p className="text-nowrap text-right">{trackingCode || "--"}</p>
      </span>
    </div>
  );
}

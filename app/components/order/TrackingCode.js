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
      <span className="flex items-center gap-1 sm:gap-2">
        {trackingCode && (
          <LuCopy
            className="cursor-pointer transition-[color] duration-300 ease-in-out hover:text-neutral-800"
            size={16}
            onClick={handleCopyToClipboard}
          />
        )}
        <p className="text-nowrap text-right">{trackingCode || "--"}</p>
      </span>
    </div>
  );
}

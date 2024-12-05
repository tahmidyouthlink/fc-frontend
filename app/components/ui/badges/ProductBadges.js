import { LuBadge } from "react-icons/lu";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineNewReleases } from "react-icons/md";
import { TbRosetteDiscount } from "react-icons/tb";

export default function ProductBadges({
  isTrending,
  isNewArrival,
  hasDiscount,
  discount,
}) {
  return (
    <div className="absolute left-3.5 top-3.5 z-[3] space-y-2">
      {isTrending && (
        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#cd4747] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+58px+10px)]">
          <div className="relative mx-1.5 h-9 w-6">
            <LuBadge className="h-full w-full object-contain" />
            <HiOutlineLightningBolt className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
          </div>
          <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
            Trending!
          </p>
        </div>
      )}
      {isNewArrival && (
        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#5c49d9] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] hover:w-[calc(36px+31px+10px)]">
          <MdOutlineNewReleases className="mx-1.5 h-9 w-6 object-contain" />
          <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
            New!
          </p>
        </div>
      )}
      {hasDiscount && (
        <div
          className={`relative h-9 w-9 overflow-hidden rounded-lg bg-[#32aa54] font-semibold text-white shadow-[1px_1px_12px_0_rgba(0,0,0,0.1)] transition-[background-color,width] ${discount.type === "Percentage" ? "hover:w-[calc(36px+56px+10px)]" : "hover:w-[calc(36px+68px+10px)]"}`}
        >
          <TbRosetteDiscount className="mx-1.5 h-9 w-6 object-contain" />
          <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
            {discount.text} OFF!
          </p>
        </div>
      )}
    </div>
  );
}

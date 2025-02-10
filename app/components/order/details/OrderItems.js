import Image from "next/image";
import { FaCircleCheck } from "react-icons/fa6";
import TransitionLink from "@/app/components/ui/TransitionLink";
import DiscountTooptip from "../../ui/DiscountTooltip";

export default function OrderItems({ orderItems }) {
  const calculateTotalItems = () => {
    return orderItems?.reduce(
      (accumulator, item) => Number(item?.sku) + accumulator,
      0,
    );
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5">
        <h2 className="text-sm font-semibold md:text-base">Items</h2>
        <span className="flex size-5 items-center justify-center rounded-full bg-neutral-200 text-[11px]/[11px] font-semibold text-neutral-600">
          {calculateTotalItems()}
        </span>
      </div>
      <ul className="mb-4 grid auto-rows-fr gap-5">
        {orderItems?.map((item) => {
          const itemFinalPrice =
            !item?.offerInfo && !!item?.discountInfo
              ? Number(item?.discountInfo?.finalPriceAfterDiscount)
              : Number(item?.regularPrice);
          const itemTotalPrice = itemFinalPrice * Number(item?.sku);

          return (
            <li
              key={
                "order-item-" +
                item?._id +
                "-size-" +
                item?.size +
                "-color-" +
                item?.color?.label
              }
              className="flex w-full items-stretch justify-between gap-x-2.5"
            >
              <TransitionLink
                href={`/product/${item?.productTitle?.split(" ")?.join("-")?.toLowerCase()}`}
                className="relative block min-h-full w-[72px] overflow-hidden rounded-md bg-[#F0F0F0] sm:w-20 xl:w-1/4"
              >
                {!!item?.thumbnailImgUrl && (
                  <Image
                    className="h-full w-full object-contain"
                    src={item?.thumbnailImgUrl}
                    alt={item?.productTitle}
                    fill
                    sizes="15vh"
                  />
                )}
              </TransitionLink>
              <div className="grow text-xs text-neutral-400 lg:text-sm">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex justify-between gap-x-2 sm:gap-x-5">
                    <div>
                      <TransitionLink
                        href={`/product/${item?.productTitle?.split(" ")?.join("-")?.toLowerCase()}`}
                        className="underline-offset-1 hover:underline"
                      >
                        <h4 className="line-clamp-1 text-neutral-600 md:text-[15px]">
                          {item?.productTitle}
                        </h4>
                      </TransitionLink>
                      <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                        <h5>Unit Price:</h5>
                        <span>{itemFinalPrice?.toLocaleString()}</span>
                      </div>
                      <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                        <h5>Size:</h5>
                        <span>{item?.size}</span>
                      </div>
                      <div className="mt-1 flex gap-x-1.5 text-xs md:text-[13px]">
                        <h5>Color:</h5>
                        <div className="flex items-center gap-x-1">
                          <div
                            style={{
                              backgroundColor: item?.color?.color,
                            }}
                            className="size-3.5 max-h-3.5 max-w-3.5 rounded-full"
                          />
                          <p className="line-clamp-1">{item?.color?.label}</p>
                        </div>
                      </div>
                      {/* Special Offer Text (if applicable) */}
                      {!!item?.offerInfo && (
                        <DiscountTooptip
                          discountTitle={item?.offerInfo?.offerTitle}
                          discountAmount={
                            item?.offerInfo?.offerDiscountType === "Percentage"
                              ? item?.offerInfo?.offerDiscountValue + "%"
                              : "৳ " + item?.offerInfo?.offerDiscountValue
                          }
                          isEligibleForSpecialOffer={true}
                          savedAmount={Number(
                            item?.offerInfo?.appliedOfferDiscount,
                          )}
                        >
                          <span className="mt-1 flex cursor-default items-center gap-x-1 text-xs text-[#57944e] underline-offset-2 hover:underline">
                            <span>
                              Special Offer (
                              {item?.offerInfo?.offerDiscountType ===
                              "Percentage"
                                ? item?.offerInfo?.offerDiscountValue + "%"
                                : "৳ " + item?.offerInfo?.offerDiscountValue}
                              )
                            </span>
                            <span>
                              <FaCircleCheck className="size-4" />
                            </span>
                          </span>
                        </DiscountTooptip>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex h-fit shrink-0 gap-x-2">
                        <p className="w-full text-nowrap text-right text-neutral-600 md:text-[15px]">
                          ৳ {itemTotalPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <div className="flex gap-x-1.5 justify-self-end text-[13px] md:text-sm">
                          <h5 className="lg:hidden">Qty:</h5>
                          <h5 className="max-lg:hidden">Quantity:</h5>
                          <span>{item?.sku}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

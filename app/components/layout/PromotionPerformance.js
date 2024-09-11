import React from 'react';
import useOrders from '@/app/hooks/useOrders';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';

const PromotionPerformance = () => {
  const [orderList, isOrderPending] = useOrders();

  if (isOrderPending) {
    return <SmallHeightLoading />;
  }

  // Initialize counters and total discount
  let totalPromoAndOfferApplied = 0;
  let totalDiscount = 0;

  // Iterate over each order
  orderList?.forEach((order) => {
    let promoDiscount = 0;
    let offerDiscount = 0;

    // Calculate promo discount if a promoCode is applied
    if (order.promoCode?.trim()) {
      if (order.promoDiscountType === 'Percentage') {
        promoDiscount = (order.promoDiscountValue / 100) * order.totalAmount;
      } else if (order.promoDiscountType === 'Amount') {
        promoDiscount = order.promoDiscountValue;
      }
    }

    // Calculate offer discount if an offer is applied
    if (order.offerTitle?.trim()) {
      if (order.offerDiscountType === 'Percentage') {
        offerDiscount = (order.offerDiscountValue / 100) * order.totalAmount;
      } else if (order.offerDiscountType === 'Amount') {
        offerDiscount = order.offerDiscountValue;
      }
    }

    // If either a promo or an offer is applied, increment the counter
    if (promoDiscount > 0 || offerDiscount > 0) {
      totalPromoAndOfferApplied++;
    }

    // Add to total discount (both promo and offer)
    totalDiscount += promoDiscount + offerDiscount;
  });

  return (
    <div className='mt-8 mb-6'>
      <div className="flex items-center gap-6 w-1/2">
        {/* Total number of customers who applied both promo and offer */}
        <div className="border rounded-lg p-6  space-y-3 w-full">
          <p className='text-[10px] md:text-xs lg:text-sm xl:text-base font-semibold'>Discounted orders</p>
          <h3 className='font-bold md:text-xl lg:text-2xl xl:text-3xl'>{totalPromoAndOfferApplied}</h3>
        </div>

        {/* Total discount from promo and offer */}
        <div className="border rounded-lg p-6 space-y-3 w-full">
          <p className='text-[10px] md:text-xs lg:text-sm xl:text-base font-semibold'>Discounted amount</p>
          <h3 className='font-bold md:text-xl lg:text-2xl xl:text-3xl flex items-center gap-0 md:gap-1'><span>৳</span> {totalDiscount.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

export default PromotionPerformance;
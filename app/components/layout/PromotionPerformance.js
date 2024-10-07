import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useOrders from '@/app/hooks/useOrders';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';
import { format, startOfToday, endOfToday, startOfYesterday, endOfYesterday, subDays, subMonths, startOfMonth, endOfMonth, isValid } from 'date-fns';
import { Checkbox, CheckboxGroup, DateRangePicker } from '@nextui-org/react';
import { IoMdClose } from 'react-icons/io';

const PromotionPerformanceChart = () => {
  const [orderList, isOrderPending] = useOrders();
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDateRangePicker, setShowDateRangePicker] = useState(true); // New state
  const [selected, setSelected] = useState(['totalDiscountedAmount', 'totalDiscountedOrders']);

  const handleChange = (values) => {
    // Ensure at least one checkbox is always selected
    if (values.length === 0) return;
    setSelected(values);
  };

  useEffect(() => {
    // Set default date range to Today when the component mounts
    handleDateFilter('all');
  }, []);

  const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split('|').map(part => part.trim());
    const [day, month, year] = datePart.split('-').map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    const date = new Date(fullYear, month - 1, day);

    if (timePart) {
      const [hours, minutes] = timePart.split(':').map(Number);
      date.setHours(hours, minutes);
    }

    return date;
  };

  const { startDate, endDate } = useMemo(() => {
    const start = selectedDateRange.start
      ? new Date(selectedDateRange.start.year, selectedDateRange.start.month - 1, selectedDateRange.start.day)
      : null;
    const end = selectedDateRange.end
      ? new Date(selectedDateRange.end.year, selectedDateRange.end.month - 1, selectedDateRange.end.day)
      : null;

    const adjustedEndDate = end ? new Date(end.getTime() + 24 * 60 * 60 * 1000 - 1) : null;

    return { startDate: start, endDate: adjustedEndDate };
  }, [selectedDateRange]);

  const getDateRange = useCallback(() => {
    return {
      startDate: startDate && isValid(startDate) ? format(startDate, 'yyyy-MM-dd') : null,
      endDate: endDate && isValid(endDate) ? format(endDate, 'yyyy-MM-dd') : null,
    };
  }, [startDate, endDate]);

  const { startDate: filterStartDate, endDate: filterEndDate } = useMemo(() => {
    return getDateRange();
  }, [getDateRange]);

  const normalizeDateRange = (startRange, endRange) => {
    const startDate = startRange ? new Date(startRange) : null;
    const endDate = endRange ? new Date(endRange) : null;

    const normalizedStart = startDate ? {
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
      day: startDate.getDate(),
    } : null;

    const normalizedEnd = endDate ? {
      year: endDate.getFullYear(),
      month: endDate.getMonth() + 1,
      day: endDate.getDate(),
    } : null;

    setSelectedDateRange({
      start: normalizedStart,
      end: normalizedEnd,
    });

    // Set active filter to 'custom' if a custom date range is selected
    if (startRange && endRange) {
      setActiveFilter('custom');
      setShowDateRangePicker(false);
    }
  };

  const { totalPromoAndOfferApplied, totalDiscount } = useMemo(() => {
    let totalPromoAndOfferApplied = 0;
    let totalDiscount = 0;

    // If activeFilter is "all", we ignore the date filters and calculate for all orders
    const filteredOrders = activeFilter === "all" ? orderList?.filter((order) => order.paymentStatus === "Paid")
      : orderList?.filter((order) => {
        // Date filter only applies if activeFilter is not "all"
        if (!filterStartDate || !filterEndDate) {
          return false; // No filter applied yet, return empty
        }

        const startDateObj = new Date(filterStartDate);
        const endDateObj = new Date(filterEndDate);
        const adjustedStartDate = new Date(startDateObj.setHours(0, 0, 0, 0)); // Start of day
        const adjustedEndDate = new Date(endDateObj.setHours(23, 59, 59, 999)); // End of day
        const orderDate = parseDate(order.dateTime);

        // Return only orders that fall within the date range and are "Paid"
        return orderDate >= adjustedStartDate && orderDate <= adjustedEndDate && order.paymentStatus === "Paid";
      });

    filteredOrders?.forEach((order) => {
      let promoDiscount = 0;
      let offerDiscount = 0;
      let offerAppliedCount = 0;

      // Calculate total offer discounts for the order
      order.productInformation.forEach((product) => {
        if (product.offerTitle?.trim()) {
          offerAppliedCount += 1; // Count how many offers were applied
          let productTotal = product.unitPrice * product.sku;
          let productOfferDiscount = 0;

          if (product.offerDiscountType === 'Percentage') {
            productOfferDiscount = (product.offerDiscountValue / 100) * productTotal;
          } else {
            productOfferDiscount = product.offerDiscountValue;
          }

          offerDiscount += productOfferDiscount; // Sum up offer discounts
        }
      });

      // Add to total counts if any offers were applied
      if (offerDiscount > 0) {
        totalPromoAndOfferApplied += offerAppliedCount; // Add number of offers applied
      }

      // Calculate adjusted order total after offer discounts
      const adjustedOrderTotal = order.totalAmount - offerDiscount;

      // Calculate promo discount based on adjusted order total
      if (order.promoCode?.trim()) {
        if (order.promoDiscountType === 'Percentage') {
          promoDiscount = (order.promoDiscountValue / 100) * adjustedOrderTotal;
        } else {
          promoDiscount = order.promoDiscountValue;
        }
        totalPromoAndOfferApplied += 1; // Count the promo applied
      }

      // Sum total discounts from offers and promo codes
      totalDiscount += offerDiscount + promoDiscount;
    });

    return { totalPromoAndOfferApplied, totalDiscount };
  }, [orderList, filterStartDate, filterEndDate, activeFilter]);

  const hourlyPromotionData = useMemo(() => {
    if (!filterStartDate || !filterEndDate) return [];

    const isTodayOrYesterday = activeFilter === 'today' || activeFilter === 'yesterday';
    if (!isTodayOrYesterday) return [];

    // Normalize the start and end date to include the full day range
    const startDateObj = new Date(filterStartDate);
    const endDateObj = new Date(filterEndDate);
    const adjustedStartDate = new Date(startDateObj.setHours(0, 0, 0, 0));
    const adjustedEndDate = new Date(endDateObj.setHours(23, 59, 59, 999));

    // Initialize an array to hold hourly data
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      discountedAmount: 0,
      discountedOrders: 0,
    }));

    // Filter and process each order
    orderList?.forEach((order) => {
      if (order.paymentStatus !== 'Paid') return;
      const orderDate = parseDate(order.dateTime);

      // Check if the order is within the specified date range
      if (orderDate >= adjustedStartDate && orderDate <= adjustedEndDate) {
        const hour = orderDate.getHours();
        let offerDiscount = 0;
        let promoDiscount = 0;
        let hasOfferApplied = false;
        let hasPromoApplied = false;

        // Calculate total offer discounts for the order
        order.productInformation.forEach((product) => {
          if (product.offerTitle?.trim()) {
            hasOfferApplied = true; // Track if any offer is applied
            let productTotal = product.unitPrice * product.sku;
            let productOfferDiscount = 0;

            if (product.offerDiscountType === 'Percentage') {
              productOfferDiscount = (product.offerDiscountValue / 100) * productTotal;
            } else {
              productOfferDiscount = product.offerDiscountValue;
            }

            offerDiscount += productOfferDiscount;
          }
        });

        // Calculate adjusted order total after offer discounts
        const adjustedOrderTotal = order.totalAmount - offerDiscount;

        // Calculate promo discount based on adjusted order total
        if (order.promoCode?.trim()) {
          hasPromoApplied = true; // Track if promo code is applied
          if (order.promoDiscountType === 'Percentage') {
            promoDiscount = (order.promoDiscountValue / 100) * adjustedOrderTotal;
          } else {
            promoDiscount = order.promoDiscountValue;
          }
        }

        // Calculate total discount from offers and promo codes
        const totalOrderDiscount = offerDiscount + promoDiscount;

        // Update the hourly data
        hourlyData[hour].discountedAmount += totalOrderDiscount;

        // Increment discountedOrders for each type of discount applied
        if (hasOfferApplied) {
          hourlyData[hour].discountedOrders += 1;
        }
        if (hasPromoApplied) {
          hourlyData[hour].discountedOrders += 1;
        }
      }
    });

    return hourlyData;
  }, [orderList, filterStartDate, filterEndDate, activeFilter]);

  const dailyData = useMemo(() => {
    // Initialize an object to hold daily data
    const dailyData = {};

    // Determine whether to filter by date based on activeFilter
    let filteredOrders;
    if (activeFilter === "all") {
      // If activeFilter is "all", consider all "Paid" orders without date filtering
      filteredOrders = orderList?.filter((order) => order.paymentStatus === "Paid");
    } else {
      // Apply date filtering if activeFilter is not "all"
      if (!filterStartDate || !filterEndDate) return []; // Return empty if filters are not set

      const startDateObj = new Date(filterStartDate);
      const endDateObj = new Date(filterEndDate);
      endDateObj.setHours(23, 59, 59, 999); // Set to end of the day

      filteredOrders = orderList?.filter((order) => {
        const orderDate = parseDate(order.dateTime);
        return orderDate >= startDateObj && orderDate <= endDateObj && order.paymentStatus === "Paid";
      });
    }

    // Process each filtered order
    filteredOrders?.forEach((order) => {
      const orderDate = parseDate(order.dateTime);
      const orderDateFormatted = format(orderDate, 'yyyy-MM-dd');
      let offerDiscount = 0;
      let promoDiscount = 0;
      let hasOfferApplied = false;
      let hasPromoApplied = false;

      // Calculate total offer discounts for the order
      order.productInformation.forEach((product) => {
        if (product.offerTitle?.trim()) {
          hasOfferApplied = true; // Track if any offer is applied
          let productTotal = product.unitPrice * product.sku;
          let productOfferDiscount = 0;

          if (product.offerDiscountType === 'Percentage') {
            productOfferDiscount = (product.offerDiscountValue / 100) * productTotal;
          } else {
            productOfferDiscount = product.offerDiscountValue;
          }

          offerDiscount += productOfferDiscount;
        }
      });

      // Calculate adjusted order total after offer discounts
      const adjustedOrderTotal = order.totalAmount - offerDiscount;

      // Calculate promo discount based on adjusted order total
      if (order.promoCode?.trim()) {
        hasPromoApplied = true; // Track if promo code is applied
        if (order.promoDiscountType === 'Percentage') {
          promoDiscount = (order.promoDiscountValue / 100) * adjustedOrderTotal;
        } else {
          promoDiscount = order.promoDiscountValue;
        }
      }

      // Initialize dailyData for the specific date if it doesn't exist
      if (!dailyData[orderDateFormatted]) {
        dailyData[orderDateFormatted] = {
          discountedAmount: 0,
          discountedOrders: 0,
          offerCount: 0,
          promoCount: 0,
        };
      }

      // Update the daily data with the calculated discounts
      dailyData[orderDateFormatted].discountedAmount += offerDiscount + promoDiscount;

      // Increment discountedOrders for each type of discount applied
      if (hasOfferApplied) {
        dailyData[orderDateFormatted].discountedOrders += 1; // Count this order as discounted
        dailyData[orderDateFormatted].offerCount += 1; // Count individual offer application
      }
      if (hasPromoApplied) {
        dailyData[orderDateFormatted].discountedOrders += 1; // Count this order as discounted
        dailyData[orderDateFormatted].promoCount += 1; // Count individual promo application
      }
    });

    // Create a final array for bar chart
    return Object.keys(dailyData).map((date) => ({
      date,
      discountedAmount: dailyData[date].discountedAmount.toFixed(2),
      discountedOrders: dailyData[date].discountedOrders,
      totalPromoAndOfferApplied: dailyData[date].offerCount + dailyData[date].promoCount, // Total applied count
    }));
  }, [orderList, filterStartDate, filterEndDate, activeFilter]);

  const handleReset = () => {
    // Set date range to today
    const today = new Date();
    setSelectedDateRange({
      start: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
      end: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
    });

    // Set active filter to 'today'
    setActiveFilter('all');
    setShowDateRangePicker(true);
  };

  const handleDateFilter = (filter) => {
    let start = null;
    let end = null;

    switch (filter) {
      case 'today':
        start = startOfToday();
        end = endOfToday();
        break;
      case 'yesterday':
        start = startOfYesterday();
        end = endOfYesterday();
        break;
      case 'last7days':
        start = subDays(new Date(), 6);
        end = endOfToday();
        break;
      case 'lastMonth':
        const previousMonthStart = new Date(startOfMonth(subMonths(new Date(), 1)));
        previousMonthStart.setHours(0, 0, 0, 0); // Set time to 00:00:00
        const previousMonthEnd = new Date(endOfMonth(subMonths(new Date(), 1)));
        previousMonthEnd.setHours(23, 59, 59, 999); // Set time to 23:59:59
        start = new Date(startOfMonth(subMonths(new Date(), 1)));
        end = new Date(endOfMonth(subMonths(new Date(), 1)));
        break;
      default:
        break;
    }

    setSelectedDateRange({
      start: start && { year: start.getFullYear(), month: start.getMonth() + 1, day: start.getDate() },
      end: end && { year: end.getFullYear(), month: end.getMonth() + 1, day: end.getDate() },
    });
    setActiveFilter(filter); // Set active filter
    setShowDateRangePicker(true);
  };

  const formatXAxis = (tickItem) => {
    // Convert date string to Date object
    const date = new Date(tickItem);
    // Format date to MM/dd
    return format(date, 'MM/dd');
  };

  const maxDiscountedAmount = useMemo(() => {
    return Math.floor(Math.max(...hourlyPromotionData.map(data => data.discountedAmount), 0));
  }, [hourlyPromotionData]);

  const maxDiscountedAmountDay = useMemo(() => {
    return Math.floor(Math.max(...dailyData.map(data => data.discountedAmount), 0));
  }, [dailyData]);

  const yAxisDomain = [0, maxDiscountedAmount * 1.2];
  const yAxisDomainDay = [0, maxDiscountedAmountDay * 1.2];

  if (isOrderPending) {
    return <SmallHeightLoading />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap mt-6 justify-center lg:justify-end items-center gap-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleDateFilter('all')}
            className={`px-2 py-1 text-xs md:text-sm md:py-2 md:px-4 ${activeFilter === 'all' ? 'text-[#D2016E] border rounded-full border-[#D2016E] font-semibold' : "text-neutral-500 font-semibold border border-gray-200 rounded-full"}`}
          >
            All
          </button>
          <button
            onClick={() => handleDateFilter('today')}
            className={`px-2 py-1 text-xs md:text-sm md:py-2 md:px-4 ${activeFilter === 'today' ? 'text-[#D2016E] border rounded-full border-[#D2016E] font-semibold' : "text-neutral-500 font-semibold border border-gray-200 rounded-full"}`}
          >
            Today
          </button>
          <button
            onClick={() => handleDateFilter('yesterday')}
            className={`px-2 py-1 text-xs md:text-sm md:py-2 md:px-4 ${activeFilter === 'yesterday' ? 'text-[#D2016E] border rounded-full border-[#D2016E] font-semibold' : "text-neutral-500 font-semibold border border-gray-200 rounded-full"}`}
          >
            Yesterday
          </button>
          <button
            onClick={() => handleDateFilter('last7days')}
            className={`px-2 py-1 text-xs md:text-sm md:py-2 md:px-4 ${activeFilter === 'last7days' ? 'text-[#D2016E] border rounded-full border-[#D2016E] font-semibold' : "text-neutral-500 font-semibold border border-gray-200 rounded-full"}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleDateFilter('lastMonth')}
            className={`px-2 py-1 text-xs md:text-sm md:py-2 md:px-4 ${activeFilter === 'lastMonth' ? 'text-[#D2016E] border rounded-full border-[#D2016E] font-semibold' : "text-neutral-500 font-semibold border border-gray-200 rounded-full"}`}
          >
            Last Month
          </button>
        </div>

        <div className='flex items-center gap-2'>
          {showDateRangePicker && (
            <DateRangePicker
              label="Select Date Range"
              visibleMonths={2}
              onChange={(range) => {
                if (range && range.start && range.end) {
                  normalizeDateRange(range.start, range.end);
                }
              }}
              // Ensure the picker clears after reset and updates after new selection
              value={selectedDateRange.start && selectedDateRange.end
                ? [
                  new Date(selectedDateRange.start.year, selectedDateRange.start.month - 1, selectedDateRange.start.day),
                  new Date(selectedDateRange.end.year, selectedDateRange.end.month - 1, selectedDateRange.end.day)
                ]
                : null
              }
            />
          )}

          {selectedDateRange.start && selectedDateRange.end && activeFilter === 'custom' && (
            <button className="hover:text-red-500 font-bold text-white rounded-lg bg-red-600 hover:bg-white p-1" onClick={handleReset}>
              <IoMdClose className="text-lg" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Summary Section */}
        <div className='flex lg:flex-col xl:flex-row items-center justify-center gap-6 w-1/3 xl:w-3/4 lg:min-h-[150px] lg:max-h-[150px]'>
          <div className="border rounded-lg p-4 md:p-8 space-y-3">
            <p className="text-[10px] md:text-sm xl:text-base font-semibold">Discounted orders</p>
            <h3 className="font-bold md:text-xl lg:text-2xl xl:text-3xl">{totalPromoAndOfferApplied}</h3>
          </div>
          <div className="border rounded-lg p-4 md:p-8 space-y-3">
            <p className="text-[10px] md:text-sm xl:text-base font-semibold">Discounted amount</p>
            <h3 className="font-bold md:text-xl lg:text-2xl xl:text-3xl flex items-center gap-0 md:gap-1">
              <span>৳</span> {totalDiscount.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="w-full h-[400px] flex items-center justify-center mt-2 lg:mt-6 xl:mt-2 2xl:mt-0">
          {dailyData.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium text-gray-500">No data available for the selected day.<br /> Please choose a different date or date range to see results.</p>
            </div>
          ) : (
            <div className='w-full'>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={activeFilter === 'today' || activeFilter === 'yesterday' ? hourlyPromotionData : dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={activeFilter === 'today' || activeFilter === 'yesterday' ? "hour" : "date"} tickFormatter={activeFilter === 'today' || activeFilter === 'yesterday' ? "" : formatXAxis} />
                  <YAxis domain={activeFilter === 'today' || activeFilter === 'yesterday' ? yAxisDomain : yAxisDomainDay} />
                  <Tooltip />
                  {selected.includes('totalDiscountedAmount') && (
                    <Bar dataKey="discountedAmount" radius={[8, 8, 0, 0]} fill="#D2016E" name="Total Discounted Amount (৳)" />
                  )}
                  {selected.includes('totalDiscountedOrders') && (
                    <Bar dataKey="discountedOrders" radius={[8, 8, 0, 0]} fill="#3480A3" name="Total Discounted Orders" />
                  )}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex md:gap-4 justify-center">
                <CheckboxGroup
                  value={selected}
                  onChange={handleChange}
                  orientation="horizontal"
                >
                  <Checkbox color="danger" value="totalDiscountedAmount"><span className='text-sm xl:text-base text-[#F53B7B]'>Total Discounted Amount (৳)</span></Checkbox>
                  <Checkbox color="primary" value="totalDiscountedOrders"><span className='text-sm xl:text-base text-[#3480A3]'>Total Discounted Orders</span></Checkbox>
                </CheckboxGroup>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default PromotionPerformanceChart;
import useOrders from '@/app/hooks/useOrders';
import React, { useCallback, useMemo, useState } from 'react';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';
import { Checkbox, CheckboxGroup, DateRangePicker } from '@nextui-org/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { IoMdClose } from 'react-icons/io';
import { format, startOfToday, endOfToday, startOfYesterday, endOfYesterday, subDays, subMonths, startOfMonth, endOfMonth, isValid } from 'date-fns';

const parseDate = (dateString) => {
  const [datePart] = dateString.split('|').map(part => part.trim());
  const [day, month, year] = datePart.split('-').map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day);
};

const FinancePerformance = () => {
  const [orderList, isOrderPending] = useOrders();
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
  const [activeFilter, setActiveFilter] = useState('today');
  const [showDateRangePicker, setShowDateRangePicker] = useState(true); // New state
  const [selected, setSelected] = useState(['bKash', 'SSLCommerz']);

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
    const startDate = startRange && typeof startRange === 'object' ? new Date(startRange) : null;
    const endDate = endRange && typeof endRange === 'object' ? new Date(endRange) : null;

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

  const { bKashTransactions, sslCommerzTransactions } = useMemo(() => {
    let bKashTransactions = 0;
    let sslCommerzTransactions = 0;

    if (!filterStartDate || !filterEndDate) {
      return { bKashTransactions, sslCommerzTransactions }; // No filter applied yet
    }

    // Convert filter dates to Date objects and normalize them to start and end of day
    const startDateObj = new Date(filterStartDate);
    const endDateObj = new Date(filterEndDate);

    const adjustedStartDate = new Date(startDateObj.setHours(0, 0, 0, 0)); // Start of day
    const adjustedEndDate = new Date(endDateObj.setHours(23, 59, 59, 999)); // End of day

    // Filter orders based on the normalized date range
    const filteredOrders = orderList?.filter((order) => {
      const orderDate = parseDate(order.dateTime);
      return orderDate >= adjustedStartDate && orderDate <= adjustedEndDate;
    });

    // Count the number of transactions for each payment method
    filteredOrders?.forEach((order) => {
      if (order.paymentMethod === 'bKash') {
        bKashTransactions += 1;
      } else if (order.paymentMethod === 'SSLCommerz') {
        sslCommerzTransactions += 1;
      }
    });

    return { bKashTransactions, sslCommerzTransactions };
  }, [orderList, filterStartDate, filterEndDate]);

  const paymentMethodData = useMemo(() => {
    const dailyData = {};

    orderList?.forEach((order) => {
      const orderDate = parseDate(order.dateTime);
      const orderDateFormatted = format(orderDate, 'yyyy-MM-dd');

      // Check if orderDate is within the selected date range
      if (orderDateFormatted >= filterStartDate && orderDateFormatted <= filterEndDate) {
        // Initialize the date key if not already present
        if (!dailyData[orderDateFormatted]) {
          dailyData[orderDateFormatted] = {
            bKashTransactions: 0,
            sslCommerzTransactions: 0,
          };
        }

        // Count the transactions based on the payment method
        if (order.paymentMethod === 'bKash') {
          dailyData[orderDateFormatted].bKashTransactions += 1;
        } else if (order.paymentMethod === 'SSLCommerz') {
          dailyData[orderDateFormatted].sslCommerzTransactions += 1;
        }
      }
    });

    // Convert the data to the format expected by the chart
    return Object.keys(dailyData).map((date) => ({
      date,  // Use this as the label for the x-axis
      bKashTransactions: dailyData[date].bKashTransactions,
      sslCommerzTransactions: dailyData[date].sslCommerzTransactions,
    }));
  }, [orderList, filterStartDate, filterEndDate]);

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
    setActiveFilter('today');
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

  const handleChange = (values) => {
    // Ensure at least one checkbox is always selected
    if (values.length === 0) return;
    setSelected(values);
  };

  if (isOrderPending) {
    return <SmallHeightLoading />;
  }

  return (
    <div className="space-y-5">

      <div className="flex flex-wrap mt-6 justify-center lg:justify-end items-center gap-3">
        <div className="flex items-center justify-center gap-2">
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
      <div className='flex flex-col lg:flex-row items-center justify-center gap-6'>
        {/* Summary Section */}
        <div className='flex lg:flex-col xl:flex-row items-center justify-center gap-6 w-1/3 xl:w-3/4 lg:min-h-[150px] lg:max-h-[150px]'>
          <div className="border rounded-lg p-4 md:p-8 space-y-3">
            <p className="text-[10px] md:text-sm xl:text-base font-semibold">Number of bKash Transactions</p>
            <h3 className="font-bold md:text-xl lg:text-2xl xl:text-3xl">{bKashTransactions}</h3>
          </div>
          <div className="border rounded-lg p-4 md:p-8 space-y-3">
            <p className="text-[10px] md:text-sm xl:text-base font-semibold">Number of SSLCommerz Transactions</p>
            <h3 className="font-bold md:text-xl lg:text-2xl xl:text-3xl flex items-center gap-0 md:gap-1">
              {sslCommerzTransactions}
            </h3>
          </div>
        </div>

        <div className="w-full h-[400px] flex items-center justify-center mt-2 lg:mt-6 xl:mt-2 2xl:mt-0">
          {paymentMethodData.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium text-gray-500">No data available for the selected day.<br /> Please choose a different date or date range to see results.</p>
            </div>
          ) : (
            <div className='w-full'>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatXAxis} /> {/* X-axis labels based on date */}
                  <YAxis />
                  <Tooltip />

                  {/* Bar for bKash transactions */}
                  {selected.includes('bKash') && (
                    <Bar dataKey="bKashTransactions" name="bKash Transactions" fill="#D2016E" radius={[8, 8, 0, 0]} />
                  )}

                  {/* Bar for SSLCommerz transactions */}
                  {selected.includes('SSLCommerz') && (
                    <Bar dataKey="sslCommerzTransactions" name="SSLCommerz Transactions" fill="#3480A3" radius={[8, 8, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
              <div className="flex md:gap-4 justify-center">
                <CheckboxGroup
                  value={selected}
                  onChange={handleChange}
                  orientation="horizontal"
                >
                  <Checkbox color="danger" value="bKash">
                    <span className='text-sm xl:text-base text-[#F53B7B]'>bKash Transactions</span>
                  </Checkbox>
                  <Checkbox color="primary" value="SSLCommerz">
                    <span className='text-sm xl:text-base text-[#3480A3]'>SSLCommerz Transactions</span>
                  </Checkbox>
                </CheckboxGroup>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancePerformance;
import useOrders from '@/app/hooks/useOrders';
import React, { useState } from 'react';
import SmallHeightLoading from '../shared/Loading/SmallHeightLoading';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const FinancePerformance = () => {
  const [orderList, isOrderPending] = useOrders();
  const [selected, setSelected] = useState(['bKash', 'SSLCommerz']);

  // Count the total number of orders for each payment method
  const bKashOrders = orderList?.filter(order => order.paymentMethod === 'bKash').length || 0;
  const sslCommerzOrders = orderList?.filter(order => order.paymentMethod === 'SSLCommerz').length || 0;

  // Filter data based on selected payment methods
  const data = [
    selected.includes('bKash') && { paymentMethod: 'bKash', bKashTotal: bKashOrders, sslCommerzTotal: 0 },
    selected.includes('SSLCommerz') && { paymentMethod: 'SSLCommerz', bKashTotal: 0, sslCommerzTotal: sslCommerzOrders }
  ].filter(Boolean); // Filter out any null or undefined values from the array

  const handleChange = (values) => {
    // Ensure at least one checkbox is always selected
    if (values.length === 0) return;
    setSelected(values);
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const paymentMethod = payload[0].payload.paymentMethod; // Retrieve the payment method
      const bKashTotal = payload[0].payload.bKashTotal;
      const sslCommerzTotal = payload[0].payload.sslCommerzTotal;

      return (
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-xs">
          <p className="font-semibold text-gray-700 text-sm mb-2">
            {paymentMethod === 'bKash' ? 'bKash Payment' : 'SSLCommerz Payment'}
          </p>
          <div className="space-y-2">
            {bKashTotal > 0 && (
              <p className="flex items-center gap-2 justify-between">
                <span>Total Used bKash :</span>
                <span className="font-semibold text-pink-600">{bKashTotal}</span>
              </p>
            )}
            {sslCommerzTotal > 0 && (
              <p className="flex items-center gap-2 justify-between">
                <span>Total Used SSLCommerz : </span>
                <span className="font-semibold text-blue-500">{sslCommerzTotal}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isOrderPending) {
    return <SmallHeightLoading />;
  }

  return (
    <div className='flex flex-col lg:flex-row items-center justify-center gap-6 mt-12'>

      {/* Summary Section */}
      <div className='flex lg:flex-col xl:flex-row items-center justify-center gap-6 w-full lg:w-1/3 xl:w-3/4 lg:min-h-[150px] lg:max-h-[150px]'>
        <div className="border rounded-lg p-4 md:p-8 space-y-3">
          <p className="text-[10px] md:text-sm xl:text-base font-semibold">Number of bKash Transactions</p>
          <h3 className="font-bold md:text-xl lg:text-2xl xl:text-3xl">{bKashOrders}</h3>
        </div>
        <div className="border rounded-lg p-4 md:p-8 space-y-3">
          <p className="text-[10px] md:text-sm xl:text-base font-semibold">Number of SSLCommerz Transactions</p>
          <h3 className="font-bold md:text-xl lg:text-2xl xl:text-3xl flex items-center gap-0 md:gap-1">
            {sslCommerzOrders}
          </h3>
        </div>
      </div>

      <div className='w-full'>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="paymentMethod" />
            <YAxis domain={[0, Math.max(bKashOrders, sslCommerzOrders) + 5]} /> {/* Adjust Y-axis domain */}
            <Tooltip content={customTooltip} /> {/* Custom tooltip to show only relevant data */}

            {selected.includes('bKash') && (
              <Bar dataKey="bKashTotal" name="bKash Transactions" fill="#D2016E" radius={[8, 8, 0, 0]} />
            )}
            {selected.includes('SSLCommerz') && (
              <Bar dataKey="sslCommerzTotal" name="SSLCommerz Transactions" fill="#3480A3" radius={[8, 8, 0, 0]} />
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
    </div>
  );
};

export default FinancePerformance;
"use client";
import Loading from '@/app/components/shared/Loading/Loading';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import usePromoCodes from '@/app/hooks/usePromoCodes';
import { Button, Switch } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

const Discounts = () => {

  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const [promoList, isPromoPending, refetch] = usePromoCodes();

  const handleDelete = async (id) => {
    try {
      const res = await axiosPublic.delete(`/deletePromo/${id}`);
      if (res?.data?.deletedCount) {
        refetch();
        toast.success('Promo deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete promo. Please try again!');
    }
  }

  if (isPromoPending) {
    return <Loading />
  }

  return (
    <div className='max-w-screen-2xl px-0 md:px-6 mx-auto'>

      <div>

        <div className='sticky top-0 z-10 flex justify-end mt-6'>

          <h3 className='w-full text-center md:text-start font-medium md:font-semibold text-[13px] md:text-xl lg:text-2xl'>Active Promos</h3>

          <Button onClick={() => router.push('/dash-board/discounts/add-discount')} className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg py-2 px-4 text-sm md:text-base rounded-md cursor-pointer font-medium mx-6 md:mx-4'>
            New Promo
          </Button>

        </div>

        {/* table content */}
        <div className="max-w-screen-2xl mx-auto custom-max-h overflow-x-auto my-6 modal-body-scroll">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-[1] shadow-md">
              <tr>

                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Promo Code</th>

                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Discount Type</th>

                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Discount Value</th>

                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Expiry Date</th>

                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Action</th>

                <th className="text-[10px] md:text-xs p-2 xl:p-3 text-gray-700 border-b border-gray-300">Status</th>


              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoList?.map((promo, index) => (
                <tr key={promo?._id || index} className="hover:bg-gray-50 transition-colors">

                  <td className="text-xs p-3 text-gray-700 font-mono">
                    {promo?.promoCode}
                  </td>

                  <td className="text-xs p-3 text-gray-700">
                    {promo?.discountType}
                  </td>

                  <td className="text-xs p-3 text-gray-700">
                    {promo?.discountValue}
                  </td>

                  <td className="text-xs p-3 text-gray-700">
                    {promo?.expiryDate}
                  </td>

                  <td className="text-xs p-3 text-gray-700">
                    <div className='flex items-center -ml-3'>
                      {/* Edit Button */}
                      <Button onClick={() => router.push(`/dash-board/discounts/${promo._id}`)} variant="light" color="primary" size='sm'>
                        <FaRegEdit size={22} />
                      </Button>
                      {/* Delete Button */}
                      <Button onClick={() => handleDelete(promo._id)} color="danger" variant="light" size='sm'>
                        <RiDeleteBinLine size={22} />
                      </Button>
                    </div>
                  </td>

                  <td className="text-xs p-3 text-gray-700">
                    <Switch defaultSelected aria-label="Automatic updates" />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default Discounts;
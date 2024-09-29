import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import usePaymentMethods from '@/app/hooks/usePaymentMethods';
import React from 'react';
import Loading from '../shared/Loading/Loading';
import toast from 'react-hot-toast';
import CustomSwitchPaymentMethod from './CustomSwitchPaymentMethod';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlusCircle } from 'react-icons/fa';
import MarkdownRenderer from '@/app/utils/Markdown/MarkdownRenderer';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';

const PaymentCard = () => {

  const [paymentMethodList, isPaymentMethodPending, refetch] = usePaymentMethods();
  const axiosPublic = useAxiosPublic();

  // Function to handle the status toggle
  const handleStatusChange = async (id, currentStatus) => {
    try {
      // Find the discount that needs to be updated
      const findPaymentMethod = paymentMethodList?.find(payment => payment?._id === id);
      if (!findPaymentMethod) {
        toast.error('Payment Method not found.');
        return;
      }

      // Exclude the _id field from the discount data
      const { _id, ...rest } = findPaymentMethod;
      const paymentMethodData = { ...rest, status: !currentStatus };

      // Send the update request
      const res = await axiosPublic.put(`/editPaymentMethod/${id}`, paymentMethodData);
      if (res.data.modifiedCount > 0) {
        refetch(); // Refetch the promo list to get the updated data
        toast.success('Status changed successfully!');
      } else {
        toast.error('No changes detected.');
      }
    } catch (error) {
      console.error('Error editing status:', error);
      toast.error('Failed to update status. Please try again!');
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    try {
      const res = await axiosPublic.delete(`/deletePaymentMethod/${id}`);
      if (res?.data?.deletedCount) {
        refetch();
        toast.success('Payment Method Deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete this Payment Method. Please try again!');
    }
  }

  if (isPaymentMethodPending) {
    return <Loading />
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-center gap-6 max-w-screen-2xl mx-auto my-6">
        {
          paymentMethodList?.map((payment, index) => (
            <div key={index} className="flex-1 overflow-hidden rounded-lg shadow transition hover:shadow-lg flex flex-col">
              {/* Set the container to maintain the aspect ratio */}
              {payment?.imageUrl && <div className="relative w-full" style={{ paddingBottom: '38.25%' }}> {/* This maintains a 16:9 aspect ratio */}
                <Image
                  alt="payment method"
                  src={payment?.imageUrl} // Ensure this path is correct
                  layout="fill"
                  className="object-contain" // Ensures the full image is visible
                />
              </div>}
              <div className="bg-white px-4 pt-4 sm:px-6 sm:pt-6 flex flex-col flex-grow">
                <h3 className="mb-0.5 text-xl text-gray-900 font-bold">
                  {payment?.paymentMethodName}
                </h3>
                <p className="text-neutral-500 text-sm pt-2">
                  <MarkdownRenderer content={payment?.paymentDetails} />
                </p>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 pb-6 px-6">
                <div className='flex items-center gap-3'>
                  <span className="text-sm font-medium text-gray-500">
                    Active
                  </span>
                  <CustomSwitchPaymentMethod
                    checked={payment?.status}
                    onChange={() => handleStatusChange(payment?._id, payment?.status)}
                    size="md"
                    color="primary"
                  />
                  <span className={`text-sm font-bold ${payment?.status ? "text-blue-600" : "text-red-600"}`}>
                    {payment?.status ? "Yes" : "NO"}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">

                  <div className="group relative">
                    <button>
                      <RiDeleteBinLine
                        onClick={() => handleDeletePaymentMethod(payment._id)}
                        size={22}
                        className={`text-red-500 hover:text-red-700 transition-transform transform hover:scale-105 hover:duration-200`}
                      />
                    </button>
                    {<span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                      Delete
                    </span>}
                  </div>

                  <div className="group relative">
                    <Link href={`/dash-board/finances/${payment?._id}`}>
                      <MdOutlineModeEdit
                        size={22}
                        className={`text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-105 hover:duration-200`}
                      />
                    </Link>
                    {<span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                      Edit
                    </span>}
                  </div>

                </div>
              </div>
            </div>
          ))
        }
        <div className="flex-1 overflow-hidden rounded-lg shadow transition hover:shadow-lg flex flex-col">
          <Link
            href="/dash-board/finances/add-payment-method"
            className="relative w-full h-60 xl:h-[450px] px-6 2xl:px-14 xl:px-8 border-2 border-dashed border-gray-600 bg-white text-gray-600 font-extrabold rounded-lg shadow-lg flex items-center justify-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 group hover:bg-[#ffddc2] hover:text-gray-800 hover:border-transparent hover:shadow-xl"
          >
            <FaPlusCircle className="transition-transform transform group-hover:scale-110 group-hover:text-gray-800 animate-pulse text-3xl" />
            <span className="relative transition-transform xl:text-xl 2xl:text-2xl duration-300 group-hover:text-gray-800 group-hover:translate-x-2">
              Add Payment Method
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
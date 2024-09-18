import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import usePaymentMethods from '@/app/hooks/usePaymentMethods';
import React from 'react';
import Loading from '../shared/Loading/Loading';
import toast from 'react-hot-toast';
import CustomSwitchPaymentMethod from './CustomSwitchPaymentMethod';
import Image from 'next/image';

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

  if (isPaymentMethodPending) {
    return <Loading />
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6 max-w-screen-lg my-6">
      {
        paymentMethodList?.map((payment, index) => (
          <div key={index} className="flex-1 overflow-hidden rounded-lg shadow transition hover:shadow-lg flex flex-col">
            {/* Set the container to maintain the aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '38.25%' }}> {/* This maintains a 16:9 aspect ratio */}
              <Image
                alt="payment method"
                src={payment?.imageUrl} // Ensure this path is correct
                layout="fill"
                className="object-contain" // Ensures the full image is visible
              />
            </div>
            <div className="bg-white px-4 pt-4 sm:px-6 sm:pt-6 flex flex-col flex-grow">
              <h3 className="mb-0.5 text-xl text-gray-900 font-bold">
                {payment?.heading}
              </h3>
              <p className="text-neutral-500 text-sm flex-grow">
                {payment?.description}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 pb-6 px-6">
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
          </div>
        ))
      }
    </div>
  );
};

export default PaymentCard;
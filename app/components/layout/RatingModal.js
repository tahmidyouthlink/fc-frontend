// "use client";
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import StarRating from './StarRating';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import toast from 'react-hot-toast';

const RatingModal = ({ isOpen, onClose, onSave, initialRating, selectedCustomer }) => {
  const [rating, setRating] = useState(initialRating);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const axiosPublic = useAxiosPublic();

  console.log(selectedCustomer);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true); // Set loading state to true when modal opens

      // Fetch current rating when modal opens
      const fetchRating = async () => {
        try {
          const response = await axiosPublic.get(`/getCustomerRating/${selectedCustomer?.customerId}`);
          setRating(response.data.rating || initialRating);
        } catch (error) {
          console.error('Error fetching rating:', error);
          toast.error('Error fetching rating.');
        } finally {
          setIsLoading(false); // Set loading state to false after fetching
        }
      };

      fetchRating();
    }
  }, [isOpen, axiosPublic, selectedCustomer?.customerId, initialRating]);

  const handleSave = () => {
    onSave(rating); // Call the save function with the current rating
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-semibold">Customer Details</h2>
            <p className="text-gray-500">ID: {selectedCustomer?.customerId}</p>
            <p className="text-gray-500">Name: {selectedCustomer?.customerName}</p>
            <p className="text-gray-500">Email: {selectedCustomer?.email}</p>
            <p className="text-gray-500">Phone: {selectedCustomer?.phoneNumber}</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium mb-2">Rate {selectedCustomer?.customerName}</h3>
            {!isLoading ? (
              <StarRating
                rating={rating}
                onRatingChange={(newRating) => setRating(newRating)}
              />
            ) : (
              <p>Loading...</p> // Optionally, you can display a loading indicator
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSave} color="primary" disabled={isLoading}>
            Save Rating
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RatingModal;
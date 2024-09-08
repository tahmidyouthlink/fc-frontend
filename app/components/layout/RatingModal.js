import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';
import FlagRating from './FlagRating';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';

const RatingModal = ({ isOpen, onClose, onSave, initialRating, selectedCustomer }) => {
  const [rating, setRating] = useState(initialRating);
  const [isLoading, setIsLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const fetchRating = async () => {
        try {
          const response = await axiosPublic.get(`/getCustomerRating/${selectedCustomer?.customerId}`);
          setRating(response.data.rating || initialRating);
        } catch (error) {
          console.error('Error fetching rating:', error);
          toast.error('Error fetching rating.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchRating();
    }
  }, [isOpen, axiosPublic, selectedCustomer?.customerId, initialRating]);

  const handleSave = () => {
    onSave(rating);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalContent>
        <ModalBody>
          <div className="flex flex-col items-center">
            {!isLoading ? (
              <FlagRating
                rating={rating} // Show the selected color initially
                onRatingChange={(newRating) => setRating(newRating)} // Update rating on click
              />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSave} color="primary" disabled={isLoading} size='sm'>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RatingModal;
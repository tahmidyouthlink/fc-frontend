"use client";
import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';

const PromoDetailsModal = ({ isModalOpen, setIsModalOpen, totalPromoApplied, totalAmountDiscounted, promo }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      size="lg" // Changed size for a more spacious look
      aria-labelledby="promo-details-modal-title"
      className="mx-4 lg:mx-0" // Adjust margins as needed
    >
      <ModalContent>
        <ModalBody>
          <h2 id="promo-details-modal-title" className="text-xl font-semibold mb-4 text-center">
            Promo Details
          </h2>
          <div className="flex flex-col space-y-4 px-4">
            <p className="text-base"><strong>Total Promo Applied:</strong> {totalPromoApplied}</p>
            <p className="text-base"><strong>Total Amount Discounted:</strong> ৳ {totalAmountDiscounted}</p>
            <p className="text-base"><strong>Minimum Order Amount:</strong> ৳ {promo?.minAmount || 'Not Specified'}</p>
            <p className="text-base"><strong>Maximum Capped Amount:</strong> ৳ {promo?.maxAmount || 'Not Specified'}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsModalOpen(false)} color="danger" size="sm">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PromoDetailsModal;
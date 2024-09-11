"use client";
import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';

const PromoDetailsModal = ({
  isModalOpen,
  setIsModalOpen,
  totalPromoApplied,
  totalOfferApplied,
  totalAmountDiscounted,
  totalOfferAmountDiscounted,
  promo,
  offer
}) => {
  const isPromoSelected = !!promo; // Check if promo is selected
  const isOfferSelected = !!offer; // Check if offer is selected

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      size="sm"
      className="mx-4 lg:mx-0" // Adjust margins as needed
    >
      <ModalContent>
        <ModalBody>
          <h2 className="text-xl font-semibold mt-6 ml-4">
            {isPromoSelected ? 'Promo Details' : 'Offer Details'}
          </h2>
          <div className="flex flex-col space-y-1 px-4">
            {isPromoSelected && (
              <>
                <p className="text-base"><strong>Total Promo Applied :</strong> {totalPromoApplied}</p>
                <p className="text-base"><strong>Total Amount Discounted :</strong> ৳ {totalAmountDiscounted}</p>
                <p className="text-base"><strong>Minimum Order Amount :</strong> ৳ {promo?.minAmount || '0'}</p>
                <p className="text-base"><strong>Maximum Capped Amount :</strong> ৳ {promo?.maxAmount || '0'}</p>
              </>
            )}
            {isOfferSelected && (
              <>
                <p className="text-base"><strong>Total Offer Applied :</strong> {totalOfferApplied}</p>
                <p className="text-base"><strong>Total Amount Discounted :</strong> ৳ {totalOfferAmountDiscounted}</p>
                <p className="text-base"><strong>Minimum Order Amount :</strong> ৳ {offer?.minAmount || '0'}</p>
                <p className="text-base"><strong>Maximum Capped Amount :</strong> ৳ {offer?.maxAmount || '0'}</p>
              </>
            )}
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
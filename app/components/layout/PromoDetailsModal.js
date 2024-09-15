"use client";
import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';
import dynamic from "next/dynamic";
import Image from 'next/image';

const MarkdownPreview = dynamic(() => import("@/app/utils/Markdown/MarkdownPreview"), { ssr: false },);

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
      size="2xl"
      className="mx-4 lg:mx-0" // Adjust margins as needed
    >
      <ModalContent>
        <ModalBody className='modal-body-scroll'>
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
                <div className='flex items-center justify-center mb-4'>
                  <Image className='h-[150px] w-[150px] rounded-lg' src={offer?.imageUrl} alt={offer?.imageUrl} height={200} width={1800} />
                </div>
                <p className="text-base"><strong>Offer Title :</strong> {offer?.offerTitle}</p>
                <p className="text-base"><strong>Total Offer Applied :</strong> {totalOfferApplied}</p>
                <p className="text-base"><strong>Total Amount Discounted :</strong> ৳ {totalOfferAmountDiscounted}</p>
                <p className="text-base"><strong>Minimum Order Amount :</strong> ৳ {offer?.minAmount || '0'}</p>
                <p className="text-base"><strong>Maximum Capped Amount :</strong> ৳ {offer?.maxAmount || '0'}</p>
                <div className="text-base flex items-center gap-2">
                  <strong>Offer Related Categories:</strong>
                  <div className='flex gap-0.5 items-center'>
                    {offer?.selectedCategories?.map((category, index) => (
                      <div key={index}>{category}{index < offer?.selectedCategories?.length - 1 ? ', ' : ''}</div>
                    ))}
                  </div>
                </div>
                <div className="text-base flex flex-col"><p className='text-center font-bold mt-2'>Offer Description :</p><p><MarkdownPreview content={offer.offerDescription} /></p></div>
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
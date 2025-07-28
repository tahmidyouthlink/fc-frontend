"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import sslczMobileImg from "@/public/payment-methods/sslcz-payment-methods-mobile.webp";
import sslczDesktopImg from "@/public/payment-methods/sslcz-payment-methods-desktop.webp";

export default function MorePaymentMethods() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <button
        className="text-center text-xs/[28px] font-bold text-neutral-600 lg:text-[13px]/[28px]"
        onClick={() => setIsModalOpen(true)}
      >
        More...
      </button>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        size="5xl"
        scrollBehavior="inside"
        className="rounded-md"
        classNames={{
          base: "sm:max-w-[90%]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>ALL SECURE PAYMENT METHODS</ModalHeader>
              <ModalBody className="-mt-5">
                <p className="mb-5 text-sm text-neutral-500">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
                  ullam aliquid consequatur.
                </p>
                {/* Mobile Image */}
                <Image
                  src={sslczMobileImg}
                  alt="All secure payment methods"
                  className="h-auto w-full object-contain md:hidden"
                />
                {/* Desktop Image */}
                <Image
                  src={sslczDesktopImg}
                  alt="All secure payment methods"
                  className="h-auto w-full object-contain max-md:hidden"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="rounded-[4px]"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

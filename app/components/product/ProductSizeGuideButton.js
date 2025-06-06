import Image from "next/image";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { CgRuler } from "react-icons/cg";

export default function ProductSizeGuideButton({ sizeGuideImageUrl }) {
  const [isSizeGuideModalOpen, setIsSizeGuideModalOpen] = useState(false);

  return (
    <>
      {/* Size Guide Button */}
      <Button
        endContent={<CgRuler />}
        disableRipple
        className="bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-700)]"
        onClick={() => setIsSizeGuideModalOpen(true)}
      >
        Size Guide
      </Button>
      {/* Size Guide Modal */}
      <Modal
        isOpen={isSizeGuideModalOpen}
        onOpenChange={setIsSizeGuideModalOpen}
        size="3xl"
        scrollBehavior="inside"
        className="rounded-md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>SIZE GUIDE</ModalHeader>
              <ModalBody className="-mt-5">
                <p className="mb-5 text-sm text-neutral-500">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
                  ullam aliquid consequatur.
                </p>
                <Image
                  src={sizeGuideImageUrl}
                  alt="Size guide"
                  className="h-auto w-full object-contain"
                  width={0}
                  height={0}
                  sizes="50vw"
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

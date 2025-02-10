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
        className="bg-[#E0FCDC] hover:bg-[#C1F7B9]"
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
                <Button color="danger" variant="light" onPress={onClose}>
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

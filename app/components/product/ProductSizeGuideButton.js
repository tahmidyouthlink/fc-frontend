import Image from "next/image";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Skeleton,
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
                <div className="relative h-auto min-h-[20dvh] w-full sm:min-h-[25dvh] xl:min-h-[33.33dvh]">
                  <Skeleton className="absolute inset-0 z-[0] h-full w-full rounded-md" />
                  <Image
                    src={sizeGuideImageUrl}
                    alt="Size guide"
                    className="relative h-auto w-full object-contain"
                    width={0}
                    height={0}
                    sizes="(max-width: 1280px) 100dvh, 100dvw"
                  />
                </div>
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

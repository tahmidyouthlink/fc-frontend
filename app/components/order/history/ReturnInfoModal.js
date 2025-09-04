import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { LuMessagesSquare } from "react-icons/lu";
import ReturnInfoModalInfo from "./ReturnInfoModalInfo";
import ReturnInfoModalItems from "./ReturnInfoModalItems";
import ReturnInfoModalProofImages from "./ReturnInfoModalProofImages";

export default function ReturnInfoModal({
  isReturnInfoModalOpen,
  setIsReturnInfoModalOpen,
  activeReturnOrder,
}) {
  const { orderNumber, orderStatus, returnInfo } = activeReturnOrder || {};

  return (
    <Modal
      isOpen={isReturnInfoModalOpen}
      onOpenChange={setIsReturnInfoModalOpen}
      size="xl"
      scrollBehavior="inside"
      className="rounded-md"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="uppercase">
              Return Order Overview
            </ModalHeader>
            <ModalBody className="-mt-5">
              <p className="mb-5 text-sm text-neutral-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo rem
                minus vel blanditiis incidunt ex obcaecati eaque.
              </p>
              <ReturnInfoModalInfo
                orderStatus={orderStatus}
                returnInfo={returnInfo}
              />
              <ReturnInfoModalItems returnProducts={returnInfo?.products} />
              <ReturnInfoModalProofImages
                returnProofImgUrls={returnInfo?.imgUrls}
              />
            </ModalBody>
            <ModalFooter>
              {orderStatus === "Request Declined" && (
                <a
                  href={`/contact-us?orderNumber=${orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-2 rounded-[4px] bg-[var(--color-primary-500)] px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
                >
                  Contact Us
                  <LuMessagesSquare size={17} />
                </a>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

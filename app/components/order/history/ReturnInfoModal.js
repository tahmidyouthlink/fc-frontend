import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { LuMessagesSquare } from "react-icons/lu";
import TransitionLink from "../../ui/TransitionLink";
import ReturnInfoModalInfo from "./ReturnInfoModalInfo";
import ReturnInfoModalItems from "./ReturnInfoModalItems";
import ReturnInfoModalProofImages from "./ReturnInfoModalProofImages";

export default function ReturnInfoModal({
  isReturnInfoModalOpen,
  setIsReturnInfoModalOpen,
  activeReturnOrder,
}) {
  const { orderStatus, returnInfo, declinedReason } = activeReturnOrder || {};

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
                declinedReason={declinedReason}
              />
              <ReturnInfoModalItems returnProducts={returnInfo?.products} />
              <ReturnInfoModalProofImages
                returnProofImgUrls={returnInfo?.imgUrls}
              />
            </ModalBody>
            <ModalFooter>
              <TransitionLink
                href="/contact-us"
                className="flex w-fit items-center gap-2 rounded-[4px] bg-[var(--color-primary-500)] px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
              >
                Contact Us
                <LuMessagesSquare size={17} />
              </TransitionLink>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

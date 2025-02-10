import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { HiOutlineMapPin } from "react-icons/hi2";

export default function CheckoutSelectDeliveryAddress({
  deliveryAddresses,
  reset,
}) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <button
        type="button"
        className="flex items-center gap-1.5 text-nowrap rounded-md bg-[#d4ffce] p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[#bdf6b4]"
        onClick={() => setIsAddressModalOpen(true)}
      >
        <HiOutlineMapPin className="text-base" />
        Select Address
      </button>
      {/* Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="uppercase">Select Address</ModalHeader>
              <ModalBody>
                {deliveryAddresses.map((address, addressIndex) => {
                  return (
                    <div
                      key={address.id}
                      className="w-full cursor-pointer space-y-4 rounded-md border-2 border-neutral-100 p-4 text-neutral-500 transition-[border-color] duration-300 ease-in-out hover:border-green-600/50 [&_:is(h3,h4)]:text-neutral-700 [&_h3]:text-base [&_h4]:text-sm [&_p]:text-[13px]"
                      onClick={() => {
                        reset({
                          addressLineOne: address.address1,
                          addressLineTwo: address.address2,
                          city: address.city,
                          postalCode: address.postalCode,
                        });
                        setIsAddressModalOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 text-base font-semibold md:text-lg">
                        <h3>
                          Address #{addressIndex + 1}
                          {!!address?.nickname ? ": " + address.nickname : ""}
                        </h3>
                      </div>
                      <div className="space-y-6">
                        <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                          <div className="w-full space-y-2 font-semibold">
                            <h4>Address Line 1</h4>
                            <p>{address?.address1}</p>
                          </div>
                          <div className="w-full space-y-2 font-semibold">
                            <h4>Address Line 2</h4>
                            <p>{address?.address2 || "--"}</p>
                          </div>
                        </div>
                        <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
                          <div className="w-full space-y-2 font-semibold">
                            <h4>City</h4>
                            <p>{address?.city}</p>
                          </div>
                          <div className="w-full space-y-2 font-semibold">
                            <h4>Postal Code</h4>
                            <p>{address?.postalCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

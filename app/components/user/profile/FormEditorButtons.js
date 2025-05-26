import {
  RiCloseLine,
  RiDeleteBin7Line,
  RiEditLine,
  RiSaveLine,
  RiDeleteBin6Line,
  RiStarLine,
} from "react-icons/ri";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";

export default function FormEditorButtons({
  type,
  isEditingForm,
  setIsEditingForm,
  setIsAddingNewAddress,
  isPrimary,
  handlePrimarySelection,
  handleAddressDelete,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (type === "update")
    // If this delivery address is old/updatable
    return isEditingForm ? (
      // Display canel and save buttons if form is being edited
      <div className="user-into-form-buttons">
        <button className="bg-[var(--color-primary-regular)] hover:bg-[var(--color-primary-dark)]">
          <RiSaveLine />
          <p>Save</p>
        </button>
        <button
          type="button"
          className="bg-neutral-100 hover:bg-neutral-200"
          onClick={() => setIsEditingForm(false)}
        >
          <RiCloseLine />
          <p>Cancel</p>
        </button>
      </div>
    ) : (
      // Display delete and edit buttons if form is not being edited
      <>
        {/* Buttons */}
        <div className="user-into-form-buttons">
          {!isPrimary && (
            <button
              type="button"
              className="bg-[var(--color-primary-regular)] hover:bg-[var(--color-primary-dark)]"
              onClick={() => handlePrimarySelection()}
            >
              <RiStarLine />
              <p className="whitespace-nowrap">Make Primary</p>
            </button>
          )}
          <button
            type="button"
            className="bg-red-50 hover:bg-red-100"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <RiDeleteBin7Line />
            <p>Delete</p>
          </button>
          <button
            type="button"
            className="bg-neutral-100 hover:bg-neutral-200"
            onClick={() => setIsEditingForm(true)}
          >
            <RiEditLine />
            <p>Edit</p>
          </button>
        </div>
        {/* Modal for delete confirmation */}
        <Modal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          size="xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="mx-auto mb-6 mt-10 max-w-lg [&>*]:mx-auto [&>*]:w-fit">
                    <RiDeleteBin6Line className="size-24 text-[var(--color-secondary-regular)]" />
                    <h4 className="mt-6 text-lg font-semibold text-neutral-600 hover:text-neutral-700">
                      Are your sure you want to delete this address?
                    </h4>
                    <p className="mt-2 text-center text-neutral-500 md:text-sm [&_p]:text-xs">
                      This address will be permanently removed from our
                      database. However, you can always add new addresses or
                      edit the existing addresses.
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="button"
                    className="rounded-lg bg-neutral-50 px-5 py-3 font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-neutral-100 hover:text-neutral-700 md:text-sm [&_p]:text-xs"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      handleAddressDelete();
                      setIsDeleteModalOpen(false);
                    }}
                    endContent={<RiDeleteBin6Line />}
                    className="rounded-lg bg-[var(--color-primary-regular)] px-5 py-3 font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-[var(--color-primary-dark)] hover:text-neutral-700 md:text-sm [&_p]:text-xs"
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  // If this delivery address is new
  else
    return (
      <div className="user-into-form-buttons">
        <button className="bg-[var(--color-primary-regular)] hover:bg-[var(--color-primary-dark)]">
          <RiSaveLine />
          <p>Save</p>
        </button>
        <button
          type="button"
          className="bg-neutral-100 hover:bg-neutral-200"
          onClick={() => setIsAddingNewAddress(false)}
        >
          <RiCloseLine />
          <p>Cancel</p>
        </button>
      </div>
    );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";

export default function CheckoutForgotPassword({ setIsPageLoading }) {
  const axiosPublic = useAxiosPublic();
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const {
    register: registerForForgotPassword,
    handleSubmit: handleSubmitForForgotPassword,
    reset: resetForForgotPassword,
    formState: { errors: errorsForForgotPassword },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  // Function that handles form submission (send password reset email)
  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      const response = await axiosPublic.put("/request-password-reset", data);

      if (response.data.success) {
        resetForForgotPassword(); // Reset form
        toast.success(response.data.message);
        setIsForgotPasswordModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsPageLoading(false);
    }
  };

  // Function that handles form submission error (displays error messages)
  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please enter your email address.");
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide email address.");
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsForgotPasswordModalOpen(true)}
        className="text-xs font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
      >
        Forgot password?
      </button>
      <Modal
        isOpen={isForgotPasswordModalOpen}
        onOpenChange={setIsForgotPasswordModalOpen}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reset Password
              </ModalHeader>
              <ModalBody className="-mt-5">
                <p className="mb-5 text-sm text-neutral-500">
                  Provide your email address to reset password.
                </p>
                <form
                  noValidate
                  onSubmit={handleSubmitForForgotPassword(onSubmit, onError)}
                  className="w-full"
                >
                  <div className="w-full space-y-2 font-semibold">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john.doe@gmail.com"
                      autoComplete="email"
                      {...registerForForgotPassword("email", {
                        pattern: {
                          value:
                            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/,
                          message: "Email is not valid.",
                        },
                        required: {
                          value: true,
                          message: "Email is required.",
                        },
                      })}
                      className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
                      required
                    />
                    {/* Email Error Message */}
                    {errorsForForgotPassword.email && (
                      <p className="text-xs font-semibold text-red-500">
                        {errorsForForgotPassword.email?.message}
                      </p>
                    )}
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  onClick={() =>
                    handleSubmitForForgotPassword(onSubmit, onError)()
                  }
                  className="rounded-lg bg-[#d4ffce] px-5 py-3 text-xs font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-[#bdf6b4] hover:text-neutral-700 md:text-sm"
                >
                  Send Email
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

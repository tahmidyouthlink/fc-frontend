import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import GoogleSignInButton from "./GoogleSignInButton";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function AuthModal({
  heading,
  subheading,
  isAuthModalOpen,
  setIsAuthModalOpen,
  modalContent,
  setModalContent,
}) {
  return (
    <Modal
      isOpen={isAuthModalOpen}
      onOpenChange={setIsAuthModalOpen}
      size="md"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="uppercase">{heading}</ModalHeader>
            <ModalBody className="custom-desktop-scrollbar -mt-4 pb-5">
              <p className="mb-1 text-sm text-neutral-500">{subheading}</p>
              {/* Login/register/forgot password form */}
              {modalContent === "register" ? (
                <RegisterForm
                  setModalContent={setModalContent}
                  setIsAuthModalOpen={setIsAuthModalOpen}
                />
              ) : modalContent === "forgotPassword" ? (
                <ForgotPasswordForm setIsAuthModalOpen={setIsAuthModalOpen} />
              ) : (
                <LoginForm
                  setModalContent={setModalContent}
                  setIsAuthModalOpen={setIsAuthModalOpen}
                />
              )}
              {modalContent !== "forgotPassword" ? (
                <>
                  {/* Divider with "or" text between sign in methods (email and google) */}
                  <div className="my-4 flex items-center gap-3.5">
                    <hr className="h-0.5 w-full bg-neutral-100" />
                    <p className="text-xs md:text-sm">or</p>
                    <hr className="h-0.5 w-full bg-neutral-100" />
                  </div>
                  <GoogleSignInButton
                    ctaText={`Sign ${modalContent === "register" ? "up" : "in"} with Google`}
                    isAuthModalOpen={isAuthModalOpen}
                    setIsAuthModalOpen={setIsAuthModalOpen}
                  />
                </>
              ) : (
                /* Register page link if user doesn't have an account */
                <p className="mt-2 text-xs md:text-sm">
                  Don`&apos;`t have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
                    onClick={() => setModalContent("register")}
                  >
                    Register
                  </button>
                </p>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

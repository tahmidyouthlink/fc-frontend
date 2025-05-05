import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  PiTruckLight,
  PiSignInLight,
  PiSignOutLight,
  PiPackageLight,
  PiUserLight,
  PiUserCirclePlusLight,
} from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import TransitionLink from "@/app/components/ui/TransitionLink";
import createErrorMessage from "@/app/utils/createErrorMessage";
import {
  forgotPasswordContent,
  loginContent,
  registerContent,
} from "@/app/data/authContents";
import AuthModal from "../auth/AuthModal";

export default function UserDropdown() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setIsPageLoading } = useLoading();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");

  const handleSignOut = async () => {
    setIsPageLoading(true);

    try {
      await signOut({ redirect: false });
      if (pathname.includes("user") || pathname.includes("checkout"))
        router.push("/");
      localStorage.removeItem("checkoutFormDraft");
      localStorage.removeItem("cartItems");
      window.dispatchEvent(new Event("storageCart"));
      localStorage.removeItem("wishlistItems");
      window.dispatchEvent(new Event("storageWishlist"));
      toast.success("Successfully logged out.");
    } catch (error) {
      toast.error(createErrorMessage(error));
    }

    setIsPageLoading(false);
  };

  return (
    <>
      <Dropdown placement="bottom-end" className="mt-5 sm:mt-6 xl:mt-7">
        <DropdownTrigger className="z-[0]">
          <span className="cursor-pointer">
            <IoPersonOutline className="size-[18px] text-neutral-600 lg:size-[22px]" />
          </span>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          {!!user && (
            <DropdownSection title="You're signed in as" showDivider>
              <DropdownItem
                key="profile"
                isReadOnly
                className="cursor-default [&_*]:w-fit [&_*]:cursor-text [&_*]:font-semibold"
              >
                <h5 className="text-sm text-neutral-600">{user.name}</h5>
                <p className="-mt-0.5 text-[11px] text-neutral-500">
                  {user.email}
                </p>
              </DropdownItem>
            </DropdownSection>
          )}
          <DropdownSection title="Order" showDivider>
            <DropdownItem
              key="order-tracking"
              textValue="order-tracking"
              startContent={<PiTruckLight />}
              className="relative"
            >
              Order Tracking
              <TransitionLink
                className="absolute inset-0"
                href="/order-tracking"
              ></TransitionLink>
            </DropdownItem>
            {!!user && (
              <DropdownItem
                key="orders"
                textValue="orders"
                startContent={<PiPackageLight />}
                className="relative"
              >
                Order History
                <TransitionLink
                  className="absolute inset-0"
                  href="/user/orders"
                ></TransitionLink>
              </DropdownItem>
            )}
          </DropdownSection>
          <DropdownSection title="User">
            {!!user && (
              <DropdownItem
                key="profile"
                textValue="profile"
                startContent={<PiUserLight />}
                className="relative"
              >
                User Profile
                <TransitionLink
                  className="absolute inset-0"
                  href="/user/profile"
                ></TransitionLink>
              </DropdownItem>
            )}
            {!user && (
              <DropdownItem
                key="login"
                textValue="login"
                startContent={<PiSignInLight />}
                onClick={() => {
                  setModalContent("login");
                  setIsAuthModalOpen(true);
                }}
              >
                Sign In
              </DropdownItem>
            )}
            {!user && (
              <DropdownItem
                key="register"
                textValue="register"
                startContent={<PiUserCirclePlusLight />}
                onClick={() => {
                  setModalContent("register");
                  setIsAuthModalOpen(true);
                }}
              >
                Sign Up
              </DropdownItem>
            )}
            {!!user && (
              <DropdownItem
                startContent={<PiSignOutLight />}
                key="logout"
                textValue="logout"
                color="danger"
                onClick={handleSignOut}
              >
                Sign Out
              </DropdownItem>
            )}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <AuthModal
        {...(modalContent === "login"
          ? loginContent
          : modalContent === "register"
            ? registerContent
            : forgotPasswordContent)}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        modalContent={modalContent}
        setModalContent={setModalContent}
      />
    </>
  );
}

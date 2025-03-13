"use client";
import { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import SideNavbar from "./SideNavbar";
import { RxAvatar } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { Avatar, AvatarIcon, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react";
import { PiSignOutLight } from "react-icons/pi";
import TransitionLink from "../ui/TransitionLink";
import { CiLock } from "react-icons/ci";
import Loading from "../shared/Loading/Loading";
import { useAuth } from "@/app/contexts/auth";
import { signOut, useSession } from "next-auth/react";

const DashboardNavbar = () => {
  const [isToggle, setIsToggle] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { existingUserData, isUserLoading } = useAuth();

  const handleClose = () => setIsToggle(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/restricted-access");
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setIsToggle(false);
    };

    router?.events?.on("routeChangeStart", handleRouteChange);
    return () => {
      router?.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router?.events]);

  useEffect(() => {
    if (isToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isToggle]);

  // Show loading state if data is not loaded yet
  if (isUserLoading || !existingUserData || status === "loading") {
    return <Loading />; // Or you can use any other custom loading spinner
  };

  return (
    <div>

      <div className="bg-gray-50">
        {/* Top Navbar - XL to 2XL Device */}
        <div className="max-w-screen-2xl mx-auto hidden xl:flex items-center justify-between px-4 pt-2 pb-1">

          <div>

          </div>
          {status === "authenticated" &&
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  size="sm"
                  className="transition-transform"
                  icon={<AvatarIcon />}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem showDivider key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Logged in as</p>
                  <p className="font-semibold">{existingUserData?.email}</p>
                </DropdownItem>
                {session && (
                  <DropdownItem
                    key="Update Password"
                    textValue="Update Password"
                    startContent={<CiLock />}
                    className="relative"
                  >
                    Update Password
                    <TransitionLink
                      className="absolute inset-0"
                      href="/dash-board/password-change"
                    ></TransitionLink>
                  </DropdownItem>
                )}

                {session && (
                  <DropdownItem
                    startContent={<PiSignOutLight />}
                    key="logout"
                    textValue="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    Log Out
                  </DropdownItem>
                )}

              </DropdownMenu>
            </Dropdown>
          }

        </div>
      </div>

      {/* Top Navbar - Large to Mobile Device*/}
      <div className="flex items-center justify-between px-4 py-3 xl:hidden">
        <button className="duration-300 p-2" onClick={() => setIsToggle(!isToggle)}>
          {!isToggle && <CgMenuLeft size={20} />}
        </button>

        {status === "authenticated" &&
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                icon={<AvatarIcon />}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem showDivider key="profile" className="h-14 gap-2">
                <p className="font-semibold">Logged in as</p>
                <p className="font-semibold">{existingUserData?.email}</p>
              </DropdownItem>
              {session && (
                <DropdownItem
                  key="Update Password"
                  textValue="Update Password"
                  startContent={<CiLock />}
                  className="relative"
                >
                  Update Password
                  <TransitionLink
                    className="absolute inset-0"
                    href="/dash-board/password-change"
                  ></TransitionLink>
                </DropdownItem>
              )}

              {session && (
                <DropdownItem
                  startContent={<PiSignOutLight />}
                  key="logout"
                  textValue="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              )}

            </DropdownMenu>
          </Dropdown>
        }

      </div>

      {/* Sidebar - only visible when toggled on small screens */}
      {isToggle && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 bg-black opacity-30 xl:hidden" onClick={handleClose}></div>

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 h-full bg-white shadow-lg transition-transform transform xl:hidden"
            style={{ transform: isToggle ? "translateX(0)" : "translateX(-100%)" }}>
            <SideNavbar onClose={handleClose} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardNavbar;
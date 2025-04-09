"use client";
import React, { useEffect, useState } from 'react';
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import { MdBlock } from "react-icons/md";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import Loading from '@/app/components/shared/Loading/Loading';
import useExistingUsers from '@/app/hooks/useExistingUsers';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaCheckCircle, FaExclamationCircle, FaRedo } from 'react-icons/fa';
import { FaCheck, FaClock } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import TabsForSettings from '@/app/components/layout/TabsForSettings';
import EnrollmentForm from '@/app/components/layout/EnrollmentForm';
import { Accordion, AccordionItem, Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { permissionsList as initialPermissions } from "@/permissionList";

const roles = ["Viewer", "Editor", "Owner"];

const EnrollmentPage = () => {

  const axiosPublic = useAxiosPublic();
  const [activeTab, setActiveTab] = useState('Create User');
  const [existingUsers, isExistingUsersPending, refetch] = useExistingUsers();
  const tabs = ["Create User", "Existing Users"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false); // State for "Select All" checkbox
  const [id, setId] = useState("");

  // Ensure the code runs only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTabCreateUserPage');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Save the activeTab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTabCreateUserPage', activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    setSelectAllChecked(Object.values(permissions).every(permission => permission.access));
  }, [permissions]);

  const handleResendInvitationMail = async (email, fullName, role) => {

    Swal.fire({
      title: "Resend Email Confirmation",
      text: "Are you sure you want to resend this email? The recipient will receive another email.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, resend it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          const resendInformation = {
            fullName,
            email,
            role,
          };

          const response = await axiosPublic.post('/invite', resendInformation);

          if (response.data.success) {
            // ✅ Show success toast if the invitation is successfully sent
            toast.custom((t) => (
              <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
              >
                <div className="pl-6">
                  <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
                </div>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-base font-bold text-gray-900">
                        {`Invitation resent to ${email}`}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {response?.data?.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
            ), {
              position: "bottom-right",
              duration: 5000
            });

            refetch(); // Refresh the user list if necessary

          } else {

            // ✅ Show error toast if the invitation is not successfully sent
            toast.custom((t) => (
              <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
              >
                <div className="pl-6">
                  <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
                </div>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-base font-bold text-gray-900">
                        Failed to resend invitation to ${email}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {response?.data?.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
            ), {
              position: "bottom-right",
              duration: 5000
            });

          }
        } catch (error) {
          // ❌ Show error toast when something goes wrong
          toast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
            >
              <div className="pl-6">
                <RxCross2 className="h-6 w-6 bg-red-500 text-white rounded-full" />
              </div>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-base font-bold text-gray-900">
                      Failed to resend invitation to ${email}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {error.response?.data?.message || error?.response?.data?.error}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
                >
                  <RxCross2 />
                </button>
              </div>
            </div>
          ), {
            position: "bottom-right",
            duration: 5000
          });
        }
      }
    });

  };

  const handleRemoveUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.delete(`/delete-existing-user/${userId}`);
          if (res?.data?.deletedCount) {
            refetch(); // Call your refetch function to refresh data
            toast.custom((t) => (
              <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
              >
                <div className="pl-6">
                  <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
                </div>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-base font-bold text-gray-900">
                        User Removed!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        User has been removed successfully!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-text-700 focus:outline-none text-2xl"
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
            ), {
              position: "bottom-right",
              duration: 5000
            })
          }
        } catch (error) {
          toast.error('Failed to delete this user. Please try again.');
        }
      }
    });
  };

  // Handle Select All Permissions
  const handleSelectAll = (checked) => {
    setSelectAllChecked(checked);

    const updatedPermissions = Object.keys(permissions).reduce((acc, moduleName) => {
      acc[moduleName] = { access: checked };
      return acc;
    }, {});

    setPermissions(updatedPermissions);
  };

  // Handle role change and update permissions accordingly
  const handleRoleChange = (keys) => {
    const selectedValue = [...keys][0] || "";
    setSelectedRole(selectedValue);
    setError(false);

    if (selectedValue && initialPermissions[selectedValue]) {
      const filteredPermissions = Object.fromEntries(
        Object.keys(initialPermissions[selectedValue]).map((moduleName) => [
          moduleName,
          { access: false } // Reset access when role changes
        ])
      );
      setPermissions(filteredPermissions);
      setSelectAllChecked(false); // Reset "Select All" when role changes
    } else {
      setPermissions({});
      setSelectAllChecked(false);
    }
  };

  // Toggle access without actions
  const handleAccessChange = (moduleName) => {
    setPermissions((prev) => {
      const updatedPermissions = {
        ...prev,
        [moduleName]: {
          ...prev[moduleName],
          access: !prev[moduleName]?.access,
        },
      };

      // Check if all permissions are selected
      const allSelected = Object.values(updatedPermissions).every((perm) => perm.access);
      setSelectAllChecked(allSelected);

      return updatedPermissions;
    });
  };

  const itemClasses = {
    base: "py-0 w-full",
    title: "font-semibold",
    trigger: "px-2 py-6 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };

  const handleEditUser = async (userId) => {
    setId(userId);
    onOpen();

    try {
      const { data } = await axiosPublic.get(`/single-existing-user/${userId}`);

      if (data) {
        setSelectedRole(data.role || ""); // Ensure role is set correctly
        setPermissions(data.permissions || {}); // Ensure permissions are set correctly
      }
    } catch (error) {
      toast.error("Failed to load this user details!");
    }
  };

  // Function to determine the status and render appropriate UI
  const getStatusTextAndIcon = (user) => {

    // get current date
    const currentTime = new Date();

    // If isSetupComplete is true
    if (user.isSetupComplete) {
      return {
        statusText: <p className='text-green-600'>Accepted</p>,
        icon: <FaCheckCircle color="green" />
      };
    }

    // If isSetupComplete is not there and expiresAt is not expired, show "Pending"
    if (!user.isSetupComplete && new Date(user.expiresAt) > currentTime) {
      return {
        statusText: <p className='text-amber-600'>Pending</p>,
        icon: <FaClock color="orange" />
      };
    }

    // If hashedToken and expiresAt is empty or expired
    if ((!user.hashedToken && !user.expiresAt) || new Date(user.expiresAt) < currentTime) {
      return {
        statusText: <p className='text-rose-600'>Expired</p>,
        icon: <FaExclamationCircle color="red" />,
        button: <button onClick={() => handleResendInvitationMail(user?.email, user?.fullName, user?.role)} className="flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-1 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-rose-100 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-md:[&_p]:hidden max-md:[&_svg]:size-4 text-xs"><FaRedo /> Resend</button>
      };
    }

    // Default fallback for any other condition (shouldn't be hit under normal cases)
    return {
      statusText: "Unknown",
      icon: <FaExclamationCircle color="gray" />
    };
  };

  const handleSavePermissions = async () => {
    // 🚀 Check if at least one permission has access = true
    const hasAccess = Object.values(permissions).some(module => module.access);

    if (!hasAccess) {
      toast.error("At least one permission must be granted.")
      return; // Stop form submission
    }

    try {

      const userEditedPermissions = {
        role: selectedRole,
        permissions,
      }

      const response = await axiosPublic.put(`/update-user-permissions/${id}`, userEditedPermissions);

      if (response.data.success) {

        // ✅ Show success toast if the permission is changed
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
          >
            <div className="pl-6">
              <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
            </div>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-gray-900">
                    Permissions Updated Successfully!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {response?.data?.message || "User permissions have been updated."}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        });
        onClose();
        refetch();

      } else {

        // ⚠️ Handle the case where permission is not changed
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
          >
            <div className="pl-6">
              <RxCross2 className="h-6 w-6 bg-yellow-500 text-white rounded-full" />
            </div>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-gray-900">
                    No Changes Detected
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    The user permissions remain unchanged.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        });
      }

    } catch (error) {

      // ❌ Show error toast when something goes wrong
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
        >
          <div className="pl-6">
            <RxCross2 className="h-6 w-6 bg-red-500 text-white rounded-full" />
          </div>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-gray-900">
                  Failed to Update Permissions
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {error.response?.data?.message || "An error occurred while updating user permissions. Please try again."}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
            >
              <RxCross2 />
            </button>
          </div>
        </div>
      ), {
        position: "bottom-right",
        duration: 5000
      });

    }

  };

  if (isExistingUsersPending) return <Loading />;

  return (
    <div className='bg-gray-50 min-h-screen relative px-6 md:px-10'>

      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat left-[45%] lg:left-[60%] -top-[58px]'
      />

      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-2 md:top-16 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />

      <div className="bg-gray-50 sticky top-0 z-10">

        <h1 className="font-bold text-lg md:text-xl lg:text-3xl text-neutral-700 py-1 2xl:py-3 bg-gray-50">USER MANAGEMENT</h1>

        <TabsForSettings tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>

      {activeTab === "Create User" &&
        <EnrollmentForm refetch={refetch} />
      }

      {activeTab === "Existing Users" &&

        <div className='relative pt-4'>

          <div className="custom-max-h custom-scrollbar overflow-x-auto modal-body-scroll mt-3 drop-shadow rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-[1] bg-white">
                <tr>
                  <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                    Serial Number
                  </th>
                  <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                    Full Name
                  </th>
                  <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                    Email
                  </th>
                  <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                    User Role
                  </th>
                  <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                    Invitation Status
                  </th>
                  <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {existingUsers?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500 py-36 md:py-44 xl:py-52 2xl:py-80">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  existingUsers?.map((user, index) => {
                    const { statusText, icon, button } = getStatusTextAndIcon(user);
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="text-xs md:text-sm lg:pl-6 xl:pl-12 font-medium p-3 text-neutral-950">
                          {index + 1}
                        </td>
                        <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                          {user?.fullName}
                        </td>
                        <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                          {user?.email}
                        </td>
                        <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </td>
                        <td className="text-xs md:text-sm font-medium p-3 text-neutral-950">
                          <div className='flex items-center gap-2'>
                            <span className='flex items-center gap-2'>{icon} {statusText}</span>
                            {button && <div>{button}</div>}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex gap-2 items-center">
                            <div className='flex justify-end items-center gap-2'>

                              {/* Edit Button */}
                              <button>
                                <span onClick={() => handleEditUser(user?._id)} className='flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-md:[&_p]:hidden max-md:[&_svg]:size-4'><AiOutlineEdit size={16} /> Edit</span>
                              </button>

                              {/* Block Button */}
                              <button onClick={() => handleRemoveUser(user?._id)}>
                                <span className='flex items-center gap-1.5 rounded-md bg-red-50 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-red-100 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-md:[&_p]:hidden max-md:[&_svg]:size-4 text-xs'> <MdBlock size={16} />Remove</span>
                              </button>

                            </div>
                          </div>
                        </td>

                      </tr>
                    )
                  })
                )}
              </tbody>

            </table>

          </div>

        </div>

      }

      <Modal className='mx-4 lg:mx-0' isOpen={isOpen} onOpenChange={onClose} size='xl'>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 bg-gray-200 px-8">
            Edit permission
          </ModalHeader>

          <ModalBody className="modal-body-scroll">

            <div className='flex flex-col gap-2'>

              <div className="w-full px-4 pt-3">
                <Select onSelectionChange={handleRoleChange}
                  selectionMode="single"
                  size="sm"
                  className='px-6 pb-2'
                  classNames={{
                    label: "font-bold text-neutral-900", // ✅ bold placeholder
                  }}
                  label="Edit role"
                  selectedKeys={selectedRole ? [selectedRole] : []}
                  variant="underlined">
                  {roles.map((role) => (
                    <SelectItem key={role} textValue={role} value={role}>{role}</SelectItem>
                  ))}
                </Select>
                {error && <p className="text-red-500 text-sm mt-1">Role selection is required.</p>}
              </div>

              {selectedRole &&
                <div className='p-6'>
                  <div className="flex justify-between items-center gap-2 pb-2">
                    <label className='ml-4 pb-2'>
                      <Checkbox
                        isSelected={selectAllChecked}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Select All Permissions"
                        className='font-semibold'
                      >
                        Select All Permissions
                      </Checkbox>
                    </label>

                  </div>

                  <Accordion
                    className="flex flex-col w-full"
                    itemClasses={itemClasses}
                    showDivider={false}
                    motionProps={{
                      variants: {
                        enter: { y: 0, opacity: 1, height: "auto", transition: { duration: 0.5 } },
                        exit: { y: -10, opacity: 0, height: 0, transition: { duration: 0.3 } },
                      },
                    }} selectionMode="multiple">
                    {Object.entries(permissions).map(([moduleName, moduleData]) => {
                      return (
                        <AccordionItem key={moduleName} title={
                          <Checkbox isSelected={moduleData.access} aria-label={`Access for ${moduleName}`}
                            onChange={() => handleAccessChange(moduleName)}>
                            {moduleName}
                          </Checkbox>
                        }>

                          {/* Dynamically display actions or "Access All" */}
                          <div className="text-sm">
                            {initialPermissions[selectedRole]?.[moduleName]?.actions?.length > 0 ? (
                              initialPermissions[selectedRole][moduleName].actions.map((action) => (
                                <p key={action} className='flex items-center gap-2 text-neutral-600 font-medium'><span className='text-green-500'><FaCheck size={14} /></span> {action}</p>
                              ))
                            ) : (
                              <p className='flex items-center gap-2 text-neutral-600 font-medium'><span className='text-green-500'><FaCheck size={14} /></span>
                                Has full access to {selectedRole === "Viewer" ? "view" : "manage"} this module.
                              </p>
                            )}
                          </div>

                        </AccordionItem>
                      )
                    }
                    )}
                  </Accordion>
                </div>
              }
            </div>

          </ModalBody>

          <ModalFooter className='flex items-center justify-end border'>
            <Button onClick={onClose} color="danger" variant='light' size='sm'>
              Close
            </Button>
            <Button onClick={handleSavePermissions} color="primary" size='sm'>
              Save permissions
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default EnrollmentPage;
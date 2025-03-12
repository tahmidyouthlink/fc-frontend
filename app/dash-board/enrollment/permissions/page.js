"use client";
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import arrivals2 from "/public/card-images/arrivals2.svg";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdOutlineFileUpload } from "react-icons/md";
import { permissionsList } from "@/permissionList";
import { Checkbox } from "@nextui-org/react";

const DashboardPermissions = () => {

  const { reset, handleSubmit } = useForm();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();
  const [permissions, setPermissions] = useState(() => {
    const storedPermissions = localStorage.getItem("permissions");
    return storedPermissions ? JSON.parse(storedPermissions) : permissionsList; // Load from storage or use default
  });

  const handleAccessChange = (section) => {
    setPermissions((prevPermissions) => {

      // Check if the section is being unchecked (access is set to false)
      const newAccessState = !prevPermissions[section].access;
      const newPermissions = {
        ...prevPermissions,
        [section]: {
          ...prevPermissions[section],
          access: newAccessState,
        },
      };

      // If access is being enabled and there are actions, set all actions to true
      if (newAccessState && prevPermissions[section].access === false && newPermissions[section].actions) {
        Object.keys(newPermissions[section].actions).forEach((action) => {
          newPermissions[section].actions[action] = true;
        });
      }

      // If access is false, reset all actions to false (unselect actions)
      if (!newAccessState && prevPermissions[section].actions) {
        Object.keys(prevPermissions[section].actions).forEach((action) => {
          newPermissions[section].actions[action] = false; // Unselect action
        });
      }

      localStorage.setItem("permissions", JSON.stringify(newPermissions));
      return newPermissions;
    });
  };

  const handleActionChange = (section, action) => {
    // Only allow action change if access is true for that section
    if (permissions[section].access) {
      setPermissions((prevPermissions) => ({
        ...prevPermissions,
        [section]: {
          ...prevPermissions[section],
          actions: {
            ...prevPermissions[section].actions,
            [action]: !prevPermissions[section].actions[action], // Toggle action
          },
        },
      }));
    }
  };

  // Select all functionality
  const handleSelectAll = () => {
    setPermissions((prevPermissions) => {
      const newPermissions = { ...prevPermissions };
      Object.keys(newPermissions).forEach((section) => {
        newPermissions[section].access = true; // Enable access

        // Ensure actions exist before accessing its keys
        if (newPermissions[section].actions) {
          Object.keys(newPermissions[section].actions).forEach((action) => {
            newPermissions[section].actions[action] = true; // Select all actions
          });
        }
      });
      return newPermissions;
    });
  };

  // Unselect all functionality
  const handleUnselectAll = () => {
    setPermissions((prevPermissions) => {
      const newPermissions = { ...prevPermissions };
      Object.keys(newPermissions).forEach((section) => {
        newPermissions[section].access = false; // Disable access

        // Ensure actions exist before accessing its keys
        if (newPermissions[section].actions) {
          Object.keys(newPermissions[section].actions).forEach((action) => {
            newPermissions[section].actions[action] = false; // Deselect all actions
          });
        }
      });
      return newPermissions;
    });
  };

  // Function to count how many sections have 'access' set to true
  const countAccessTrue = () => {
    return Object.values(permissions).filter(section => section.access).length;
  };

  const accessCount = countAccessTrue();
  const allSelected = accessCount === Object.keys(permissions).length; // Check if all are selected
  const moreThanThreeSelected = accessCount > 3; // Check if more than 3 are selected

  const hasSelectedPermissions = () => {
    return Object.values(permissions).some((category) => {
      // If category has top-level access, check further for actions
      if (category.access) {
        // If actions exist and none are selected, return false
        if (category.actions) {
          return Object.values(category.actions).some(Boolean); // Check if at least one action is selected
        }
        return true; // If no actions, access itself is enough
      }
      return false; // If no access is selected, return false
    });
  };

  const permissionKeys = Object.keys(permissions);

  // // Split the permissions list into two balanced halves
  const midPoint = Math.ceil(permissionKeys.length / 2.5);
  const firstColumn = permissionKeys.slice(0, midPoint);
  const secondColumn = permissionKeys.slice(midPoint);

  const onSubmit = async () => {

    if (!hasSelectedPermissions()) {
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
                  Permission Required
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please select at least one permission before sending the invitation.
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
      return;
    }

    const fullName = localStorage.getItem("fullName")
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    try {

      const enrollmentInformation = {
        fullName,
        email,
        role,
        permissions,
      };

      const response = await axiosPublic.post('/invite', enrollmentInformation);

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
                    Invitation Sent Successfully!
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
        reset();
        router.push("/dash-board/enrollment");
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('permissions');

      } else {

        // ⚠️ Handle the case where email sending failed but user data was inserted
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
                    Email Sending Failed
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    The user was added, but the invitation email could not be sent.
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
                  Invitation Failed!
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
  };

  return (
    <div className='bg-gray-50 min-h-screen relative px-6'>

      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat xl:left-[15%] 2xl:left-[30%] bg-[length:1600px_900px]'
      />

      <div
        style={{
          backgroundImage: `url(${arrivals2.src})`,
        }}
        className='absolute inset-0 z-0 bg-contain bg-center xl:-top-28 w-full bg-no-repeat'
      />

      <div
        style={{
          backgroundImage: `url(${arrowSvgImage.src})`,
        }}
        className='absolute inset-0 z-0 top-16 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[50%] bg-no-repeat'
      />

      <div className="2xl:max-w-screen-2xl 2xl:mx-auto relative pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-neutral-700 font-medium">This user will have limited permissions in this web app.</h1>

        <div className="flex gap-2 items-center justify-center">


          {!allSelected && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[14px] text-neutral-700"
            >
              <MdCheckBox size={18} /> Select All
            </button>
          )}

          {moreThanThreeSelected && (
            <button
              type="button"
              onClick={handleUnselectAll}
              className="relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#d4ffce] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] font-bold text-[14px] text-neutral-700"
            >
              <MdCheckBoxOutlineBlank size={20} />  Unselect All
            </button>
          )}

        </div>

      </div>

      <form className='2xl:max-w-screen-2xl 2xl:mx-auto relative' onSubmit={handleSubmit(onSubmit)}>

        {/* Adjusted grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow p-6 rounded-lg my-6">
          {/* First Column */}
          <div className="flex flex-col gap-4">
            {firstColumn.map((section) => {
              const sectionPermissions = permissions[section];
              return (
                <div key={section}>
                  {/* Checkbox for controlling access to the section */}
                  <Checkbox
                    isSelected={sectionPermissions.access}
                    onValueChange={() => handleAccessChange(section)} // Change access state
                  >
                    {section}
                  </Checkbox>

                  {/* Render actions only if the section has actions */}
                  {sectionPermissions.actions && (
                    <div className="pl-5 flex flex-col justify-center">
                      {Object.keys(sectionPermissions.actions).map((action) => (
                        <Checkbox
                          key={action}
                          isSelected={sectionPermissions.actions[action]}
                          onValueChange={() => handleActionChange(section, action)} // Handle action change
                          isDisabled={!sectionPermissions.access} // Disable if access is false
                        >
                          {action}
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-4">
            {secondColumn.map((section) => {
              const sectionPermissions = permissions[section];
              return (
                <div key={section}>
                  {/* Checkbox for controlling access to the section */}
                  <Checkbox
                    isSelected={sectionPermissions.access}
                    onValueChange={() => handleAccessChange(section)} // Change access state
                  >
                    {section}
                  </Checkbox>

                  {/* Render actions only if the section has actions */}
                  {sectionPermissions.actions && (
                    <div className="pl-5 flex flex-col justify-center">
                      {Object.keys(sectionPermissions.actions).map((action) => (
                        <Checkbox
                          key={action}
                          isSelected={sectionPermissions.actions[action]}
                          onValueChange={() => handleActionChange(section, action)} // Handle action change
                          isDisabled={!sectionPermissions.access} // Disable if access is false
                        >
                          {action}
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex justify-between px-6 2xl:px-0 py-6'>

          <Link href='/dash-board/enrollment' className='w-fit rounded-lg bg-[#ffddc2] hover:bg-[#fbcfb0] px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out'>
            <FaArrowLeft /> Previous Step
          </Link>

          <div className='flex items-center gap-6'>

            <button type='submit' className={`relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#d4ffce] px-4 py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] font-semibold text-xs md:text-sm text-neutral-700`}>
              Create User <MdOutlineFileUpload size={20} />
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};

export default DashboardPermissions;
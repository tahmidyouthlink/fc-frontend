"use client";
import { Accordion, AccordionItem, Checkbox, Select, SelectItem } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowDown } from "react-icons/fa6";
import { permissionsList as initialPermissions } from "@/permissionList";
import { FaCheck } from "react-icons/fa";
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { MdOutlineFileUpload } from 'react-icons/md';

const roles = ["Viewer", "Editor", "Owner"];

const EnrollmentForm = () => {

  const { register, reset, handleSubmit, formState: { errors } } = useForm();
  const axiosPublic = useAxiosPublic();
  const accordionRef = useRef(null); // Ref for scrolling to the accordion
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false); // State for "Select All" checkbox

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

  const handleContinue = () => {

    if (!selectedRole) {
      setError(true); // Show error if no selection
      return;
    } else {
      setError(false);
    };

    setShowAccordion(true); // Show the accordion
    setTimeout(() => {
      accordionRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to accordion
    }, 200);

  }

  const onSubmit = async (data) => {

    // 🚀 Check if at least one permission has access = true
    const hasAccess = Object.values(permissions).some(module => module.access);

    if (!hasAccess) {
      toast.error("At least one permission must be granted.")
      return; // Stop form submission
    }

    try {

      const enrollmentInformation = {
        fullName: data.fullName,
        email: data.email,
        role: selectedRole,
        permissions,
      }

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
    <div className="max-w-screen-sm mx-auto px-6 pt-20 lg:pt-48 relative">

      {/* Heading */}
      <h1 className="mb-10 mt-2 text-4xl font-semibold sm:max-xl:text-center">
        Create a new user
      </h1>

      {/* Email and password login section */}
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>

        <div className="w-full space-y-2 font-semibold bg-gray-50">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            {...register("fullName", {
              required: {
                value: true,
                message: "Full name is required.",
              },
            })}
            className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
            required
          />
          {/* Email Error Message */}
          {errors.fullName && (
            <p className="text-xs font-semibold text-red-500">
              {errors.fullName?.message}
            </p>
          )}
        </div>

        <div className="w-full space-y-2 font-semibold bg-gray-50">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="john.doe@gmail.com"
            autoComplete="email"
            {...register("email", {
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
          {errors.email && (
            <p className="text-xs font-semibold text-red-500">
              {errors.email?.message}
            </p>
          )}
        </div>

        <Select onSelectionChange={handleRoleChange}
          selectionMode="single"
          size="sm"
          label="Add a role"
          variant="underlined">
          {roles.map((role) => (
            <SelectItem key={role} textValue={role} value={role}>{role}</SelectItem>
          ))}
        </Select>

        {error && <p className="text-red-500 text-sm mt-1">Role selection is required.</p>}

        <div className='w-full flex justify-end'>
          <button
            type="button"
            onClick={handleContinue}
            className="!mt-7 w-fit rounded-lg bg-[#d4ffce] px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out"
          >
            Continue <FaArrowDown />
          </button>
        </div>

        {/* Accordion for Permissions */}
        {showAccordion && selectedRole && Object.keys(permissions).length > 0 && (
          <div ref={accordionRef} className='pt-[300px] pb-[200px]'>
            <div className='border-2 rounded-lg py-6 px-6'>
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

            <div className='w-full flex justify-end'>
              <button
                type="submit"
                className="!mt-7 w-fit rounded-lg bg-[#d4ffce] px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out"
              >
                Create User <MdOutlineFileUpload size={20} />
              </button>
            </div>
          </div>
        )}

      </form>

    </div>
  );
};

export default EnrollmentForm;
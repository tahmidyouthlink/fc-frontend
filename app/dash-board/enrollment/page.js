"use client";
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import { MdBlock } from "react-icons/md";
import { Radio, RadioGroup } from '@nextui-org/react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import Loading from '@/app/components/shared/Loading/Loading';
import { useSession } from 'next-auth/react';
import useExistingUsers from '@/app/hooks/useExistingUsers';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaCheckCircle, FaExclamationCircle, FaRedo } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const EnrollmentPage = () => {

  const { register: registerForLogin, control, reset, handleSubmit, formState: { errors: errorsForLogin } } = useForm();

  const { data: session, status } = useSession();
  const axiosPublic = useAxiosPublic();
  const userRole = session?.user?.role; // Get the current user's role
  const [selectedRole, setSelectedRole] = useState("");
  const [activeTab, setActiveTab] = useState('create user');
  const [existingUsers, isExistingUsersPending, refetch] = useExistingUsers();

  // Ensure the code runs only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTabCreateUserPage');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  // Automatically set the role if user is an admin
  useEffect(() => {
    if (userRole === "admin") {
      setSelectedRole("staff"); // Admins can only invite staff
    }
  }, [userRole]);

  // Save the activeTab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTabCreateUserPage', activeTab);
    }
  }, [activeTab]);

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

  }

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

  const onSubmit = async (data) => {

    try {
      const enrollmentInformation = {
        fullName: data?.fullName,
        email: data?.email,
        role: selectedRole,
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
        refetch();

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

  if (status === "loading") return <Loading />;

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

        <div className="flex flex-wrap items-center gap-3 bg-gray-50">

          <button
            className={`relative text-sm py-1 transition-all duration-300
        ${activeTab === 'create user' ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 hover:text-neutral-800 after:bottom-0 
        after:h-[2px] after:bg-neutral-800 after:transition-all after:duration-300
        ${activeTab === 'create user' ? 'after:w-full font-bold' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('create user')}
          >
            Create User
          </button>

          <button
            className={`relative text-sm py-1 transition-all duration-300 ${activeTab === 'existing users' ? 'text-neutral-800 font-semibold' : 'text-neutral-400 font-medium'} after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-neutral-800 hover:text-neutral-800 after:transition-all after:duration-300
        ${activeTab === 'existing users' ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      `}
            onClick={() => setActiveTab('existing users')}
          >
            Existing Users
          </button>

        </div>
      </div>

      {activeTab === "create user" && <div className="max-w-screen-sm mx-auto px-6 pt-20 lg:pt-48 relative">

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
              {...registerForLogin("fullName", {
                required: {
                  value: true,
                  message: "Full name is required.",
                },
              })}
              className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
              required
            />
            {/* Email Error Message */}
            {errorsForLogin.fullName && (
              <p className="text-xs font-semibold text-red-500">
                {errorsForLogin.fullName?.message}
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
              {...registerForLogin("email", {
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
            {errorsForLogin.email && (
              <p className="text-xs font-semibold text-red-500">
                {errorsForLogin.email?.message}
              </p>
            )}
          </div>

          {userRole === "super-admin" ? (

            <Controller
              name="role"
              control={control}
              defaultValue={selectedRole}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <RadioGroup
                    {...field}
                    label="Make this account as?"
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                    orientation="horizontal"
                  >
                    <Radio value="admin">Admin</Radio>
                    <Radio value="staff">Staff</Radio>
                  </RadioGroup>
                  {selectedRole && <p className="text-default-500 text-small">{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account</p>}
                  {errorsForLogin.role && (
                    <p className="text-xs font-semibold text-red-500">You need to select an account type.</p>
                  )}
                </div>
              )}
            />

          ) : (
            <div className="w-full space-y-2 font-semibold">
              <label>Role</label>
              <input
                type="text"
                value="Staff"
                disabled
                className="h-11 w-full rounded-lg border-2 border-gray-300 px-3 text-xs text-gray-500 bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}

          <button
            type="submit"
            className="!mt-7 w-full rounded-lg bg-[#d4ffce] py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm"
          >
            Create
          </button>

        </form>

      </div>}

      {activeTab === "existing users" && <div className='relative pt-4'>

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
                  Invitation Status
                </th>
                <th className="text-sm md:text-base p-2 xl:p-3 text-gray-700 border-b border-gray-300">
                  Permissions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {existingUsers?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500 py-36 md:py-44 xl:py-52 2xl:py-80">
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
                              <span className='flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-md:[&_p]:hidden max-md:[&_svg]:size-4'><AiOutlineEdit size={16} /> Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button>
                              <span className='flex items-center gap-1.5 rounded-md bg-red-50 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-red-100 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-md:[&_p]:hidden max-md:[&_svg]:size-4 text-xs'> <RiDeleteBinLine size={16} />Delete</span>
                            </button>

                            {/* Block Button */}
                            <button>
                              <span className='flex items-center gap-1.5 rounded-md bg-red-200 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-red-300 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-md:[&_p]:hidden max-md:[&_svg]:size-4 text-xs'> <MdBlock size={16} />Block</span>
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

      </div>}

    </div>
  );
};

export default EnrollmentPage;
"use client";
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import arrowSvgImage from "/public/card-images/arrow.svg";
import arrivals1 from "/public/card-images/arrivals1.svg";
import arrivals2 from "/public/card-images/arrivals2.svg";
import { Radio, RadioGroup } from '@nextui-org/react';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import Loading from '@/app/components/shared/Loading/Loading';
import { useSession } from 'next-auth/react';

const EnrollmentPage = () => {

  const { register: registerForLogin, control, reset, handleSubmit, formState: { errors: errorsForLogin } } = useForm();

  const { data: session, status } = useSession();
  const axiosPublic = useAxiosPublic();
  const userRole = session?.user?.role; // Get the current user's role
  const [selectedRole, setSelectedRole] = useState("");

  // Automatically set the role if user is an admin
  useEffect(() => {
    if (userRole === "admin") {
      setSelectedRole("staff"); // Admins can only invite staff
    }
  }, [userRole]);

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
                    The user has been invited via email.
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

  if (status === "loading") return <Loading />;

  return (
    <div className='bg-gray-50 min-h-screen relative'>

      <div
        style={{
          backgroundImage: `url(${arrivals1.src})`,
        }}
        className='absolute inset-0 z-0 hidden md:block bg-no-repeat left-[45%] lg:left-[60%] -top-[138px]'
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
        className='absolute inset-0 z-0 top-2 md:top-0 bg-[length:60px_30px] md:bg-[length:100px_50px] left-[60%] lg:bg-[length:200px_100px] md:left-[38%] lg:left-[48%] 2xl:left-[40%] bg-no-repeat'
      />

      <div className="max-w-screen-sm mx-auto px-6 pt-20 lg:pt-52 relative">

        {/* Heading */}
        <h1 className="mb-10 mt-2 text-4xl font-semibold sm:max-xl:text-center">
          Enroll new account
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
            Enroll new account
          </button>

        </form>

      </div>
    </div>
  );
};

export default EnrollmentPage;
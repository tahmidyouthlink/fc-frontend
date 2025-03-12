"use client";
import { Radio, RadioGroup } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Loading from '../shared/Loading/Loading';
import toast from 'react-hot-toast';
import { FaArrowRight } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

const EnrollmentForm = () => {

  const { register: registerForLogin, control, setValue, handleSubmit, formState: { errors: errorsForLogin } } = useForm();

  const { data: session, status } = useSession();
  const userRole = session?.user?.role; // Get the current user's role
  const [selectedRole, setSelectedRole] = useState("");
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();

  // Automatically set the role if user is an admin
  useEffect(() => {
    if (userRole === "admin") {
      setSelectedRole("staff"); // Admins can only invite staff
    }
  }, [userRole]);

  useEffect(() => {
    if (navigate) {
      router.push("/dash-board/enrollment/permissions");
      setNavigate(false); // Reset the state
    }
  }, [navigate, router]);

  useEffect(() => {
    try {

      const email = localStorage.getItem('email');
      if (email) setValue('email', email);

      const fullName = localStorage.getItem('fullName');
      if (fullName) setValue('fullName', fullName);

      const role = localStorage.getItem('role');
      if (role) {
        setSelectedRole(role);
        setValue("role", role);
      };

    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }, [setValue]);

  const onSubmit = async (data) => {

    try {

      localStorage.setItem('fullName', data.fullName);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', selectedRole);
      setNavigate(true);

    } catch (error) {
      toast.error("Failed to go to next step!");
    }
  };

  if (status === "loading") return <Loading />;

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

        <div className='w-full flex justify-end'>
          <button
            type="submit"
            className="!mt-7 w-fit rounded-lg bg-[#d4ffce] px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4] md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out"
          >
            Continue <FaArrowRight />
          </button>
        </div>

      </form>

    </div>
  );
};

export default EnrollmentForm;
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { RiCloseLine, RiEditLine, RiSaveLine } from "react-icons/ri";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import { cities } from "@/app/data/cities";

export default function PersonalInfo({ userData, setUserData, personalInfo }) {
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();
  const [isEditingForm, setIsEditingForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: personalInfo?.customerName || "",
      email: personalInfo?.email || "",
      phoneNumber: personalInfo?.phoneNumber || "--",
      altPhoneNumber: personalInfo?.phoneNumber2 || "--",
      hometown: personalInfo?.hometown || "--",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    reset({
      name: personalInfo?.customerName || "",
      email: personalInfo?.email || "",
      phoneNumber: personalInfo?.phoneNumber || (isEditingForm ? "" : "--"),
      altPhoneNumber: personalInfo?.phoneNumber2 || (isEditingForm ? "" : "--"),
      hometown: personalInfo?.hometown || (isEditingForm ? "" : "--"),
    });
  }, [userData, isEditingForm, reset, personalInfo]);

  const onSubmit = async (data) => {
    setIsPageLoading(true);

    if (data.phoneNumber === "--") data.phoneNumber = "";
    if (data.altPhoneNumber === "--") data.altPhoneNumber = "";
    if (data.hometown === "--") data.hometown = "";

    if (
      personalInfo?.phoneNumber === data.phoneNumber &&
      personalInfo?.phoneNumber2 === data.altPhoneNumber &&
      personalInfo?.hometown === data.hometown
    ) {
      toast.error("Not saved as no changes were made.");
      return setIsEditingForm(false);
    }

    const updatedUserData = {
      ...userData,
      userInfo: {
        ...userData.userInfo,
        personalInfo: {
          ...userData.userInfo.personalInfo,
          phoneNumber: data.phoneNumber,
          phoneNumber2: data.altPhoneNumber,
          hometown: data.hometown,
        },
      },
    };

    setUserData(updatedUserData);

    try {
      const response = await axiosPublic.put(
        `/updateUserInformation/${userData?._id}`,
        updatedUserData,
      );

      if (!!response?.data?.modifiedCount || !!response?.data?.matchedCount) {
        toast.success("Personal information updated successfully.");
      }
    } catch (error) {
      toast.error("Failed update data in server."); // If server error occurs
    }

    setIsEditingForm(false);
    setIsPageLoading(false);
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern"))
      toast.error("Please provide valid information.");
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <section className="w-full rounded-md border-2 border-[#eeeeee] p-3.5 sm:p-5">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Heading */}
          <h2 className="text-[17px] font-semibold uppercase sm:text-lg md:text-xl">
            Personal Information
          </h2>
          {/* Buttons */}
          {isEditingForm ? (
            // If user is editing the form
            <div className="flex gap-2.5">
              {/* Save Button */}
              <button className="flex items-center gap-1.5 rounded-md bg-[var(--color-primary-500)] p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[var(--color-primary-700)] max-md:[&_p]:hidden max-md:[&_svg]:size-4">
                <RiSaveLine className="text-base" />
                <p>Save</p>
              </button>
              {/* Cancel Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-md:[&_p]:hidden max-md:[&_svg]:size-4"
                onClick={() => setIsEditingForm(false)}
              >
                <RiCloseLine className="text-base" />
                <p>Cancel</p>
              </button>
            </div>
          ) : (
            // If user is not editing the form
            /* Edit Button */
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md bg-neutral-100 p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 max-md:[&_p]:hidden max-md:[&_svg]:size-4"
              onClick={() => setIsEditingForm(true)}
            >
              <RiEditLine className="text-base" />
              <p>Edit</p>
            </button>
          )}
        </div>
        {/* Form Fields */}
        <div className="space-y-8 max-lg:space-y-4">
          <div className="max-lg:space-y-4 lg:flex lg:gap-x-6 xl:gap-x-10">
            {/* Full Name Field */}
            <div className="w-full space-y-2 font-semibold">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                disabled={isEditingForm}
                readOnly={!isEditingForm}
                {...register("name", {
                  pattern: {
                    value: /^[a-zA-Z\s'-]{3,}$/,
                    message: "Full name is not valid.",
                  },
                  required: {
                    value: true,
                    message: "Full name is required.",
                  },
                })}
              />
              {errors.name && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.name?.message}
                </p>
              )}
            </div>
            {/* Full Name Field */}
            <div className="w-full space-y-2 font-semibold">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                disabled={isEditingForm}
                readOnly={!isEditingForm}
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
              />
              {errors.email && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.email?.message}
                </p>
              )}
            </div>
          </div>
          <div className="max-lg:space-y-4 lg:flex lg:gap-x-6 xl:gap-x-10">
            {/* Primary Mobile Number Field */}
            <div className="w-full space-y-2 font-semibold">
              <label htmlFor="primary-mobile">Mobile Number</label>
              <input
                id="primary-mobile"
                type="tel"
                placeholder="01XXXXXXXXX"
                readOnly={!isEditingForm}
                {...register("phoneNumber", {
                  pattern: {
                    value: /^01\d{9}$/,
                    message: "Mobile number is invalid.",
                  },
                  required: {
                    value: true,
                    message: "Mobile number is required.",
                  },
                })}
                onInput={(event) =>
                  (event.target.value = event.target.value.replace(/\D/g, ""))
                }
              />
              {errors.phoneNumber && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.phoneNumber?.message}
                </p>
              )}
            </div>
            {/* Alternative Mobile Number Field */}
            <div className="w-full space-y-2 font-semibold">
              <label htmlFor="alt-mobile">Alternative Mobile Number</label>
              <input
                id="alt-mobile"
                placeholder="01XXXXXXXXX"
                readOnly={!isEditingForm}
                {...register("altPhoneNumber", {
                  pattern: {
                    value: /^01\d{9}$/,
                    message: "Mobile number is invalid.",
                  },
                })}
                onInput={(event) =>
                  (event.target.value = event.target.value.replace(/\D/g, ""))
                }
              />
              {errors.altPhoneNumber && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.altPhoneNumber?.message}
                </p>
              )}
            </div>
          </div>
          {/* Hometown Field */}
          <div className="relative w-full space-y-2 font-semibold lg:w-[calc(50%-1.5rem/2)] xl:w-[calc(50%-2.5rem/2)]">
            <Controller
              name="hometown"
              control={control}
              rules={{
                required: "Hometown is required.",
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  isReadOnly={!!personalInfo?.hometown || !isEditingForm}
                  isDisabled={!!personalInfo?.hometown || !isEditingForm}
                  isRequired
                  labelPlacement="outside"
                  label="Hometown"
                  placeholder="Select hometown"
                  size="sm"
                  variant="bordered"
                  selectedKey={value}
                  onSelectionChange={onChange}
                  className={`select-with-search w-full [&:has(input:focus)_[data-slot='input-wrapper']]:border-[var(--color-secondary-500)] [&:has(input:focus)_[data-slot='input-wrapper']]:bg-white/75 [&_[data-disabled='true']]:opacity-100 [&_[data-disabled='true']_[data-slot='inner-wrapper']]:opacity-50 [&_[data-slot='input-wrapper']]:bg-white/20 [&_[data-slot='input-wrapper']]:shadow-none [&_[data-slot='input-wrapper']]:backdrop-blur-2xl [&_[data-slot='input-wrapper']]:backdrop-opacity-100 [&_[data-slot='input-wrapper']]:hover:border-[var(--color-secondary-500)] [&_label]:!text-neutral-500 ${isEditingForm || personalInfo?.hometown ? "[&_[data-slot='inner-wrapper']]:!opacity-100" : "[&_[data-slot='inner-wrapper']]:!opacity-0"}`}
                >
                  {cities.map((hometown) => {
                    return (
                      <AutocompleteItem key={hometown}>
                        {hometown}
                      </AutocompleteItem>
                    );
                  })}
                </Autocomplete>
              )}
            />
            <p
              className={`absolute left-0 top-9 -translate-y-1/2 font-semibold text-neutral-700 transition-opacity duration-100 ease-in-out ${!isEditingForm && !personalInfo?.hometown ? "opacity-100" : "opacity-0"}`}
            >
              --
            </p>
            {errors.hometown && (
              <p className="text-xs font-semibold text-red-500">
                {errors.hometown?.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Autocomplete, AutocompleteItem, DatePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { RiCloseLine, RiEditLine, RiSaveLine } from "react-icons/ri";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import calculateAge from "@/app/utils/calculateAge";
import { cities } from "@/app/data/cities";

export default function PersonalInfo({ userData, setUserData, personalInfo }) {
  const { setIsPageLoading } = useLoading();
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
      dob: personalInfo?.dob ? parseDate(personalInfo.dob) : null,
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
      dob: personalInfo?.dob ? parseDate(personalInfo.dob) : null,
    });
  }, [userData, isEditingForm]);

  const onSubmit = async (data) => {
    setIsPageLoading(true);

    if (data.phoneNumber === "--") data.phoneNumber = "";
    if (data.altPhoneNumber === "--") data.altPhoneNumber = "";
    if (data.hometown === "--") data.hometown = "";
    if (data.dob) {
      data.dob = new Date(data.dob).toISOString().split("T")[0];
    }

    if (
      personalInfo?.phoneNumber === data.phoneNumber &&
      personalInfo?.phoneNumber2 === data.altPhoneNumber &&
      personalInfo?.hometown === data.hometown &&
      personalInfo?.dob === data.dob
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
          dob: data.dob,
        },
      },
    };

    setUserData(updatedUserData);

    try {
      const response = await useAxiosPublic().put(
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
              <button className="flex items-center gap-1.5 rounded-md bg-[#d4ffce] p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] max-md:[&_p]:hidden max-md:[&_svg]:size-4">
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
          <div className="max-lg:space-y-4 lg:flex lg:gap-x-6 xl:gap-x-10">
            {/* Hometown Field */}
            <div className="relative w-full space-y-2 font-semibold">
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
                    className={`select-with-search w-full [&:has(input:focus)_[data-slot='input-wrapper']]:border-[#F4D3BA] [&:has(input:focus)_[data-slot='input-wrapper']]:bg-white/75 [&_[data-disabled='true']]:opacity-100 [&_[data-disabled='true']_[data-slot='inner-wrapper']]:opacity-50 [&_[data-slot='input-wrapper']]:bg-white/20 [&_[data-slot='input-wrapper']]:shadow-none [&_[data-slot='input-wrapper']]:backdrop-blur-2xl [&_[data-slot='input-wrapper']]:backdrop-opacity-100 [&_[data-slot='input-wrapper']]:hover:border-[#F4D3BA] [&_label]:!text-neutral-500 ${isEditingForm || personalInfo?.hometown ? "[&_[data-slot='inner-wrapper']]:!opacity-100" : "[&_[data-slot='inner-wrapper']]:!opacity-0"}`}
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
            {/* Date of Birth Field */}
            <div className="relative w-full space-y-2 font-semibold">
              <Controller
                name="dob"
                control={control}
                rules={{
                  required: "Date of birth is required.",
                  validate: (value) => {
                    const age = calculateAge(value);
                    if (age < 13) return "You must be at least 13 years old";
                    if (age > 120)
                      return "Age cannot be more than 120 years old";
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    isReadOnly={!!personalInfo?.dob || !isEditingForm}
                    isDisabled={!!personalInfo?.dob || !isEditingForm}
                    id="dob"
                    labelPlacement="outside"
                    label="Date of Birth"
                    showMonthAndYearPickers
                    variant="bordered"
                    value={value}
                    onChange={onChange}
                    classNames={{
                      calendarContent:
                        "min-w-64 [&_td>span:hover]:bg-[#c2f3ba] [&_td>span:hover]:text-[#3f7136] [&_td>span[data-selected='true']]:bg-[#58944d] [&_td>span[data-selected='true']]:text-white [&_td>span[data-selected='true']:hover]:bg-[#58944d] [&_td>span[data-selected='true']:hover]:text-white",
                    }}
                    className={`date-picker mt-1 gap-1 transition-opacity duration-300 ease-in-out [&>div:focus-within:hover]:border-[#F4D3BA] [&>div:focus-within]:border-[#F4D3BA] [&>div:hover]:border-[#F4D3BA] [&>div]:bg-white/20 [&>span]:mb-1 [&[data-disabled='true']>div]:opacity-50 [&[data-disabled='true']]:opacity-100 [&_[data-slot='input-field']]:font-semibold [&_[data-slot='label']]:!text-sm [&_[data-slot='label']]:text-neutral-500 md:[&_[data-slot='label']]:!text-sm ${isEditingForm || personalInfo?.dob ? "[&>div]:!opacity-100" : "[&>div]:!opacity-0"}`}
                  />
                )}
              />
              <p
                className={`absolute left-0 top-9 -translate-y-1/2 font-semibold text-neutral-700 transition-opacity duration-100 ease-in-out ${!isEditingForm && !personalInfo?.dob ? "opacity-100" : "opacity-0"}`}
              >
                --
              </p>
              {errors.dob && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.dob?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

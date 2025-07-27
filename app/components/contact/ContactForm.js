"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLoading } from "@/app/contexts/loading";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";

export default function ContactForm({ userData }) {
  const { setIsPageLoading } = useLoading();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    reset({
      name: userData?.userInfo?.personalInfo?.customerName || "",
      email: userData?.email || "",
      phone: userData?.userInfo?.personalInfo?.phoneNumber || "",
      topic: getValues("topic") || "",
      message: getValues("message") || "",
    });
  }, [getValues, reset, userData]);

  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      const result = await rawFetch("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.ok) {
        toast.success(result.message);
      } else {
        console.error(
          "SubmissionError (contactForm):",
          result.message || "Failed to submit contact form.",
        );
        toast.error(result.message || "Failed to submit contact form.");
      }
    } catch (error) {
      console.error("SubmissionError (contactForm):", error.message || error);
      toast.error("Failed to submit contact form.");
    } finally {
      reset({
        name: userData?.userInfo?.personalInfo?.customerName || "",
        email: userData?.email || "",
        phone: userData?.userInfo?.personalInfo?.phoneNumber || "",
        topic: "",
        message: "",
      });
      setIsPageLoading(false);
    }
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern") || errorTypes.includes("minLength"))
      toast.error("Please provide valid information.");
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex grow flex-col justify-between gap-y-10"
    >
      <div className="space-y-7">
        <div className="items-end gap-9 space-y-7 sm:max-md:flex sm:max-md:space-y-0 lg:flex lg:space-y-0">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full border-b-2 border-neutral-300 bg-transparent py-2 text-neutral-800 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-neutral-400"
              placeholder="Full name"
              readOnly={!!userData}
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
              <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="relative w-full">
            <input
              type="email"
              className="w-full border-b-2 border-neutral-300 bg-transparent py-2 text-neutral-800 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-neutral-400"
              placeholder="Email address"
              readOnly={!!userData}
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
              <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
                {errors.email?.message}
              </p>
            )}
          </div>
        </div>
        <div className="items-end gap-9 space-y-7 sm:max-md:flex sm:max-md:space-y-0 lg:flex lg:space-y-0">
          <div className="relative w-full">
            <input
              type="tel"
              className="w-full border-b-2 border-neutral-300 bg-transparent py-2 text-neutral-800 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-neutral-400"
              placeholder="Mobile number"
              {...register("phone", {
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
            {errors.phone && (
              <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
                {errors.phone?.message}
              </p>
            )}
          </div>
          <div className="relative w-full">
            <input
              type="text"
              className="w-full border-b-2 border-neutral-300 bg-transparent py-2 text-neutral-800 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-neutral-400"
              placeholder="Subject"
              {...register("topic", {
                required: {
                  value: true,
                  message: "Subject is required.",
                },
                minLength: {
                  value: 5,
                  message: "Subject must have at least 5 characters.",
                },
              })}
            />
            {errors.topic && (
              <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
                {errors.topic?.message}
              </p>
            )}
          </div>
        </div>
        <div className="relative w-full">
          <textarea
            rows={7}
            className="w-full resize-none border-b-2 border-neutral-300 bg-transparent py-2 text-neutral-800 outline-none transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-neutral-400"
            placeholder="Message"
            {...register("message", {
              required: "Message is required.",
              minLength: {
                value: 25,
                message: "Message must have at least 25 characters.",
              },
            })}
          />
          {errors.message && (
            <p className="absolute -bottom-5 left-0 text-xs font-semibold text-red-500">
              {errors.message?.message}
            </p>
          )}
        </div>
      </div>
      <button className="w-fit rounded-[4px] bg-[var(--color-primary-500)] px-5 py-3 text-xs font-semibold text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)] md:text-sm">
        Send Message
      </button>
    </form>
  );
}

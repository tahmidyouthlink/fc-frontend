"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLoading } from "@/app/contexts/loading";
import { axiosPublic } from "@/app/utils/axiosPublic";

export default function TopFooterNewsletter({
  newsletterSubscriptions,
  isSubscribedInitial,
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setIsPageLoading } = useLoading();
  const { register, handleSubmit, reset, setValue } = useForm({
    mode: "onSubmit",
  });
  let isUserSubscribed;

  if (status === "loading") {
    if (isUserSubscribed === undefined) isUserSubscribed = isSubscribedInitial;
  } else {
    if (status === "unauthenticated") {
      isUserSubscribed = false;
    } else {
      isUserSubscribed = newsletterSubscriptions?.some(
        (subscription) => subscription.email === session.user.email,
      );
    }
  }

  setValue("newsletterEmail", session?.user?.email || "");

  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      const newsletterData = {
        email: data.newsletterEmail,
      };

      const response = await axiosPublic.post("/addNewsletter", newsletterData);

      if (response?.data?.insertedId) {
        toast.success("Subscribed to newsletter successfully.");
        router.refresh();
        reset();
      } else {
        toast.error("Unable to subscribe to newsletter.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
    setIsPageLoading(false);
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required")) toast.error("Email is required.");
    else if (errorTypes.includes("pattern")) toast.error("Email is not valid.");
    else toast.error("Something went wrong. Please try again.");
  };

  if (!isUserSubscribed)
    return (
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        className="w-full max-w-md"
      >
        <p className="mb-4 text-center text-xs text-neutral-700 md:text-sm">
          Subscribe to our newsletter to get more offers daily!
        </p>
        <div className="flex gap-1.5">
          <input
            type="email"
            className="h-10 w-full rounded-[4px] border-2 border-neutral-200/50 bg-white/90 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-500 focus:border-white/50 md:text-sm"
            placeholder="Enter your email address"
            {...register("newsletterEmail", {
              required: true,
              pattern:
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/,
            })}
          />
          <button className="block w-fit self-end text-nowrap rounded-[4px] bg-[var(--color-primary-700)] px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 transition-[background-color] duration-300 ease-in-out hover:bg-[var(--color-primary-500)]">
            Subscribe
          </button>
        </div>
      </form>
    );
}

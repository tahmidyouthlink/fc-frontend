"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import useMarketingBanners from "@/app/hooks/useMarketingBanners";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function TopFooter() {
  const pathname = usePathname();
  const { userData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      newsletterEmail: userData?.email || "",
    },
    mode: "onSubmit",
  });
  const [
    [footerBanner] = [],
    isMarketingBannerListLoading,
    marketingBannerListRefetch,
  ] = useMarketingBanners() || [];
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);

  const onSubmit = async (data) => {
    setIsPageLoading(true);

    try {
      const newsletterData = {
        email: data.newsletterEmail,
      };

      const response = await axiosPublic.post("/addNewsletter", newsletterData);

      if (response?.data?.insertedId) {
        toast.success("Subscribed to newsletter successfully.");
        setIsUserSubscribed(true);
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

  useEffect(() => {
    const checkIfSubscribed = async () => {
      try {
        const response = await axiosPublic.get(
          `/getSingleNewsletter/${userData.email}`,
        );
        setIsUserSubscribed(!!response?.data);
      } catch (error) {
        setIsUserSubscribed(false);
        if (error.status != 404)
          console.log("Error fetching user newsletter subscription.");
      }
    };

    if (!userData) {
      setIsUserSubscribed(false);
      setValue("newsletterEmail", "");
    } else {
      setValue("newsletterEmail", userData.email);

      checkIfSubscribed();
    }
  }, [axiosPublic, setValue, userData]);

  useEffect(() => {
    setIsPageLoading(isMarketingBannerListLoading || !footerBanner);

    return () => setIsPageLoading(false);
  }, [isMarketingBannerListLoading, footerBanner, setIsPageLoading]);

  if (!pathname.includes("checkout"))
    return (
      <div className="relative bg-[var(--color-primary-light)]">
        <div
          className={`flex items-center justify-evenly overflow-hidden px-5 py-14 sm:px-8 lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 ${footerBanner?.position !== "center" ? "gap-5 py-[72px]" : "flex-col gap-12 py-14"}`}
        >
          <TransitionLink
            className={`relative block h-40 w-full ${footerBanner?.position === "right" ? "order-last" : ""}`}
            href="/shop?filterBy=On+Sale"
          >
            {!!footerBanner?.url && (
              <Image
                src={footerBanner?.url}
                className="object-contain"
                alt="Marketing Banner"
                height={0}
                width={0}
                sizes="100vh"
                fill
              />
            )}
          </TransitionLink>
          {!isUserSubscribed && (
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
                  className="h-10 w-full rounded-lg border-2 border-neutral-200/50 bg-white/90 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[border-color] duration-300 ease-in-out placeholder:text-neutral-500 focus:border-white/50 md:text-sm"
                  placeholder="Enter your email address"
                  readOnly={!!userData}
                  {...register("newsletterEmail", {
                    required: true,
                    pattern:
                      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/,
                  })}
                />
                <button className="block w-fit self-end text-nowrap rounded-lg bg-[var(--color-primary-dark)] px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 transition-[background-color] duration-300 ease-in-out hover:bg-[var(--color-primary-regular)]">
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
}

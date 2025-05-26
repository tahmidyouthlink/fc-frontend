import { Controller } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Tooltip,
} from "@nextui-org/react";
import { cities } from "@/app/data/cities";
import { getEstimatedDeliveryTime } from "@/app/utils/orderCalculations";
import CheckoutSelectDeliveryAddress from "../cart/CheckoutSelectDeliveryAddress";

export default function CheckoutDeliveryAddress({
  register,
  control,
  reset,
  errors,
  deliveryAddresses,
  selectedCity,
  selectedDeliveryType,
  shippingZones,
}) {
  return (
    <section className="w-full space-y-4 rounded-xl border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold md:text-lg">Delivery Address</h2>
        {!!deliveryAddresses?.length && (
          <CheckoutSelectDeliveryAddress
            deliveryAddresses={deliveryAddresses}
            reset={reset}
          />
        )}
      </div>
      <div className="space-y-4">
        <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
          <div className="w-full space-y-2 font-semibold">
            <label htmlFor="address-one">Address Line 1</label>
            <input
              id="address-one"
              type="text"
              className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-regular)] focus:bg-white/75 md:text-[13px]"
              placeholder="House 123, Road 10, Block A"
              {...register("addressLineOne", {
                required: {
                  value: true,
                  message: "Address line 1 is required.",
                },
              })}
              required
            />
            {errors.addressLineOne && (
              <p className="text-xs font-semibold text-red-500">
                {errors.addressLineOne?.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-2 font-semibold">
            <label htmlFor="address-two">Address Line 2</label>
            <input
              id="address-two"
              type="text"
              {...register("addressLineTwo")}
              className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-regular)] focus:bg-white/75 md:text-[13px]"
              placeholder="Dhanmondi, Dhaka 1209"
            />
            {errors.addressLineTwo && (
              <p className="text-xs font-semibold text-red-500">
                {errors.addressLineTwo?.message}
              </p>
            )}
          </div>
        </div>
        <div className="max-sm:space-y-4 sm:flex sm:gap-x-4">
          <div className="w-full space-y-2 font-semibold">
            <Controller
              name="city"
              control={control}
              rules={{
                required: "City is required.",
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  isRequired
                  labelPlacement="outside"
                  label="City"
                  placeholder="Select city"
                  size="sm"
                  variant="bordered"
                  selectedKey={value}
                  onSelectionChange={onChange}
                  className="select-with-search [&:has(input:focus)_[data-slot='input-wrapper']]:border-[var(--color-secondary-regular)] [&_[data-slot='input-wrapper']]:bg-white/20 [&_[data-slot='input-wrapper']]:hover:border-[var(--color-secondary-regular)] [&_label]:!text-neutral-500"
                >
                  {cities.map((city) => {
                    return (
                      <AutocompleteItem key={city}>{city}</AutocompleteItem>
                    );
                  })}
                </Autocomplete>
              )}
            />
            {errors.city && (
              <p className="text-xs font-semibold text-red-500">
                {errors.city?.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-2 font-semibold [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-outer-spin-button]:appearance-none [&_input]:[-moz-appearance:textfield]">
            <label htmlFor="postal-code">Post Code</label>
            <input
              id="postal-code"
              type="number"
              {...register("postalCode", {
                pattern: {
                  value: /^\d{4}$/,
                  message: "Postal code must contain 4 numeric digits.",
                },
                required: {
                  value: true,
                  message: "Postal code is required.",
                },
              })}
              className="h-10 w-full rounded-lg border-2 border-neutral-200 bg-white/20 px-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-regular)] focus:bg-white/75 md:text-[13px]"
              placeholder="1230"
              required
            />
            {errors.postalCode && (
              <p className="text-xs font-semibold text-red-500">
                {errors.postalCode?.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full space-y-2 font-semibold">
          <label htmlFor="note">Note to Seller (If Any)</label>
          <textarea
            id="note"
            {...register("note")}
            rows={1}
            className="w-full resize-none rounded-lg border-2 border-neutral-200 bg-white/20 px-3 py-3 text-xs text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-regular)] focus:bg-white/75 md:text-[13px]"
          ></textarea>
          {errors.note && (
            <p className="text-xs font-semibold text-red-500">
              {errors.note?.message}
            </p>
          )}
        </div>
        {selectedCity === "Dhaka" && (
          <div className="w-full space-y-2 font-semibold">
            <p>Select Delivery Type</p>
            <div className="payment-methods max-sm:space-y-4 sm:flex sm:gap-x-4">
              <Tooltip
                classNames={{
                  base: [
                    "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                  ],
                  content: ["p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]"],
                }}
                motionProps={{
                  variants: {
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: 0.3,
                        ease: "easeIn",
                      },
                    },
                    enter: {
                      opacity: 1,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    },
                  },
                }}
                shouldFlip
                showArrow={true}
                content={`After confirmation, you will get the delivery within ${getEstimatedDeliveryTime("Dhaka", "STANDARD", shippingZones)} days with FREE of charge.`}
              >
                <input
                  className="!h-12 before:border-2 before:!border-neutral-900 before:!bg-[#020202] before:bg-[url('/delivery-partners/standard-delivery.webp')] before:grayscale before:invert before:backdrop-blur-2xl before:transition-all before:duration-300 before:ease-in-out checked:before:!bg-[#383804] checked:before:grayscale-0 hover:before:!border-transparent hover:before:!bg-[#383804] hover:before:grayscale-0"
                  type="radio"
                  {...register("deliveryType", {
                    required: {
                      value: true,
                      message: "Select one of the delivery types.",
                    },
                  })}
                  id="STANDARD"
                  value="STANDARD"
                  required
                />
              </Tooltip>
              <Tooltip
                classNames={{
                  base: [
                    "max-w-[66.66dvw] min-[1200px]:max-w-[calc(((1200px*55/100)-16px-20px-20px)/2)]",
                  ],
                  content: ["p-5 shadow-[1px_1px_20px_0_rgba(0,0,0,0.15)]"],
                }}
                motionProps={{
                  variants: {
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: 0.3,
                        ease: "easeIn",
                      },
                    },
                    enter: {
                      opacity: 1,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    },
                  },
                }}
                shouldFlip
                showArrow={true}
                content={`After confirmation, you will get the delivery within ${getEstimatedDeliveryTime("Dhaka", "EXPRESS", shippingZones)} hours.`}
              >
                <input
                  className="!h-12 before:border-2 before:!border-neutral-900 before:!bg-[#020202] before:bg-[url('/delivery-partners/express-delivery.webp')] before:grayscale before:invert before:backdrop-blur-2xl before:transition-[background-color,filter] before:duration-300 before:ease-in-out checked:before:!bg-[#383804] checked:before:grayscale-0 hover:before:!border-transparent hover:before:!bg-[#383804] hover:before:grayscale-0"
                  type="radio"
                  {...register("deliveryType", {
                    required: {
                      value: true,
                      message: "Select one of the delivery types.",
                    },
                  })}
                  id="EXPRESS"
                  value="EXPRESS"
                  required
                />
              </Tooltip>
            </div>
            {errors.deliveryType && (
              <p className="text-xs font-semibold text-red-500">
                {errors.deliveryType?.message}
              </p>
            )}
          </div>
        )}
        {!!selectedCity &&
          (selectedCity !== "Dhaka" || !!selectedDeliveryType) && (
            <p className="text-xs lg:text-sm">
              After confirmation, you will get the delivery within{" "}
              {getEstimatedDeliveryTime(
                selectedCity,
                selectedDeliveryType,
                shippingZones,
              )}{" "}
              {selectedDeliveryType === "EXPRESS" ? "hours" : "days"}
              {selectedCity === "Dhaka" && selectedDeliveryType === "STANDARD"
                ? " with FREE of charge"
                : ""}
              .
            </p>
          )}
      </div>
    </section>
  );
}

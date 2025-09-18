import { TbArrowsExchange, TbCurrencyTaka } from "react-icons/tb";

export default function ReturnReturnTypeField({
  register,
  errors,
  selectedType,
}) {
  return (
    <div className="w-full space-y-3 font-semibold">
      <p>Select Return Type</p>
      <div className="max-sm:space-y-3 sm:flex sm:gap-x-3">
        <label htmlFor="return-type-exchange" className="block w-full">
          <input
            className="peer hidden"
            type="radio"
            {...register("type", {
              required: "Select one of the return types.",
            })}
            id="return-type-exchange"
            value="exchange"
          />
          <div className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] border-2 border-neutral-200 transition duration-300 ease-in-out hover:border-[var(--color-primary-800)] hover:bg-[var(--color-primary-400)] peer-checked:border-[var(--color-primary-800)] peer-checked:bg-[var(--color-primary-400)]">
            <TbArrowsExchange size={22} />
            <span className="text-[13px]/[1] font-bold">EXCHANGE</span>
          </div>
        </label>
        <label htmlFor="return-type-refund" className="block w-full">
          <input
            className="peer hidden"
            type="radio"
            {...register("type", {
              required: "Select one of the return types.",
            })}
            id="return-type-refund"
            value="refund"
          />
          <div className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] border-2 border-neutral-200 transition duration-300 ease-in-out hover:border-[var(--color-primary-800)] hover:bg-[var(--color-primary-400)] peer-checked:border-[var(--color-primary-800)] peer-checked:bg-[var(--color-primary-400)]">
            <TbCurrencyTaka size={22} />
            <span className="text-[13px]/[1] font-bold">REFUND</span>
          </div>
        </label>
      </div>
      {!!selectedType && (
        <p className="text-xs font-normal text-neutral-500 sm:text-[13px]/[1.5]">
          Note:{" "}
          {selectedType === "exchange"
            ? "The exchange of an item is subject to stock availability. If the item you want is not in stock, a refund will be issued instead."
            : "Refunds are processed after the returned product has been inspected and approved. Refunds typically take 10-14 working days to be credited to your original payment method."}
        </p>
      )}
      {errors.type && (
        <p className="text-xs font-semibold text-red-500">
          {errors.type.message}
        </p>
      )}
    </div>
  );
}

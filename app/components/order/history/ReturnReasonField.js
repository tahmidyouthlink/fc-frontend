import { Controller } from "react-hook-form";
import { Select, SelectItem } from "@nextui-org/react";

export default function ReturnReasonField({ control, errors, selectedReason }) {
  return (
    <div className="w-full space-y-3 font-semibold">
      <Controller
        name="reason"
        id="reason"
        control={control}
        rules={{
          required: "Reason is required.",
        }}
        render={({ field: { onChange, value } }) => (
          <Select
            variant="bordered"
            labelPlacement="outside"
            label="Reason"
            placeholder="Select a reason"
            className={`select-without-search [&_button[data-focus='true']]:border-[var(--color-secondary-500)] [&_button[data-hover='true']]:border-[var(--color-secondary-500)] [&_button[data-open='true']]:border-[var(--color-secondary-500)] [&_button]:!h-11 [&_button]:rounded-[4px] [&_label]:top-[calc(50%-4px)] [&_label]:!text-base [&_label]:!text-neutral-700 ${!selectedReason ? "[&_span[data-slot='value']]:text-neutral-500" : "[&_span[data-slot='value']]:text-neutral-700"}`}
            classNames={{ popoverContent: ["rounded-md"] }}
            selectedKey={value}
            onSelectionChange={onChange}
          >
            <SelectItem className="rounded-[4px]" key="Faulty Product">Faulty Product</SelectItem>
            <SelectItem className="rounded-[4px]" key="Wrong Item">Wrong Item</SelectItem>
            <SelectItem className="rounded-[4px]" key="Others">Others</SelectItem>
          </Select>
        )}
      />
      {errors.reason && (
        <p className="text-xs font-semibold text-red-500">
          {errors.reason?.message}
        </p>
      )}
    </div>
  );
}

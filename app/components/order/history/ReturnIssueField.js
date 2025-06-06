import { Controller } from "react-hook-form";
import { Select, SelectItem } from "@nextui-org/react";

export default function ReturnIssueField({
  control,
  errors,
  selectedReason,
  selectedIssue,
}) {
  const issues = {
    faulty: [
      "Defective Fabric",
      "Color Fading",
      "Loose Threads/Stitching",
      "Damaged Zipper/Buttons",
      "Misalignment/Uneven Parts",
    ],
    wrong: ["Wrong Size", "Wrong Color", "Wrong Product"],
  };

  return (
    <div className="w-full space-y-3 font-semibold">
      <Controller
        name="issue"
        id="issue"
        control={control}
        rules={{
          required: "Issue is required.",
        }}
        render={({ field: { onChange, value } }) => (
          <Select
            variant="bordered"
            labelPlacement="outside"
            label="Specific Issue"
            placeholder="Select a specific issue"
            className={`select-without-search [&_button[data-focus='true']]:border-[var(--color-secondary-500)] [&_button[data-hover='true']]:border-[var(--color-secondary-500)] [&_button[data-open='true']]:border-[var(--color-secondary-500)] [&_button]:!h-11 [&_button]:rounded-[4px] [&_label]:top-[calc(50%-4px)] [&_label]:!text-base [&_label]:!text-neutral-700 ${!selectedIssue ? "[&_span[data-slot='value']]:text-neutral-500" : "[&_span[data-slot='value']]:text-neutral-700"}`}
            classNames={{ popoverContent: ["rounded-md"] }}
            selectedKey={value}
            onSelectionChange={onChange}
          >
            {(selectedReason === "Faulty Product"
              ? issues.faulty
              : issues.wrong
            ).map((issue) => (
              <SelectItem className="rounded-[4px]" key={issue}>
                {issue}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      {errors.issue && (
        <p className="text-xs font-semibold text-red-500">
          {errors.issue?.message}
        </p>
      )}
    </div>
  );
}

import React from "react";
import { useCheckbox, Chip, VisuallyHidden, tv } from "@nextui-org/react";
import { CheckIcon } from "./CheckIcon";

const checkbox = tv({
  slots: {
    base: "border-default hover:bg-default-200",
    content: "text-default-500"
  },
  variants: {
    isSelected: {
      true: {
        base: "",
        content: "pl-1"
      },
      false: {
        base: "border-[#9F5216] bg-[#9F5216] hover:bg-[#9F5216] hover:border-[#9F5216]",
        content: "text-primary-foreground pl-1"
      }
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-focus ring-offset-2 ring-offset-background",
      },
      false: {
        base: "outline-none ring-focus ring-offset-2 ring-offset-background",
      }
    }
  }
})

export const CustomCheckbox2 = (props) => {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props
  })

  const styles = checkbox({ isSelected, isFocusVisible })

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="primary"
        startContent={isSelected ? null : <CheckIcon className="ml-1" />}
        variant="faded"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? "Disabled" : "Enabled"}
      </Chip>
    </label>
  );
}
import { Input, Button } from "@nextui-org/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function ProductQuantitySelection({
  productVariantSku,
  selectedOptions,
  setSelectedOptions,
}) {
  return (
    <div
      className={`mb-6 flex items-center gap-x-2.5 ${!!selectedOptions?.size && !!productVariantSku ? /*"pointer-events-auto opacity-100" : "pointer-events-none opacity-40"*/ "" : "hidden"}`}
    >
      <h4 className="font-semibold text-neutral-600">Quantity:</h4>
      <div className="flex gap-x-1.5 [&>*]:rounded-lg [&>button]:bg-neutral-100 hover:[&>button]:bg-[var(--color-secondary-500)]">
        <Button
          isIconOnly
          startContent={<HiChevronLeft />}
          onClick={() =>
            setSelectedOptions((prevOptions) => ({
              ...prevOptions,
              quantity:
                prevOptions.quantity !== 1
                  ? prevOptions.quantity - 1
                  : prevOptions.quantity,
            }))
          }
        ></Button>
        <Input
          className="w-fit font-semibold [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-outer-spin-button]:appearance-none [&_input]:text-center [&_input]:[-moz-appearance:textfield]"
          type="number"
          arial-label="Quantity"
          min={1}
          max={!productVariantSku ? 1 : productVariantSku}
          value={selectedOptions?.quantity || ""}
          onValueChange={(value) => {
            setSelectedOptions((prevOptions) => ({
              ...prevOptions,
              quantity:
                value < 1
                  ? 1
                  : value > productVariantSku
                    ? productVariantSku
                    : value,
            }));
          }}
        />
        <Button
          isIconOnly
          startContent={<HiChevronRight />}
          onClick={() =>
            setSelectedOptions((prevOptions) => ({
              ...prevOptions,
              quantity:
                prevOptions.quantity !== productVariantSku
                  ? Number(prevOptions.quantity) + 1
                  : prevOptions.quantity,
            }))
          }
        ></Button>
      </div>
    </div>
  );
}

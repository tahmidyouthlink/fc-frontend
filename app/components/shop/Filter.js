import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Slider,
} from "@nextui-org/react";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { LuBadge } from "react-icons/lu";
import { MdOutlineNewReleases } from "react-icons/md";
import { TbRosetteDiscount } from "react-icons/tb";

export default function Filter({
  isFilterButtonClicked,
  unfilteredProducts,
  filteredProducts,
  selectedFilterOptions,
  setSelectedFilterOptions,
  calculateFinalPrice,
}) {
  // console.log(
  //   "chk price regular",
  //   filteredProducts?.map((product) => product.regularPrice),
  // );

  // console.log("chkchk", filteredProducts?.length);

  // console.log(
  //   "chk price final",
  //   filteredProducts?.map((product) => calculateFinalPrice(product)),
  // );

  const filterOptions = [
    {
      label: "Sort by",
      arrayKey: "sortBy",
      selectionMode: "single",
      type: "select",
      options: [
        "Newest",
        "Price (Low to High)",
        "Price (High to Low)",
        "Clear",
      ],
    },
    {
      label: "Filter by",
      arrayKey: "filterBy",
      selectionMode: "multiple",
      type: "select",
      options: [
        "Popular",
        "New Arrivals",
        // "In Stock",
        "On Sale",
        "Clear",
      ],
    },
    {
      label: "Category",
      arrayKey: "category",
      selectionMode: "single",
      type: "select",
      options: [
        ...new Set(unfilteredProducts?.flatMap((product) => product.category)),
        "Clear",
      ],
    },
    {
      label: "Sizes",
      arrayKey: "sizes",
      selectionMode: "multiple",
      type: "select",
      options: [
        ...new Set(filteredProducts?.flatMap((product) => product.allSizes)),
        "Clear",
      ],
    },
    {
      label: "Colors",
      arrayKey: "colors",
      selectionMode: "multiple",
      type: "select",
      options: [
        // ...new Set(filteredProducts?.flatMap((product) => product.availableColors)),
        ...[
          ...new Set(
            filteredProducts
              ?.flatMap((product) => product.availableColors)
              .map(JSON.stringify),
          ),
        ].map(JSON.parse),
        "Clear",
      ],
    },
    // {
    //   label: "Materials",
    //   arrayKey: "materials",
    //   selectionMode: "multiple",
    //   type: "select",
    //   options: [
    //     ...new Set(filteredProducts?.flatMap((product) => product.materials)),
    //     "Clear",
    //   ],
    // },
    {
      label: "Price",
      arrayKey: "price",
      selectionMode: "single",
      type: "range",
      options: [
        {
          min: !filteredProducts
            ? 0
            : Math.min(
                ...filteredProducts?.map((product) =>
                  calculateFinalPrice(product),
                ),
              ),
          max: !filteredProducts
            ? 0
            : Math.max(
                ...filteredProducts?.map((product) =>
                  calculateFinalPrice(product),
                ),
              ),
        },
      ],
    },
  ];

  const isNoFilterOptionSelected = () => {
    return Object.values(selectedFilterOptions).every((value) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else {
        return !value.min || !value.max;
      }
    });
  };

  return (
    <section
      className={
        !isFilterButtonClicked
          ? "hidden"
          : "[&>div]:filter-options relative z-[1] space-y-4 [&>div]:flex"
      }
    >
      <div>
        {filterOptions.map((filterOption, filterOptionIndex) =>
          filterOption.type === "select" ? (
            <Select
              key={filterOptionIndex}
              className={`w-fit ${selectedFilterOptions[filterOption.arrayKey].length ? "order-first" : "order-last"}`}
              label={
                <>
                  {filterOption.label}
                  {!!selectedFilterOptions[filterOption.arrayKey].length && (
                    <span
                      className={`text-black ${filterOption.selectionMode === "multiple" ? "ml-2 rounded-md bg-[#B96826] px-2 py-1 text-[10px] text-white" : ""}`}
                    >
                      {filterOption.selectionMode === "single"
                        ? ": " +
                          selectedFilterOptions[
                            filterOption.arrayKey
                          ].toString()
                        : selectedFilterOptions[filterOption.arrayKey].length}
                    </span>
                  )}
                </>
              }
              selectionMode={filterOption.selectionMode}
              size="sm"
              defaultSelectedKeys=""
              selectedKeys={selectedFilterOptions[filterOption.arrayKey]}
              onSelectionChange={(newSelectedKeys) => {
                setSelectedFilterOptions((prevSelectedValues) => ({
                  ...prevSelectedValues,
                  [filterOption.arrayKey]: Array.from(newSelectedKeys).includes(
                    "Clear",
                  )
                    ? new Set([])
                    : Array.from(newSelectedKeys),
                }));
              }}
              classNames={{
                mainWrapper: [
                  `z-[1] text-neutral-700 [&>button]:px-4 [&>button]:duration-300 hover:[&>button]:bg-[#F4D3BA] ${selectedFilterOptions[filterOption.arrayKey].length ? "[&>button]:bg-[#F4D3BA]" : "[&>button]:bg-[#FBEDE2]"}`,
                ],
                label: [
                  "text-neutral-700 static mr-4 group-data-[filled=true]:scale-100 group-data-[filled=true]:-translate-y-0",
                ],
                innerWrapper: ["hidden"],
                popoverContent: ["min-w-44 w-fit"],
                listbox: [
                  "[&_li:last-child]:mt-3.5 [&_li:last-child]:bg-[#F4D3BA] [&_li:last-child]:p-2.5 [&_li:last-child]:text-center [&_li:last-child>span]:font-semibold [&_li:last-child>span:has(svg)]:hidden hover:[&_li:last-child]:bg-neutral-700 hover:[&_li:last-child]:text-neutral-100",
                ],
              }}
            >
              {filterOption.options.map((option) => (
                <SelectItem
                  key={
                    filterOption.label === "Colors" && option !== "Clear"
                      ? option.label
                      : option
                  }
                  startContent={
                    filterOption.label === "Colors" &&
                    option !== "Clear" && (
                      <div
                        className="pointer-events-none size-5 rounded-md ring-1 ring-neutral-300"
                        style={{
                          background:
                            option.label !== "Multicolor"
                              ? option.color
                              : "linear-gradient(90deg, blue 0%, red 40%, green 80%)",
                        }}
                      />
                    )
                  }
                >
                  {filterOption.label === "Colors" && option !== "Clear"
                    ? option.label
                    : option}
                </SelectItem>
              ))}
            </Select>
          ) : (
            <Popover
              placement="bottom-start"
              key={filterOptionIndex}
              offset={5}
              containerPadding={40}
              onOpenChange={(isOpen) => {
                const popoverButtonIcon = document.querySelector(
                  ".popover-button svg",
                );

                popoverButtonIcon.style.transform = `rotate(${isOpen ? 180 : 0}deg)`;
              }}
            >
              <PopoverTrigger>
                <Button
                  disableRipple
                  endContent={<HiChevronDown />}
                  className={`popover-button z-[1] h-12 w-auto min-w-fit !scale-100 gap-0 rounded-lg bg-[#FBEDE2] pl-4 pr-3 font-semibold text-neutral-700 !opacity-100 shadow-sm hover:bg-[#F4D3BA] [&>svg]:ml-3 [&>svg]:h-[13px] [&>svg]:rotate-0 [&>svg]:transition-[transform] [&>svg]:duration-100 ${selectedFilterOptions.price.min || selectedFilterOptions.price.max ? "order-first bg-[#F4D3BA]" : "order-last bg-[#FBEDE2]"}`}
                >
                  {filterOption.label}
                  <span
                    className={
                      selectedFilterOptions.price.min ||
                      selectedFilterOptions.price.max
                        ? "inline text-black"
                        : "hidden"
                    }
                  >{`: ৳ ${selectedFilterOptions.price.min?.toLocaleString()} - ৳ ${selectedFilterOptions.price.max?.toLocaleString()}`}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="items-start gap-y-8 p-4">
                <div className="flex gap-x-2.5">
                  <Input
                    className="w-fit font-semibold"
                    type="number"
                    label="Min price:"
                    labelPlacement="outside"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-small text-default-400">৳</span>
                      </div>
                    }
                    min={filterOption.options[0].min / 100}
                    max={filterOption.options[0].max * 100}
                    isInvalid={
                      selectedFilterOptions.price?.min <
                        filterOption.options[0].min ||
                      selectedFilterOptions.price?.min >
                        selectedFilterOptions.price?.max
                    }
                    value={selectedFilterOptions.price?.min}
                    defaultValue={filterOption.options[0].min}
                    onValueChange={(value) => {
                      setSelectedFilterOptions((prevOptions) => ({
                        ...prevOptions,
                        price: {
                          min: Number(value),
                          max: Number(
                            prevOptions.price?.max ||
                              filterOption.options[0].max,
                          ),
                        },
                      }));
                    }}
                  />
                  <Input
                    className="w-fit font-semibold"
                    type="number"
                    label="Max price:"
                    labelPlacement="outside"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-small text-default-400">৳</span>
                      </div>
                    }
                    min={filterOption.options[0].min / 100}
                    max={filterOption.options[0].max * 100}
                    isInvalid={
                      selectedFilterOptions.price?.max >
                        filterOption.options[0].max ||
                      selectedFilterOptions.price?.max <
                        selectedFilterOptions.price?.min
                    }
                    value={selectedFilterOptions.price?.max}
                    defaultValue={filterOption.options[0].max}
                    onValueChange={(value) => {
                      setSelectedFilterOptions((prevOptions) => ({
                        ...prevOptions,
                        price: {
                          min: Number(
                            prevOptions.price?.min ||
                              filterOption.options[0].min,
                          ),
                          max: Number(value),
                        },
                      }));
                    }}
                  />
                </div>
                <Slider
                  label="Price Range"
                  aria-label="Price Range"
                  step={1}
                  minValue={filterOption.options[0].min}
                  maxValue={filterOption.options[0].max}
                  value={[
                    selectedFilterOptions.price?.min ||
                      filterOption.options[0].min,
                    selectedFilterOptions.price?.max ||
                      filterOption.options[0].max,
                  ]}
                  defaultValue={[
                    selectedFilterOptions.price?.min ||
                      filterOption.options[0].min,
                    selectedFilterOptions.price?.max ||
                      filterOption.options[0].max,
                  ]}
                  onChange={([min, max] = values) => {
                    setSelectedFilterOptions((prevOptions) => ({
                      ...prevOptions,
                      price: {
                        min: min,
                        max: max,
                      },
                    }));
                  }}
                  formatOptions={{
                    style: "currency",
                    currency: "BDT",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }}
                  classNames={{
                    filler: ["bg-[#F4D3BA]"],
                    thumb: [
                      "bg-[#F4D3BA] hover:bg-[#d39261] focus:bg-[#d39261]",
                    ],
                    label: ["hidden"],
                    value: [
                      "before:content-['Showing_for:_'] before:font-semibold",
                    ],
                  }}
                />
                <Button
                  disableRipple
                  className="mt-3.5 w-full !scale-100 bg-[#F4D3BA] p-2.5 font-semibold !opacity-100 hover:bg-neutral-700 hover:text-neutral-100"
                  onClick={() =>
                    setSelectedFilterOptions((prevOptions) => ({
                      ...prevOptions,
                      price: {
                        min: undefined,
                        max: undefined,
                      },
                    }))
                  }
                >
                  Clear
                </Button>
              </PopoverContent>
            </Popover>
          ),
        )}
        {!isNoFilterOptionSelected() && (
          <Button
            disableRipple
            className="z-[1] order-last h-12 w-auto min-w-fit !scale-100 rounded-lg bg-[#d4ffce] px-4 font-semibold text-neutral-700 !opacity-100 shadow-sm hover:bg-[#bdf6b4]"
            onClick={() =>
              setSelectedFilterOptions({
                sortBy: new Set([]),
                filterBy: new Set([]),
                category: new Set([]),
                sizes: new Set([]),
                colors: new Set([]),
                // materials: new Set([]),
                price: {
                  min: undefined,
                  max: undefined,
                },
              })
            }
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="quick-filter-options">
        <button
          className="bg-[#cd4747] hover:bg-[#ad3d3d]"
          onClick={() => {
            setSelectedFilterOptions((prevSelectedValues) => ({
              ...prevSelectedValues,
              filterBy: ["Popular"],
            }));
          }}
        >
          <div className="relative h-9 w-6">
            <LuBadge className="h-full w-full object-contain" />
            <HiOutlineLightningBolt className="absolute left-1/2 top-1/2 h-full w-2/3 -translate-x-1/2 -translate-y-1/2 object-contain" />
          </div>
          <p>Trending</p>
        </button>
        <button
          className="bg-[#5c49d9] hover:bg-[#4b3cac]"
          onClick={() => {
            setSelectedFilterOptions((prevSelectedValues) => ({
              ...prevSelectedValues,
              filterBy: ["New Arrivals"],
            }));
          }}
        >
          <MdOutlineNewReleases className="h-9 w-6 object-contain" />
          <p>New Arrival</p>
        </button>
        <button
          className="bg-[#32aa54] hover:bg-[#2d7843]"
          onClick={() => {
            setSelectedFilterOptions((prevSelectedValues) => ({
              ...prevSelectedValues,
              filterBy: ["On Sale"],
            }));
          }}
        >
          <TbRosetteDiscount className="h-9 w-6 object-contain" />
          <p>On Sale</p>
        </button>
      </div>
    </section>
  );
}
import { useRouter } from "next/navigation";
import { TbZoomExclamation } from "react-icons/tb";

export default function EmptyShopProducts({
  keyword,
  isNoFilterOptionSelected,
  setSelectedFilterOptions,
}) {
  const router = useRouter();

  return (
    <section className="flex grow flex-col items-center justify-center self-center font-semibold">
      <TbZoomExclamation className="size-32 text-[var(--color-secondary-regular)] sm:size-40" />
      <p className="mt-2 max-w-md text-center text-neutral-400">
        No match found for {!keyword ? "" : `"${keyword}"`}
        {isNoFilterOptionSelected
          ? ""
          : (!keyword ? " " : " and ") + "the selected filters"}
      </p>
      <button
        className="mt-9 block rounded-lg bg-[var(--color-primary-regular)] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[var(--color-primary-dark)]"
        onClick={() => {
          setSelectedFilterOptions({
            sortBy: new Set([]),
            filterBy: new Set([]),
            category: new Set([]),
            sizes: new Set([]),
            colors: new Set([]),
            price: {
              min: undefined,
              max: undefined,
            },
          });

          router.push("/shop");
        }}
      >
        Clear All Filters
      </button>
    </section>
  );
}

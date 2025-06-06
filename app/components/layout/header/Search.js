import { useLoading } from "@/app/contexts/loading";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get("search");
  const filterParam = searchParams.get("filterBy");
  const categoryParam = searchParams.get("category");
  const { setIsPageLoading } = useLoading();
  const closeBtnRef = useRef(null);

  const handleSearchSubmission = (event) => {
    event.preventDefault();

    const keyword = event.target.lastChild?.value;

    if (keyword === keywordParam || (!keyword && !keywordParam)) return;

    const keywordQuery = !keyword ? "" : `?search=${keyword}`;
    const filterQuery = !filterParam
      ? ""
      : `${!keyword ? "?" : "&"}filterBy=${filterParam}`;
    const categoryQuery = !categoryParam
      ? ""
      : `${!keyword ? "?" : "&"}category=${categoryParam}`;

    setIsPageLoading(true);

    router.push(`/shop${keywordQuery}${filterQuery}${categoryQuery}`);
  };

  const handleCloseButtonClick = (event) => {
    const closeButtonElement = event.currentTarget;
    const inputElement = closeButtonElement.parentElement?.lastChild;

    closeButtonElement.style.opacity = 0;
    closeButtonElement.style.pointerEvents = "none";
    inputElement.value = "";

    if (!!keywordParam) {
      const filterQuery = !filterParam ? "" : `?filterBy=${filterParam}`;
      const categoryQuery = !categoryParam ? "" : `?category=${categoryParam}`;

      router.push(`/shop${filterQuery}${categoryQuery}`);
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();

    const closeButtonElement = event.target.parentElement?.firstChild;
    const isInputValid = !!event.target.value;

    closeButtonElement.style.opacity = !isInputValid ? "0" : "1";
    closeButtonElement.style.pointerEvents = !isInputValid ? "none" : "auto";
  };

  useEffect(() => {
    if (!keywordParam && !!closeBtnRef?.current) {
      closeBtnRef.current.click();
    }
  }, [keywordParam]);

  return (
    <form
      className="relative bg-white text-sm font-semibold text-neutral-600"
      onSubmit={handleSearchSubmission}
    >
      {/* Close button */}
      <button
        ref={closeBtnRef}
        className="absolute right-3 top-1/2 z-[1] flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 transition-[background-color,opacity] duration-300 ease-in-out hover:bg-neutral-300 [&>svg]:hover:text-neutral-800"
        style={{
          opacity: !keywordParam ? "0" : "1",
          pointerEvents: !keywordParam ? "none" : "auto",
        }}
        type="button"
        onClick={handleCloseButtonClick}
      >
        <IoClose className="size-4 text-neutral-500 transition-[color] duration-300 ease-in-out" />
      </button>
      {/* Search Icon */}
      <FiSearch
        onClick={(
          event, // Focus on search bar input
        ) =>
          event.currentTarget.parentElement
            ?.querySelector("#search-bar")
            ?.focus()
        }
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
      />
      {/* Search bar */}
      <input
        id="search-bar"
        placeholder="Search Products"
        type="search"
        defaultValue={keywordParam || ""}
        className="h-9 w-full rounded-[4px] border-2 border-transparent bg-neutral-100 px-4 pl-[2.5rem] outline-none transition-[border-color,background-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white max-[390px]:max-w-[168px] min-[390px]:max-sm:max-w-44 sm:w-72 sm:max-sm:text-sm xl:w-80 [&::-webkit-search-cancel-button]:[-webkit-appearance:none] [&:not(:placeholder-shown)]:border-[var(--color-secondary-500)] [&:not(:placeholder-shown)]:bg-white"
        onChange={handleInputChange}
      />
    </form>
  );
}

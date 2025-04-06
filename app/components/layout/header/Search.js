import { useLoading } from "@/app/contexts/loading";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

export default function Search({ isMobile, setIsMobileSearchSelected }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsPageLoading } = useLoading();
  const closeBtnRef = useRef(null);

  const handleSearchSubmission = (event) => {
    event.preventDefault();

    const keyword = event.target.lastChild?.value;
    setIsPageLoading(true);
    router.push(
      !keyword
        ? "/shop"
        : `/shop?search=${keyword}${!!searchParams.get("filterBy") ? `&filterBy=${searchParams.get("filterBy")}` : ""}`,
    );
    if (isMobile) setIsMobileSearchSelected(false);
  };

  const handleCloseButtonClick = (event) => {
    const closeButtonElement = event.currentTarget;
    const inputElement = closeButtonElement.parentElement?.lastChild;

    closeButtonElement.style.opacity = 0;
    closeButtonElement.style.pointerEvents = "none";
    inputElement.value = "";

    if (!!searchParams.get("search"))
      router.push(
        `/shop${!!searchParams.get("filterBy") ? `?filterBy=${searchParams.get("filterBy")}` : ""}`,
      );
    if (isMobile) setIsMobileSearchSelected(false);
  };

  const handleInputChange = (event) => {
    event.preventDefault();

    const closeButtonElement = event.target.parentElement?.firstChild;
    const isInputValid = !!event.target.value;

    closeButtonElement.style.opacity = !isInputValid ? "0" : "1";
    closeButtonElement.style.pointerEvents = !isInputValid ? "none" : "auto";
  };

  useEffect(() => {
    if (!searchParams.get("search") && !!closeBtnRef?.current) {
      closeBtnRef.current.click();
    }
  }, [searchParams]);

  return (
    <form
      className="relative bg-white text-sm font-semibold text-neutral-600"
      onSubmit={handleSearchSubmission}
    >
      {/* Close button */}
      <button
        ref={closeBtnRef}
        className="absolute right-3 top-1/2 z-[1] flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 opacity-0 transition-[background-color,opacity] duration-300 ease-in-out hover:bg-neutral-300 [&>svg]:hover:text-neutral-800"
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
            ?.querySelector(`search-bar-${isMobile ? "mobile" : "desktop"}`)
            ?.focus()
        }
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
      />
      {/* Search bar */}
      <input
        id={`search-bar-${isMobile ? "mobile" : "desktop"}`}
        placeholder="Search Products"
        type="search"
        defaultValue={searchParams.get("search") || ""}
        className="h-9 w-full rounded-lg border-2 border-transparent bg-[#f3f3f4] px-4 pl-[2.5rem] outline-none transition-[border-color,background-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white [&::-webkit-search-cancel-button]:[-webkit-appearance:none] [&:not(:placeholder-shown)]:border-[#F4D3BA] [&:not(:placeholder-shown)]:bg-white"
        onChange={handleInputChange}
      />
    </form>
  );
}

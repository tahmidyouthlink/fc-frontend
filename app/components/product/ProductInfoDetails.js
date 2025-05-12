import { useState } from "react";

export default function ProductInfoDetails({ productInfoDetails }) {
  const [activeTabKey, setActiveTabKey] = useState("productDetails");
  const predefinedTabs = {
    productDetails: "Description",
    ...(productInfoDetails?.sizeFit && { sizeFit: "Size & Fit" }),
    ...(productInfoDetails?.materialCare && {
      materialCare: "Material & Care",
    }),
  };

  return (
    <section className="mb-10 w-full gap-x-7 sm:max-md:flex xl:flex xl:overflow-y-auto">
      <div>
        {/* Tabs */}
        <ul className="mx-auto mb-4 flex w-fit font-semibold text-neutral-600 max-sm:w-full max-sm:overflow-x-auto sm:max-md:mb-0 sm:max-md:block xl:mb-0 xl:block">
          {Object.entries(predefinedTabs).map(([backendKey, frontendLabel]) => {
            return (
              <li
                key={"product-details-tab-" + backendKey + frontendLabel}
                className={`-mt-0.5 shrink-0 cursor-pointer text-nowrap rounded-md px-4 py-2.5 transition-[background-color] duration-300 ease-in-out lg:px-5 ${activeTabKey === backendKey ? "bg-neutral-200" : "bg-transparent hover:bg-neutral-100"}`}
                onClick={() => setActiveTabKey(backendKey)}
              >
                {frontendLabel}
              </li>
            );
          })}
        </ul>
      </div>
      {/* Tab Details Section */}
      <div className="custom-desktop-scrollbar mx-auto w-full space-y-3.5 overflow-y-auto md:max-xl:overflow-y-auto md:max-lg:h-60 lg:max-xl:h-72">
        <div
          className="custom-desktop-scrollbar list-none overflow-y-auto text-neutral-500 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_img]:rounded-lg"
          dangerouslySetInnerHTML={{ __html: productInfoDetails[activeTabKey] }}
        ></div>
      </div>
    </section>
  );
}

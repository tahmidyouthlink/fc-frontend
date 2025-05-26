import { Suspense } from "react";
import axios from "axios";
import Header from "../components/layout/header/Header";
import ScrollTopButton from "../components/ui/ScrollTopButton";
import Footer from "../components/footer/Footer";
import ChatButton from "../components/ui/ChatButton";
import LoaderFrontend from "../components/shared/LoaderFrontend";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export const metadata = {
  title: "Fashion Commerce",
  description:
    "Discover the latest trends in men's fashion at Fashion Commerce. Shop our extensive collection of stylish clothing, footwear, and accessories. Enjoy exclusive deals, fast shipping, and top-notch customer service. Elevate your wardrobe with our curated selection of high-quality men's products.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  let topHeaderData;

  try {
    const { data } = await axios.get(
      "https://fashion-commerce-backend.vercel.app/get-all-header-collection",
    );
    topHeaderData = data[0];
  } catch (error) {
    console.error(
      "Fetch error (top header):",
      error.response?.data?.message || error.response?.data,
    );
  }

  const topHeaderHeight = topHeaderData?.isSlideEnabled ? "28.5px" : "0px";

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <style>{`:root {
          --top-header-height: ${topHeaderHeight};
          --color-primary-lightest: #fafff9;
          --color-primary-lighter: #d7ecd2;
          --color-primary-light: #ebfeeb;
          --color-primary-regular: #d4ffce;
          --color-primary-dark: #bdf6b4;
          --color-primary-darker: #6cb461;
          --color-primary-darkest: #57944e;
          --color-secondary-lightest: #fffaf4;
          --color-secondary-lighter: #ffffff;
          --color-secondary-light: #fbede2;
          --color-secondary-regular: #ffddc2;
          --color-secondary-dark: #fbcfb0;
          --color-secondary-darker: #d39261;
          --color-secondary-darkest: #b96826;
          --color-tertiary-lightest: #ffffff;
          --color-tertiary-lighter: #ffffff;
          --color-tertiary-light: #ffffff;
          --color-tertiary-regular: #ecdbef;
          --color-tertiary-dark: #e7c5ed;
          --color-tertiary-darker: #ffffff;
          --color-tertiary-darkest: #ffffff;
          --color-quaternary-lightest: #ffffff;
          --color-quaternary-lighter: #ffffff;
          --color-quaternary-light: #ffffff;
          --color-quaternary-regular: #ffffff;
          --color-quaternary-dark: #ffffff;
          --color-quaternary-darker: #ffffff;
          --color-quaternary-darkest: #ffffff;
          --color-moving-bubble-primary: #d7f8d3;
          --color-moving-bubble-secondary: #f8dfcb;
          --color-moving-bubble-tertiary: #ffffff;
          --color-moving-bubble-quaternary: #ffffff;
          --color-static-bubble-primary: #e0fcdc;
          --color-static-bubble-secondary: #fedcbf;
          --color-static-bubble-tertiary: #ffffff;
          --color-static-bubble-quaternary: #ffffff;
        }`}</style>
      <div className="flex min-h-dvh flex-col [&>main]:grow">
        <Header
          isTopHeaderEnabled={topHeaderData?.isSlideEnabled}
          slides={topHeaderData?.slides}
          slideDuration={topHeaderData?.slideDuration}
          isAutoSlideEnabled={topHeaderData?.isAutoSlideEnabled}
          bgColor={topHeaderData?.topHeaderColor}
          textColor={topHeaderData?.textColor}
          isHighlightedColorEnabled={topHeaderData?.isHighlightedColorEnabled}
          highlightedColor={topHeaderData?.highlightedTextColor}
        />
        <LoaderFrontend />
        <ScrollTopButton />
        <ChatButton />
        {children}
        <Footer />
      </div>
    </Suspense>
  );
}

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
          --color-primary-100: #fafff9;
          --color-primary-200: #d7ecd2;
          --color-primary-300: #ebfeeb;
          --color-primary-400: #dfffda;
          --color-primary-500: #d4ffce;
          --color-primary-600: #ffffff;
          --color-primary-700: #bdf6b4;
          --color-primary-800: #6cb461;
          --color-primary-900: #57944e;
          --color-secondary-100: #fffaf4;
          --color-secondary-200: #ffffff;
          --color-secondary-300: #fbede2;
          --color-secondary-400: #ffecd5;
          --color-secondary-500: #ffddc2;
          --color-secondary-600: #fbcfb0;
          --color-secondary-700: #ffffff;
          --color-secondary-800: #d39261;
          --color-secondary-900: #b96826;
          --color-tertiary-100: #ffffff;
          --color-tertiary-200: #ffffff;
          --color-tertiary-300: #ffffff;
          --color-tertiary-400: #ffffff;
          --color-tertiary-500: #ecdbef;
          --color-tertiary-600: #e7c5ed;
          --color-tertiary-700: #ffffff;
          --color-tertiary-800: #ffffff;
          --color-tertiary-900: #ffffff;
          --color-quaternary-100: #ffffff;
          --color-quaternary-200: #ffffff;
          --color-quaternary-300: #ffffff;
          --color-quaternary-400: #ffffff;
          --color-quaternary-500: #ffffff;
          --color-quaternary-600: #ffffff;
          --color-quaternary-700: #ffffff;
          --color-quaternary-800: #ffffff;
          --color-quaternary-900: #ffffff;
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

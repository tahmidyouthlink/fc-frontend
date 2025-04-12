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
      <style>{`:root { --top-header-height: ${topHeaderHeight}; }`}</style>
      <div className="flex min-h-dvh flex-col [&>main]:grow">
        <Header
          isTopHeaderEnabled={topHeaderData?.isSlideEnabled}
          slides={topHeaderData?.slides}
          slideDuration={topHeaderData?.slideDuration}
          isAutoSlideEnabled={topHeaderData?.isAutoSlideEnabled}
          bgColor={topHeaderData?.topHeaderColor}
          textColor={topHeaderData?.textColor}
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

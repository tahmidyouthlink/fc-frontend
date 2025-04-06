import { Suspense } from "react";
import Header from "../components/layout/header/Header";
import LoaderFrontend from "../components/shared/LoaderFrontend";
import ScrollTopButton from "../components/ui/ScrollTopButton";
import Footer from "../components/footer/Footer";
import ChatButton from "../components/ui/ChatButton";

export const metadata = {
  title: "Fashion Commerce",
  description:
    "Discover the latest trends in men's fashion at Fashion Commerce. Shop our extensive collection of stylish clothing, footwear, and accessories. Enjoy exclusive deals, fast shipping, and top-notch customer service. Elevate your wardrobe with our curated selection of high-quality men's products.",
};

export default async function RootLayout({ children }) {
  // Fetch theme data from the fake API
  const res = await fetch("http://localhost:3000/api/theme", {
    cache: "no-store", // Disable caching to always get fresh data
  });
  const data = await res.json();
  const isTopHeaderEnabled = data.isTopHeaderEnabled;

  // Set the CSS variable on the server before rendering
  const topHeaderHeight = isTopHeaderEnabled ? "28.5px" : "0px";

  return (
    <Suspense fallback={<LoaderFrontend />}>
      <style>{`:root { --top-header-height: ${topHeaderHeight}; }`}</style>
      <div className="flex min-h-dvh flex-col [&>main]:grow">
        <Header isTopHeaderEnabled={isTopHeaderEnabled} />
        <LoaderFrontend />
        <ScrollTopButton />
        <ChatButton />
        {children}
        <Footer />
      </div>
    </Suspense>
  );
}

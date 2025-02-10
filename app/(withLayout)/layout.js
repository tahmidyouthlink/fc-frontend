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

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col [&>main]:grow">
      <Header />
      <LoaderFrontend />
      <ScrollTopButton />
      <ChatButton />
      {children}
      <Footer />
    </div>
  );
}

import { Oxygen } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import ReactTanstackProvider from "./utils/Provider/ReactTanstackProvider";
import { LoadingProvider } from "./contexts/loading";

const oxygen = Oxygen({ subsets: ["latin"], weight: ["300", "400", "700"] });

export const metadata = {
  title: "Fashion Commerce",
  description:
    "Discover the latest trends in men's fashion at Fashion Commerce. Shop our extensive collection of stylish clothing, footwear, and accessories. Enjoy exclusive deals, fast shipping, and top-notch customer service. Elevate your wardrobe with our curated selection of high-quality men's products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={oxygen.className}>
        <ReactTanstackProvider>
          <NextUIProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </NextUIProvider>
          <Toaster />
        </ReactTanstackProvider>
      </body>
    </html>
  );
}

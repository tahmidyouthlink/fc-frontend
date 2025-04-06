import { Oxygen } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import ReactTanstackProvider from "./utils/Provider/ReactTanstackProvider";
import { LoadingProvider } from "./contexts/loading";
import { AuthProvider } from "./contexts/auth";
import SessionWrapper from "./components/layout/SessionWrapper";
import "./globals.css";

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
            <SessionWrapper>
              <AuthProvider>
                <LoadingProvider>{children}</LoadingProvider>
              </AuthProvider>
            </SessionWrapper>
          </NextUIProvider>
          <Toaster />
        </ReactTanstackProvider>
      </body>
    </html>
  );
}

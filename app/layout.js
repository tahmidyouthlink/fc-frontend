import { Oxygen } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import { LoadingProvider } from "./contexts/loading";
import SessionWrapper from "./components/layout/SessionWrapper";
import "./globals.css";

const oxygen = Oxygen({ subsets: ["latin"], weight: ["300", "400", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={oxygen.className}>
        <SessionWrapper>
          <NextUIProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </NextUIProvider>
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  );
}

import { Suspense } from "react";
import Script from "next/script";
import { Oxygen } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import { LoadingProvider } from "./contexts/loading";
import SessionWrapper from "./components/layout/SessionWrapper";
import GAClientTracker from "./components/GAClientTracker";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import "./globals.css";

const oxygen = Oxygen({ subsets: ["latin"], weight: ["300", "400", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}', { send_page_view: false });
          `}
        </Script>
      </head>
      <body className={oxygen.className}>
        <SessionWrapper>
          <NextUIProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </NextUIProvider>
          <Toaster />
        </SessionWrapper>
        <Suspense fallback={<LoadingSpinner />}>
          <GAClientTracker />
        </Suspense>
      </body>
    </html>
  );
}

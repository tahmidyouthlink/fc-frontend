"use client";

import { useState, useEffect } from "react";
import CheckoutConfirmation from "@/app/components/checkout/CheckoutConfirmation";
import CheckoutForm from "./CheckoutForm";
import CheckoutEmpty from "./CheckoutEmpty";

export default function CheckoutContents({
  productList,
  specialOffers,
  shippingZones,
  primaryLocation,
  legalPolicyPdfLinks,
}) {
  const [cartItems, setCartItems] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isPaymentStepDone, setIsPaymentStepDone] = useState(false);

  useEffect(() => {
    if (!!productList) {
      const localCart = JSON.parse(localStorage.getItem("cartItems"));
      const filteredLocalCart = localCart?.filter(
        (localItem) =>
          !!productList?.find(
            (product) =>
              product?._id === localItem._id && product?.status === "active",
          ),
      );

      setCartItems(filteredLocalCart);
      if (localCart?.length !== filteredLocalCart?.length) {
        localStorage.setItem("cartItems", JSON.stringify(filteredLocalCart));
      }
    }

    const handleStorageUpdate = () =>
      setCartItems(JSON.parse(localStorage.getItem("cartItems")));

    window.addEventListener("storageCart", handleStorageUpdate);

    return () => {
      window.removeEventListener("storageCart", handleStorageUpdate);
    };
  }, [productList]);

  if (isPaymentStepDone)
    return (
      <CheckoutConfirmation
        orderDetails={orderDetails}
        isPaymentStepDone={isPaymentStepDone}
      />
    );

  return (
    <main className="relative -mt-[calc(256*4px)] bg-neutral-50 pb-[var(--section-padding-double)] text-sm text-neutral-500 max-sm:-mt-[calc(256*2px)] md:text-base lg:pb-[var(--section-padding)] [&_h2]:uppercase [&_h2]:text-neutral-700">
      {/* Left Mesh Gradient */}
      <div className="sticky left-[5%] top-[55%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
      {/* Middle-Left Mesh Gradient */}
      <div className="sticky left-[30%] top-[5%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s] max-sm:left-[5%]" />
      {/* Middle-Right Mesh Gradient */}
      <div className="sticky left-[55%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] max-sm:left-3/4" />
      {/* Right Mesh Gradient */}
      <div className="sticky left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:2s] max-sm:hidden" />
      {!!cartItems?.length ? (
        <CheckoutForm
          productList={productList}
          specialOffers={specialOffers}
          shippingZones={shippingZones}
          primaryLocation={primaryLocation}
          setIsPaymentStepDone={setIsPaymentStepDone}
          cartItems={cartItems}
          setOrderDetails={setOrderDetails}
          legalPolicyPdfLinks={legalPolicyPdfLinks}
        />
      ) : (
        <CheckoutEmpty />
      )}
    </main>
  );
}

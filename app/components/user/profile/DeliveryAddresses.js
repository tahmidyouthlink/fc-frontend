import { useEffect, useState } from "react";
import DeliveryAddress from "./DeliveryAddress";
import { RiAddLine, RiMapPinFill } from "react-icons/ri";

export default function DeliveryAddresses({
  userData,
  setUserData,
  deliveryAddresses,
}) {
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  useEffect(() => {
    const newAddressForm = document.getElementById("new-adddress-form");

    if (isAddingNewAddress)
      newAddressForm.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [isAddingNewAddress]);

  return (
    <section className="w-full space-y-4 rounded-md border-2 border-[#eeeeee] p-3.5 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[17px] font-semibold uppercase sm:text-lg md:text-xl">
          Delivery Address
        </h2>
        <button
          className="flex items-center gap-1.5 rounded-md bg-[#d4ffce] p-2.5 text-xs font-semibold text-neutral-700 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] max-md:[&_p]:hidden max-md:[&_svg]:size-4"
          onClick={() => setIsAddingNewAddress(true)}
        >
          <RiAddLine className="text-base" />
          <p>Add</p>
        </button>
      </div>
      {!deliveryAddresses?.length ? (
        <div
          className={`!mt-7 [&>*]:mx-auto [&>*]:w-fit ${isAddingNewAddress ? "hidden" : ""}`}
        >
          <RiMapPinFill className="size-20 text-[#F4D3BA]" />
          <p className="mt-3 text-neutral-500">
            You have not given any address yet.
          </p>
          <button
            onClick={() => setIsAddingNewAddress(true)}
            className="mt-5 block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
          >
            Add Your Address
          </button>
        </div>
      ) : (
        deliveryAddresses.map((address, addressIndex) => {
          return (
            <DeliveryAddress
              key={address.id}
              type="update"
              address={address}
              addressNumber={addressIndex + 1}
              userData={userData}
              setUserData={setUserData}
              isAddingNewAddress={isAddingNewAddress}
              setIsAddingNewAddress={setIsAddingNewAddress}
            />
          );
        })
      )}
      {isAddingNewAddress && (
        <DeliveryAddress
          type="new"
          addressNumber={deliveryAddresses.length + 1}
          userData={userData}
          setUserData={setUserData}
          isAddingNewAddress={isAddingNewAddress}
          setIsAddingNewAddress={setIsAddingNewAddress}
          isAddressListEmpty={!deliveryAddresses?.length}
        />
      )}
    </section>
  );
}

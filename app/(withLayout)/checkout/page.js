"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TbShoppingCartExclamation } from "react-icons/tb";
import toast from "react-hot-toast";
import { parseDate } from "@internationalized/date";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import useProductsInformation from "@/app/hooks/useProductsInformation";
import useOffers from "@/app/hooks/useOffers";
import generateOrderId from "@/app/utils/generateOrderId";
import useOrders from "@/app/hooks/useOrders";
import useCustomers from "@/app/hooks/useCustomers";
import useLocations from "@/app/hooks/useLocations";
import generateCustomerId from "@/app/utils/generateCustomerId";
import customCurrentDateTimeFormat from "@/app/utils/customCurrentDateTimeFormat";
import {
  calculateFinalPrice,
  calculateProductSpecialOfferDiscount,
  calculatePromoDiscount,
  calculateShippingCharge,
  calculateSubtotal,
  calculateTotalSpecialOfferDiscount,
  checkIfOnlyRegularDiscountIsAvailable,
  checkIfSpecialOfferIsAvailable,
  getEstimatedDeliveryTime,
  getExpectedDeliveryDate,
  getProductSpecialOffer,
} from "@/app/utils/orderCalculations";
import useShippingZones from "@/app/hooks/useShippingZones";
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import checkIfPromoCodeIsValid from "@/app/utils/isPromoCodeValid";
import TransitionLink from "@/app/components/ui/TransitionLink";
import CheckoutLogin from "@/app/components/checkout/user/CheckoutLogin";
import CheckoutRegister from "@/app/components/checkout/user/CheckoutRegister";
import CheckoutPersonalInfo from "@/app/components/checkout/user/CheckoutPersonalInfo";
import CheckoutDeliveryAddress from "@/app/components/checkout/user/CheckoutDeliveryAddress";
import CheckoutPromoCode from "@/app/components/checkout/user/CheckoutPromoCode";
import CheckoutPaymentMethod from "@/app/components/checkout/user/CheckoutPaymentMethod";
import CheckoutCart from "@/app/components/checkout/cart/CheckoutCart";
import CheckoutConfirmation from "@/app/components/checkout/CheckoutConfirmation";

export default function Checkout() {
  const { user, userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [productList, isProductListLoading, productRefetch] =
    useProductsInformation();
  const [orderList, isOrderListLoading, orderRefetch] = useOrders();
  const [customerList, isCustomerListLoading, customerRefetch] = useCustomers();
  const [shippingZones, isShippingZonesLoading, shippingZonesRefetch] =
    useShippingZones();
  const [specialOffers, isSpecialOffersLoading, specialOffersRefetch] =
    useOffers();
  const [locationList, isLocationListLoading, locationRefetch] = useLocations();
  const [cartItems, setCartItems] = useState(null);
  const [userPromoCode, setUserPromoCode] = useState("");
  const isPromoCodeValid = checkIfPromoCodeIsValid(
    userPromoCode,
    calculateSubtotal(productList, cartItems, specialOffers),
  );
  const [orderDetails, setOrderDetails] = useState(null);
  const [isAgreementCheckboxSelected, setIsAgreementCheckboxSelected] =
    useState(true);
  const [isSaveAddressCheckboxSelected, setIsSaveAddressCheckboxSelected] =
    useState(false);
  const [isPaymentStepDone, setIsPaymentStepDone] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const {
    register,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.userInfo?.personalInfo?.customerName || "",
      email: userData?.email || "",
      hometown: userData?.userInfo?.personalInfo?.hometown || "",
      dob: userData?.userInfo?.personalInfo?.dob
        ? parseDate(userData.userInfo.personalInfo.dob)
        : null,
      phoneNumber: userData?.userInfo?.personalInfo?.phoneNumber || "",
      altPhoneNumber: userData?.userInfo?.personalInfo?.phoneNumber2 || "",
      addressLineOne: userData?.userInfo?.savedDeliveryAddress?.address1 || "",
      addressLineTwo: userData?.userInfo?.savedDeliveryAddress?.address2 || "",
      city: userData?.userInfo?.savedDeliveryAddress?.city || "",
      postalCode: userData?.userInfo?.savedDeliveryAddress?.postalCode || "",
      note: "",
      deliveryType: "",
      paymentMethod: "",
    },
    mode: "onBlur",
  });

  const selectedCity = watch("city");
  const selectedDeliveryType = watch("deliveryType");

  const onSubmit = async (data) => {
    if (isAgreementCheckboxSelected) {
      setIsPageLoading(true);

      const allOrderIds = orderList?.map((order) => order.orderNumber);
      const allCustomerIds = customerList?.map(
        (customer) => customer.userInfo?.customerId,
      );
      const subtotal = calculateSubtotal(productList, cartItems, specialOffers);
      const totalSpecialOfferDiscount = calculateTotalSpecialOfferDiscount(
        productList,
        cartItems,
        specialOffers,
      );
      const promoDiscount = calculatePromoDiscount(
        productList,
        cartItems,
        userPromoCode,
        specialOffers,
      );
      const shippingCharge =
        selectedCity === "Dhaka" && selectedDeliveryType === "STANDARD"
          ? 0
          : calculateShippingCharge(
              selectedCity,
              selectedDeliveryType,
              shippingZones,
            );
      const total =
        subtotal - totalSpecialOfferDiscount - promoDiscount + shippingCharge;
      const selectedProducts = cartItems?.map((cartItem) => {
        const correspondingProduct = productList?.find(
          (product) => product._id === cartItem._id,
        );
        const specialOffer = getProductSpecialOffer(
          correspondingProduct,
          specialOffers,
          subtotal,
        );

        return {
          _id: cartItem._id,
          productTitle: correspondingProduct?.productTitle,
          productId: correspondingProduct?.productId,
          batchCode: correspondingProduct?.batchCode,
          size: cartItem.selectedSize,
          color: cartItem.selectedColor,
          sku: cartItem.selectedQuantity,
          vendors: correspondingProduct?.vendors?.map((vendor) => vendor.label),
          thumbnailImgUrl: getImageSetsBasedOnColors(
            correspondingProduct?.productVariants,
          )?.find((imgSet) => imgSet.color._id === cartItem.selectedColor._id)
            ?.images[0],
          regularPrice: Number(correspondingProduct?.regularPrice),
          discountInfo: checkIfOnlyRegularDiscountIsAvailable(
            correspondingProduct,
            specialOffers,
          )
            ? {
                discountType: correspondingProduct?.discountType,
                discountValue: correspondingProduct?.discountValue,
                finalPriceAfterDiscount: calculateFinalPrice(
                  correspondingProduct,
                  specialOffers,
                ),
              }
            : null,
          offerInfo: !specialOffer
            ? null
            : {
                offerTitle: specialOffer?.offerTitle,
                offerDiscountType: specialOffer?.offerDiscountType,
                offerDiscountValue: specialOffer?.offerDiscountValue,
                appliedOfferDiscount: calculateProductSpecialOfferDiscount(
                  correspondingProduct,
                  cartItem,
                  specialOffer,
                ),
              },
        };
      });

      const dateTime = customCurrentDateTimeFormat();
      const estimatedTime = getEstimatedDeliveryTime(
        data.city,
        data.deliveryType,
        shippingZones,
      );
      const expectedDeliveryDate = getExpectedDeliveryDate(
        dateTime,
        data.deliveryType || "STANDARD",
        estimatedTime,
      );

      const userAgent = navigator.userAgent.toLowerCase();
      let userDevice;

      if (/mobile|android|iphone|ipad|ipod|blackberry|phone/.test(userAgent)) {
        userDevice = "Mobile";
      } else if (/tablet|ipad/.test(userAgent)) {
        userDevice = "Tablet";
      } else {
        userDevice = "Desktop";
      }

      const newOrderData = {
        orderNumber: generateOrderId(allOrderIds, data.name, data.phoneNumber),
        dateTime,
        customerInfo: {
          customerName: data.name,
          customerId:
            userData?.userInfo?.customerId ||
            generateCustomerId(allCustomerIds),
          email: data.email,
          phoneNumber: data.phoneNumber,
          phoneNumber2: data.altPhoneNumber,
          hometown: data.hometown || userData?.userInfo?.personalInfo?.hometown,
          dob: !!data.dob
            ? new Date(data.dob).toISOString().split("T")[0]
            : userData?.userInfo?.personalInfo?.dob,
        },
        deliveryInfo: {
          address1: data.addressLineOne,
          address2: data.addressLineTwo,
          city: data.city,
          postalCode: data.postalCode,
          noteToSeller: data.note,
          deliveryMethod: data.deliveryType || "STANDARD",
          estimatedTime,
          expectedDeliveryDate,
        },
        productInformation: selectedProducts,
        subtotal,
        promoInfo: !isPromoCodeValid
          ? null
          : {
              _id: userPromoCode?._id,
              promoCode: userPromoCode?.promoCode,
              promoDiscountType: userPromoCode?.promoDiscountType,
              promoDiscountValue: userPromoCode?.promoDiscountValue,
              appliedPromoDiscount: promoDiscount,
            },
        totalSpecialOfferDiscount,
        shippingCharge,
        total,
        paymentInfo: {
          paymentMethod: data.paymentMethod === "bkash" ? "bKash" : "SSL",
          paymentStatus: "Paid",
          transactionId: `TXN${Math.random().toString().slice(2, 12)}`,
        },
        orderStatus: "Pending",
        userDevice,
      };

      try {
        const response = await useAxiosPublic().post("/addOrder", newOrderData);

        if (response?.data?.insertedId) {
          setOrderDetails({
            orderNumber: generateOrderId(
              allOrderIds,
              data.name,
              data.phoneNumber,
            ),
            phoneNumber: data.phoneNumber,
            totalAmount: total,
            address1: data.addressLineOne,
            address2: data.addressLineTwo,
            city: data.city,
            postalCode: data.postalCode,
          });
          setIsPaymentStepDone(true);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else toast.error("Unable to store order data to server.");
      } catch (error) {
        toast.error("Failed store data in server."); // If server error occurs
      }

      const updatedPersonalInfo = {
        ...userData.userInfo.personalInfo,
        phoneNumber: data.phoneNumber,
        phoneNumber2: data.altPhoneNumber,
        hometown: userData?.userInfo?.personalInfo?.hometown || data.hometown,
        dob:
          userData?.userInfo?.personalInfo?.dob ||
          new Date(data.dob).toISOString().split("T")[0],
      };

      const existingAddressId = userData?.userInfo?.deliveryAddresses?.find(
        (address) =>
          address?.address1 === data.addressLineOne &&
          address?.address2 === data.addressLineTwo &&
          address?.city === data.city &&
          address?.postalCode === data.postalCode,
      )?.id;

      const updatedDeliveryAddresses = !existingAddressId
        ? [
            ...userData.userInfo.deliveryAddresses,
            {
              id: `${userData?.email}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              nickname: undefined,
              address1: data.addressLineOne,
              address2: data.addressLineTwo,
              city: data.city,
              postalCode: data.postalCode,
            },
          ]
        : userData?.userInfo?.deliveryAddresses?.map((availableAddress) =>
            availableAddress.id == existingAddressId
              ? {
                  ...availableAddress,
                  address1: data.addressLineOne,
                  address2: data.addressLineTwo,
                  city: data.city,
                  postalCode: data.postalCode,
                }
              : availableAddress,
          );

      const currentWishlist = JSON.parse(localStorage.getItem("wishlistItems"));
      const currentCart = JSON.parse(localStorage.getItem("cartItems"));

      const updatedWishlist = currentWishlist.filter(
        (wishlistItem) =>
          !currentCart.some((cartItem) => wishlistItem._id === cartItem._id),
      );

      const updatedUserData = {
        ...userData,
        userInfo: {
          ...userData.userInfo,
          personalInfo: updatedPersonalInfo,
          deliveryAddresses: updatedDeliveryAddresses,
          savedDeliveryAddress: !isSaveAddressCheckboxSelected
            ? null
            : {
                address1: data.addressLineOne,
                address2: data.addressLineTwo,
                city: data.city,
                postalCode: data.postalCode,
              },
        },
        cartItems: [],
        wishlistItems: updatedWishlist,
      };

      setUserData(updatedUserData);

      try {
        await useAxiosPublic().put(
          `/updateUserInformation/${userData?._id}`,
          updatedUserData,
        );

        localStorage.removeItem("cartItems");
        window.dispatchEvent(new Event("storageCart"));
        localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
        window.dispatchEvent(new Event("storageWishlist"));
      } catch (error) {
        toast.error("Failed update data in server."); // If server error occurs
      }

      setIsPageLoading(false);
    } else
      toast.error("You must agree with the terms and conditions and policies.");
  };

  const onError = (errors) => {
    const errorTypes = Object.values(errors).map((error) => error.type);

    if (errorTypes.includes("required"))
      toast.error("Please fill up the required fields.");
    else if (errorTypes.includes("pattern") || errorTypes.includes("validate"))
      toast.error("Please provide valid information.");
    else if (
      errorTypes.includes("notMatchingWithConfirm") ||
      errorTypes.includes("notMatchingWithNew")
    )
      toast.error("Passwords do not match.");
    else toast.error("Something went wrong. Please try again.");
  };

  useEffect(() => {
    setValue("deliveryType", "");
  }, [selectedCity]);

  useEffect(() => {
    reset({
      name:
        getValues("name") ||
        userData?.userInfo?.personalInfo?.customerName ||
        "",
      email: getValues("email") || userData?.email || "",
      hometown:
        getValues("hometown") ||
        userData?.userInfo?.personalInfo?.hometown ||
        "",
      dob:
        getValues("dob") ||
        (userData?.userInfo?.personalInfo?.dob
          ? parseDate(userData.userInfo.personalInfo.dob)
          : null),
      phoneNumber:
        getValues("phoneNumber") ||
        userData?.userInfo?.personalInfo?.phoneNumber ||
        "",
      altPhoneNumber:
        getValues("altPhoneNumber") ||
        userData?.userInfo?.personalInfo?.phoneNumber2 ||
        "",
      addressLineOne:
        getValues("addressLineOne") ||
        userData?.userInfo?.savedDeliveryAddress?.address1 ||
        "",
      addressLineTwo:
        getValues("addressLineTwo") ||
        userData?.userInfo?.savedDeliveryAddress?.address2 ||
        "",
      city:
        getValues("city") ||
        userData?.userInfo?.savedDeliveryAddress?.city ||
        "",
      postalCode:
        getValues("postalCode") ||
        userData?.userInfo?.savedDeliveryAddress?.postalCode ||
        "",
    });

    setIsSaveAddressCheckboxSelected(
      !!userData?.userInfo?.savedDeliveryAddress?.city,
    );
  }, [userData]);

  useEffect(() => {
    const autocompleteElements = document.querySelectorAll(
      "[aria-autocomplete]",
    );

    const handleAutocompleteClick = (event) =>
      event.currentTarget.querySelector("input").focus();

    autocompleteElements.forEach((element) => {
      element
        .closest('[data-slot="base"]')
        .addEventListener("click", handleAutocompleteClick);
    });

    autocompleteElements.forEach((element) => {
      return () =>
        element
          .closest('[data-slot="base"]')
          .removeEventListener("click", handleAutocompleteClick);
    });
  }, []);

  useEffect(() => {
    setIsPageLoading(
      isProductListLoading ||
        !productList?.length ||
        isSpecialOffersLoading ||
        !specialOffers?.length ||
        isLocationListLoading ||
        !locationList?.length,
    );

    return () => setIsPageLoading(false);
  }, [
    isProductListLoading,
    productList,
    isSpecialOffersLoading,
    specialOffers,
    isLocationListLoading,
    locationList,
  ]);

  useEffect(() => {
    if (!user) {
      setIsPaymentStepDone(false);
      setOrderDetails(null);
    }
  }, [user]);

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
    <main
      className={`relative -mt-[calc(240*3px)] pb-10 pt-[88px] text-sm text-neutral-500 sm:pt-24 md:text-base lg:pb-6 lg:pt-28 [&_h2]:uppercase [&_h2]:text-neutral-700 ${!!cartItems?.length ? "bg-neutral-50" : "min-h-[calc(100dvh+240*3px)] bg-white font-semibold"}`}
    >
      <div
        className={`sticky left-[5%] top-1/3 size-60 animate-blob rounded-full bg-[#ffecdc] mix-blend-multiply blur-md ${!cartItems?.length ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`sticky left-[45%] top-[40%] size-60 animate-blob rounded-full bg-[#ffecdc] mix-blend-multiply blur-md [animation-delay:1s] ${!cartItems?.length ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`sticky left-[80%] top-1/2 size-60 animate-blob rounded-full bg-[#d3f9ce] mix-blend-multiply blur-md [animation-delay:2s] ${!cartItems?.length ? "opacity-0" : "opacity-100"}`}
      />
      {!!cartItems?.length ? (
        <div className="relative gap-4 px-5 sm:px-8 lg:flex lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
          <div className="bottom-5 top-5 h-fit space-y-4 lg:sticky lg:w-[calc(55%-16px/2)]">
            {!user && (
              <CheckoutLogin
                setUserData={setUserData}
                onError={onError}
                setIsPageLoading={setIsPageLoading}
                setIsRegisterModalOpen={setIsRegisterModalOpen}
              />
            )}
            <CheckoutRegister
              setUserData={setUserData}
              onError={onError}
              setIsPageLoading={setIsPageLoading}
              isRegisterModalOpen={isRegisterModalOpen}
              setIsRegisterModalOpen={setIsRegisterModalOpen}
            />
            <form
              className="space-y-4"
              noValidate
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <CheckoutPersonalInfo
                register={register}
                control={control}
                errors={errors}
                isUserLoggedIn={!!userData}
                userHometown={userData?.userInfo?.personalInfo?.hometown}
                userDob={userData?.userInfo?.personalInfo?.dob}
              />
              <CheckoutDeliveryAddress
                register={register}
                control={control}
                reset={reset}
                errors={errors}
                deliveryAddresses={userData?.userInfo?.deliveryAddresses}
                selectedCity={selectedCity}
                selectedDeliveryType={selectedDeliveryType}
                shippingZones={shippingZones}
                isSaveAddressCheckboxSelected={isSaveAddressCheckboxSelected}
                setIsSaveAddressCheckboxSelected={
                  setIsSaveAddressCheckboxSelected
                }
              />
              {/* If none of the cart item has special offer, show promo code section */}
              {cartItems?.every(
                (cartItem) =>
                  !checkIfSpecialOfferIsAvailable(
                    productList?.find(
                      (product) => product._id === cartItem._id,
                    ),
                    specialOffers,
                  ),
              ) && (
                <CheckoutPromoCode
                  userPromoCode={userPromoCode}
                  setUserPromoCode={setUserPromoCode}
                  cartItems={cartItems}
                  cartSubtotal={calculateSubtotal(
                    productList,
                    cartItems,
                    specialOffers,
                  )}
                />
              )}
              <CheckoutPaymentMethod
                register={register}
                errors={errors}
                isPromoCodeValid={isPromoCodeValid}
              />
            </form>
          </div>
          <CheckoutCart
            productList={productList}
            cartItems={cartItems}
            specialOffers={specialOffers}
            primaryLocation={
              locationList?.find(
                (location) => location.isPrimaryLocation == true,
              )?.locationName
            }
            userPromoCode={userPromoCode}
            isPromoCodeValid={isPromoCodeValid}
            selectedCity={selectedCity}
            selectedDeliveryType={selectedDeliveryType}
            isAgreementCheckboxSelected={isAgreementCheckboxSelected}
            setIsAgreementCheckboxSelected={setIsAgreementCheckboxSelected}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onError={onError}
          />
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-112px-24px)] flex-col items-center justify-center [&>*]:w-fit">
          <TbShoppingCartExclamation className="size-24 text-[#F4D3BA]" />
          <p className="mt-2 text-neutral-400">The cart is empty.</p>
          <TransitionLink
            href="/shop"
            className="mt-9 block rounded-lg bg-[#d4ffce] px-4 py-2.5 text-center text-sm text-neutral-600 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
          >
            Return to Shop
          </TransitionLink>
        </div>
      )}
    </main>
  );
}

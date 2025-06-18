import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import generateOrderId from "@/app/utils/generateOrderId";
import { axiosPublic } from "@/app/utils/axiosPublic";
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
import getImageSetsBasedOnColors from "@/app/utils/getImageSetsBasedOnColors";
import checkIfPromoCodeIsValid from "@/app/utils/isPromoCodeValid";
import CheckoutLogin from "@/app/components/checkout/user/CheckoutLogin";
import CheckoutRegister from "@/app/components/checkout/user/CheckoutRegister";
import CheckoutPersonalInfo from "@/app/components/checkout/user/CheckoutPersonalInfo";
import CheckoutDeliveryAddress from "@/app/components/checkout/user/CheckoutDeliveryAddress";
import CheckoutPromoCode from "@/app/components/checkout/user/CheckoutPromoCode";
import CheckoutPaymentMethod from "@/app/components/checkout/user/CheckoutPaymentMethod";
import CheckoutCart from "@/app/components/checkout/cart/CheckoutCart";

export default function CheckoutForm({
  productList,
  specialOffers,
  shippingZones,
  primaryLocation,
  allOrderIds,
  allCustomerIds,
  setIsPaymentStepDone,
  cartItems,
  setOrderDetails,
  legalPolicyPdfLinks,
  promos,
}) {
  const { user, userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const [userPromoCode, setUserPromoCode] = useState("");
  const isPromoCodeValid = checkIfPromoCodeIsValid(
    userPromoCode,
    calculateSubtotal(productList, cartItems, specialOffers),
  );
  const [isAgreementCheckboxSelected, setIsAgreementCheckboxSelected] =
    useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const {
    register,
    watch,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.userInfo?.personalInfo?.customerName || "",
      email: userData?.email || "",
      hometown: userData?.userInfo?.personalInfo?.hometown || "",
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

  const formData = watch();
  const selectedCity = watch("city");
  const selectedDeliveryType = watch("deliveryType");

  const onSubmit = async (data) => {
    if (!isAgreementCheckboxSelected)
      return toast.error(
        "You must agree with the terms and conditions and policies.",
      );

    if (!user) return toast.error("Please log in or register to continue.");

    setIsPageLoading(true);

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
        size: /^\d+$/.test(cartItem.selectedSize)
          ? Number(cartItem.selectedSize)
          : cartItem.selectedSize,
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
          userData?.userInfo?.customerId || generateCustomerId(allCustomerIds),
        email: data.email,
        phoneNumber: data.phoneNumber,
        phoneNumber2: data.altPhoneNumber,
        hometown: data.hometown || userData?.userInfo?.personalInfo?.hometown,
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
      const response = await axiosPublic.post("/addOrder", newOrderData);

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
        savedDeliveryAddress: {
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
      await axiosPublic.put(
        `/updateUserInformation/${userData?._id}`,
        updatedUserData,
      );

      localStorage.removeItem("checkoutFormDraft");
      localStorage.removeItem("cartItems");
      window.dispatchEvent(new Event("storageCart"));
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("storageWishlist"));
    } catch (error) {
      toast.error("Failed update data in server."); // If server error occurs
    }

    setIsPageLoading(false);
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
  }, [selectedCity, setValue]);

  // Save form data to localStorage on input change
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("checkoutFormDraft", JSON.stringify(formData));
    }, 500); // debounce to prevent excessive writes

    return () => clearTimeout(timeout);
  }, [formData]);

  // Load draft from localStorage or update form on user session change
  useEffect(() => {
    const draftData = (() => {
      try {
        const raw = localStorage.getItem("checkoutFormDraft");
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.error("Failed to parse form draft from localStorage:", e);
        return {};
      }
    })();

    reset({
      name:
        userData?.userInfo?.personalInfo?.customerName ?? draftData.name ?? "",
      email: userData?.email ?? draftData.email ?? "",
      hometown:
        draftData.hometown ?? userData?.userInfo?.personalInfo?.hometown ?? "",
      phoneNumber:
        draftData.phoneNumber ??
        userData?.userInfo?.personalInfo?.phoneNumber ??
        "",
      altPhoneNumber:
        draftData.altPhoneNumber ??
        userData?.userInfo?.personalInfo?.phoneNumber2 ??
        "",
      addressLineOne:
        draftData.addressLineOne ??
        userData?.userInfo?.savedDeliveryAddress?.address1 ??
        "",
      addressLineTwo:
        draftData.addressLineTwo ??
        userData?.userInfo?.savedDeliveryAddress?.address2 ??
        "",
      city:
        draftData.city ?? userData?.userInfo?.savedDeliveryAddress?.city ?? "",
      postalCode:
        draftData.postalCode ??
        userData?.userInfo?.savedDeliveryAddress?.postalCode ??
        "",
      note: draftData.note ?? "",
      deliveryType: draftData.deliveryType ?? "",
      paymentMethod: draftData.paymentMethod ?? "",
    });
  }, [reset, userData]);

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
    if (!user) {
      setIsPaymentStepDone(false);
      setOrderDetails(null);
    }
  }, [user, setIsPaymentStepDone, setOrderDetails]);

  return (
    <div className="pt-header-h-full-section-pb relative min-h-dvh gap-4 px-5 sm:px-8 lg:flex lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
      <div className="bottom-[var(--section-padding)] top-[var(--section-padding)] h-fit space-y-4 lg:sticky lg:w-[calc(55%-16px/2)]">
        {!user && (
          <CheckoutLogin
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
          legalPolicyPdfLinks={legalPolicyPdfLinks}
          allCustomerIds={allCustomerIds}
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
          />
          {/* If none of the cart item has special offer, show promo code section */}
          {cartItems?.every(
            (cartItem) =>
              !checkIfSpecialOfferIsAvailable(
                productList?.find((product) => product._id === cartItem._id),
                specialOffers,
              ),
          ) && (
            <CheckoutPromoCode
              promos={promos}
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
        shippingZones={shippingZones}
        primaryLocation={primaryLocation}
        userPromoCode={userPromoCode}
        isPromoCodeValid={isPromoCodeValid}
        selectedCity={selectedCity}
        selectedDeliveryType={selectedDeliveryType}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onError={onError}
        isAgreementCheckboxSelected={isAgreementCheckboxSelected}
        setIsAgreementCheckboxSelected={setIsAgreementCheckboxSelected}
        legalPolicyPdfLinks={legalPolicyPdfLinks}
      />
    </div>
  );
}

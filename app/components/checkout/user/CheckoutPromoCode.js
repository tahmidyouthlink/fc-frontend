import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useLoading } from "@/app/contexts/loading";
import usePromoCodes from "@/app/hooks/usePromoCodes";

export default function CheckoutPromoCode({
  userPromoCode,
  setUserPromoCode,
  cartItems,
  cartSubtotal,
}) {
  const { setIsPageLoading } = useLoading();
  const [promos, isPromosPending, promosRefetch] = usePromoCodes();
  const [promoMessage, setPromoMessage] = useState();

  useEffect(() => {
    setIsPageLoading(isPromosPending || !promos?.length);

    return () => setIsPageLoading(false);
  }, [promos, isPromosPending, setIsPageLoading]);

  useEffect(() => {
    const updatedPromoMessage = !userPromoCode
      ? "Invalid promo code."
      : userPromoCode?.promoStatus != true ||
          new Date() > new Date(userPromoCode?.expiryDate)
        ? "This promo code has expired."
        : cartSubtotal < parseFloat(userPromoCode?.minAmount)
          ? `Valid for a minimum order of ৳ ${parseFloat(userPromoCode?.minAmount).toLocaleString()}.`
          : "Promo code applied.";

    setPromoMessage(updatedPromoMessage);
  }, [userPromoCode, cartItems, cartSubtotal]);

  const handlePromoCodeValidation = () => {
    const enteredPromoCode = document.querySelector("#promo-code").value;
    const correspondingPromo = promos?.find(
      (promo) =>
        promo?.promoCode?.toUpperCase() === enteredPromoCode?.toUpperCase(),
    );
    const promoCodeMessageElement = document.querySelector(
      "#promo-code-message",
    );
    const sectionElement =
      promoCodeMessageElement.parentElement.parentElement.parentElement;

    promoCodeMessageElement.style.opacity = "1";
    promoCodeMessageElement.style.transform = "scale(1)";
    sectionElement.style.paddingBottom = "52px";

    setUserPromoCode(correspondingPromo);
  };

  return (
    <section className="w-full space-y-4 rounded-md border-2 border-neutral-50/20 bg-white/40 p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl transition-[padding-bottom] duration-300 ease-in-out">
      <h2 className="text-base font-semibold md:text-lg">Promo Code</h2>
      <div className="flex gap-x-4">
        <div className="relative w-full space-y-2">
          <label className="text-nowrap" htmlFor="promo-code">
            Have any promo code to apply?
          </label>
          <div className="relative">
            <input
              id="promo-code"
              name="promoCode"
              type="text"
              autoComplete="off"
              className="h-10 w-full rounded-[4px] border-2 border-neutral-200 bg-white/20 px-3 text-xs uppercase text-neutral-700 outline-none backdrop-blur-2xl transition-[background-color,border-color] duration-300 ease-in-out placeholder:text-neutral-400 focus:border-[var(--color-secondary-500)] focus:bg-white/75 md:text-[13px]"
              onChange={(event) => {
                const promoCodeCloseButton = document.getElementById(
                  "promo-code-close-btn",
                );

                promoCodeCloseButton.style.opacity = !event.target.value
                  ? "0"
                  : "1";
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handlePromoCodeValidation();
                } else {
                  const promoCodeMessageElement = document.querySelector(
                    "#promo-code-message",
                  );
                  const sectionElement =
                    promoCodeMessageElement.parentElement.parentElement
                      .parentElement;

                  promoCodeMessageElement.style.opacity = "0";
                  promoCodeMessageElement.style.transform = "scale(0)";
                  sectionElement.style.paddingBottom = "20px";

                  setUserPromoCode(undefined);
                }
              }}
            />
            <button
              id="promo-code-close-btn"
              className="absolute right-3 top-1/2 z-[1] flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 opacity-0 transition-[background-color,opacity] duration-300 ease-in-out hover:bg-neutral-300 [&>svg]:hover:text-neutral-800"
              type="button"
              onClick={() => {
                document.querySelector("#promo-code").value = "";
                const promoCodeCloseButton = document.getElementById(
                  "promo-code-close-btn",
                );

                promoCodeCloseButton.style.opacity = "0";
                const promoCodeMessageElement = document.querySelector(
                  "#promo-code-message",
                );
                const sectionElement =
                  promoCodeMessageElement.parentElement.parentElement
                    .parentElement;

                promoCodeMessageElement.style.opacity = "0";
                promoCodeMessageElement.style.transform = "scale(0)";
                sectionElement.style.paddingBottom = "20px";

                setUserPromoCode(undefined);
              }}
            >
              <IoClose className="size-4 text-neutral-500 transition-[color] duration-300 ease-in-out" />
            </button>
          </div>
          <p
            id="promo-code-message"
            className={`pointer-events-none absolute -bottom-6 left-0 scale-0 text-nowrap text-xs font-semibold opacity-0 transition-[transform,opacity] ${promoMessage === "Promo code applied." ? "text-green-600" : "text-red-600"}`}
          >
            {promoMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePromoCodeValidation}
          className="block h-fit w-full self-end rounded-[4px] bg-[var(--color-primary-500)] py-2.5 text-center text-sm font-semibold text-neutral-700 transition-[background-color] duration-300 hover:bg-[var(--color-primary-700)]"
        >
          Apply
        </button>
      </div>
    </section>
  );
}

import { useEffect } from "react";
import { useLoading } from "@/app/contexts/loading";
import useOffers from "@/app/hooks/useOffers";
import {
  calculateSubtotal,
  getTotalItemCount,
} from "@/app/utils/orderCalculations";
import Drawer from "@/app/components/shared/Drawer";
import CartHeader from "./CartHeader";
import CartItems from "./CartItems";
import EmptyCartContent from "./EmptyCartContent";
import CartFooter from "./CartFooter";
import useLocations from "@/app/hooks/useLocations";

export default function CartDrawer({
  isCartDrawerOpen,
  setIsCartDrawerOpen,
  cartItems,
  productList,
}) {
  const { setIsPageLoading } = useLoading();
  const [specialOffers, isSpecialOffersLoading, specialOffersRefetch] =
    useOffers();
  const [locationList, isLocationListLoading, locationRefetch] = useLocations();

  useEffect(() => {
    setIsPageLoading(
      isSpecialOffersLoading ||
        !specialOffers?.length ||
        isLocationListLoading ||
        !locationList?.length,
    );

    return () => setIsPageLoading(false);
  }, [
    isSpecialOffersLoading,
    specialOffers,
    isLocationListLoading,
    locationList,
  ]);

  return (
    <Drawer
      isDrawerOpen={isCartDrawerOpen}
      setIsDrawerOpen={setIsCartDrawerOpen}
      drawerBgId="cart-bg"
      drawerResponsiveWidths="w-full sm:w-3/4 md:w-[500px]"
    >
      <div className="font-semibold">
        <CartHeader
          totalItems={getTotalItemCount(cartItems) || 0}
          setIsCartDrawerOpen={setIsCartDrawerOpen}
        />
        {!!cartItems?.length ? (
          <CartItems
            cartItems={cartItems}
            productList={productList}
            specialOffers={specialOffers}
            primaryLocation={
              locationList?.find(
                (location) => location.isPrimaryLocation == true,
              )?.locationName
            }
            setIsPageLoading={setIsPageLoading}
            setIsCartDrawerOpen={setIsCartDrawerOpen}
          />
        ) : (
          <EmptyCartContent setIsCartDrawerOpen={setIsCartDrawerOpen} />
        )}
      </div>
      {!!cartItems?.length && (
        <CartFooter
          subtotal={calculateSubtotal(
            productList,
            cartItems,
            specialOffers,
          ).toLocaleString()}
          setIsCartDrawerOpen={setIsCartDrawerOpen}
        />
      )}
    </Drawer>
  );
}

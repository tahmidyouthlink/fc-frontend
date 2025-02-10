import Drawer from "@/app/components/shared/Drawer";
import WishlistHeader from "./WishlistHeader";
import WishlistItems from "./WishlistItems";
import EmptyWishlistContent from "./EmptyWishlistContent";
import WishlistFooter from "./WishlistFooter";

export default function WishlistDrawer({
  isWishlistDrawerOpen,
  setIsWishlistDrawerOpen,
  wishlistItems,
  productList,
}) {
  return (
    <Drawer
      isDrawerOpen={isWishlistDrawerOpen}
      setIsDrawerOpen={setIsWishlistDrawerOpen}
      drawerBgId="wishlist-bg"
      drawerResponsiveWidths="w-full sm:w-3/4 md:w-[450px]"
    >
      <div className="font-semibold">
        <WishlistHeader
          itemCount={wishlistItems?.length || 0}
          setIsWishlistDrawerOpen={setIsWishlistDrawerOpen}
        />
        {/* Drawer Body */}
        {!!wishlistItems?.length ? (
          <WishlistItems
            wishlistItems={wishlistItems}
            productList={productList}
            setIsWishlistDrawerOpen={setIsWishlistDrawerOpen}
          />
        ) : (
          <EmptyWishlistContent
            setIsWishlistDrawerOpen={setIsWishlistDrawerOpen}
          />
        )}
      </div>
      {/* Drawer Footer */}
      {!!wishlistItems?.length && <WishlistFooter />}
    </Drawer>
  );
}

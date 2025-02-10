import { CgClose } from "react-icons/cg";

export default function WishlistHeader({ itemCount, setIsWishlistDrawerOpen }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-base font-semibold md:text-lg">
        Wishlist ({itemCount})
      </h3>
      <CgClose
        className="cursor-pointer"
        size={24}
        onClick={() => setIsWishlistDrawerOpen(false)}
      />
    </div>
  );
}

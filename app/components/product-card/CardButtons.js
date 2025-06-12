import toast from "react-hot-toast";
import { CgHeart, CgShoppingCart } from "react-icons/cg";
import { useAuth } from "@/app/contexts/auth";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";

export default function CardButtons({
  product,
  isProductOutOfStock,
  setSelectedAddToCartProduct,
  setIsAddToCartModalOpen,
}) {
  const axiosPublic = useAxiosPublic();
  const { user, userData, setUserData } = useAuth();

  const handleAddToWishlist = async (product) => {
    const currentWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    if (!currentWishlist.some((item) => item._id === product._id)) {
      const updatedWishlist = [...currentWishlist, { _id: product._id }];

      // Save item in local wishlist
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

      // Save item in server wishlist, if user is logged in
      if (!!user) {
        const updatedUserData = {
          ...userData,
          wishlistItems: updatedWishlist,
        };

        try {
          const response = await axiosPublic.put(
            `/updateUserInformation/${userData?._id}`,
            updatedUserData,
          );

          if (!!response?.data?.modifiedCount) {
            setUserData(updatedUserData);
            toast.success("Item added to wishlist."); // If server wishlist is updated
          }
        } catch (error) {
          toast.error("Failed to add item to wishlist."); // If server error occurs
        }
      } else {
        toast.success("Item added to wishlist."); // If saved only locally
      }
    } else {
      toast.error("Item is already in the wishlist."); // if item already exists
    }

    window.dispatchEvent(new Event("storageWishlist"));
  };

  return (
    <div
      id="card-buttons"
      className="absolute right-3 top-3 flex -translate-x-4 flex-col items-end space-y-1.5 opacity-0 transition-[transform,opacity] duration-300 ease-in-out [&>button]:rounded-[3px] [&>button]:font-semibold [&>button]:text-neutral-700 [&>button]:shadow-[3px_3px_20px_0_rgba(0,0,0,0.25)] hover:[&>button]:opacity-100"
    >
      {!isProductOutOfStock && (
        <button
          className="relative h-8 w-8 overflow-hidden bg-[var(--color-secondary-500)] transition-[background-color,width] hover:w-[calc(32px+68px+6px)] hover:bg-[var(--color-secondary-600)]"
          onClick={() => {
            setSelectedAddToCartProduct(product);
            setIsAddToCartModalOpen(true);
          }}
        >
          <CgShoppingCart className="mx-2 h-8 w-4 object-contain" />
          <p className="absolute left-8 top-1/2 -translate-y-1/2 text-nowrap text-xs">
            Add to Cart
          </p>
        </button>
      )}
      <button
        className="relative h-8 w-8 overflow-hidden bg-[var(--color-primary-500)] transition-[background-color,width] hover:w-[calc(32px+90px+6px)] hover:bg-[var(--color-primary-700)]"
        onClick={() => handleAddToWishlist(product)}
      >
        <CgHeart className="mx-2 h-8 w-4 object-contain" />
        <p className="absolute left-8 top-1/2 -translate-y-1/2 text-nowrap text-xs">
          Add to Wishlist
        </p>
      </button>
    </div>
  );
}

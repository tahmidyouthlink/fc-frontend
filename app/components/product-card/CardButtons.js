import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CgHeart, CgShoppingCart } from "react-icons/cg";
import { routeFetch } from "@/app/lib/fetcher/routeFetch";

export default function CardButtons({
  userData,
  product,
  isProductOutOfStock,
  setSelectedAddToCartProduct,
  setIsAddToCartModalOpen,
}) {
  const router = useRouter();

  const handleAddToWishlist = async (product) => {
    const currentWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    if (!currentWishlist.some((item) => item._id === product._id)) {
      const updatedWishlist = [...currentWishlist, { _id: product._id }];

      // Save item in local wishlist
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

      // Save item in server wishlist, if user is logged in
      if (userData) {
        const updatedUserData = {
          ...userData,
          wishlistItems: updatedWishlist,
        };

        try {
          const result = await routeFetch(`/api/user-data/${userData?._id}`, {
            method: "PUT",
            body: JSON.stringify(updatedUserData),
          });

          if (result.ok) {
            toast.success("Item added to wishlist."); // If server wishlist is updated
            router.refresh();
          } else {
            console.error(
              "UpdateError (cardButtons):",
              result.message || "Failed to update the wishlist on server.",
            );
            toast.error(
              result.message || "Failed to update the wishlist on server.",
            );
          }
        } catch (error) {
          console.error(
            "UpdateError (productWishlistButton):",
            error.message || error,
          );
          toast.error("Failed to update the wishlist on server.");
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

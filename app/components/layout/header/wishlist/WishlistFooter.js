import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";

export default function WishlistFooter() {
  const { user, userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();

  const removeAllItems = async () => {
    setIsPageLoading(true);

    // Remove all items from local wishlist
    localStorage.removeItem("wishlistItems");

    // Remove all wishlist items from server wishlist, if user is logged in
    if (!!user) {
      const updatedUserData = {
        ...userData,
        wishlistItems: [],
      };

      try {
        const response = await axiosPublic.put(
          `/updateUserInformation/${userData?._id}`,
          updatedUserData,
        );

        if (!!response?.data?.modifiedCount || !!response?.data?.matchedCount) {
          setUserData(updatedUserData);
        }
      } catch (error) {
        toast.error("Failed to remove all items from wishlist."); // If server error occurs
      }
    }

    setIsPageLoading(false);
    window.dispatchEvent(new Event("storageWishlist"));
  };

  return (
    <div className="sticky bottom-0 space-y-4 bg-neutral-50 pb-[var(--section-padding)] font-semibold">
      <hr className="h-0.5 w-full bg-neutral-100" />
      <button
        onClick={() => removeAllItems()}
        className="block w-full rounded-lg bg-[#d4ffce] py-2.5 text-center text-sm text-neutral-700 transition-[background-color] duration-300 hover:bg-[#bdf6b4]"
      >
        Remove All
      </button>
    </div>
  );
}

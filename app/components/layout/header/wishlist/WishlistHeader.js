import { CgTrash } from "react-icons/cg";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";

export default function WishlistHeader({ itemCount }) {
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
    <div className="mb-[22px] flex items-center justify-between">
      <h3 className="text-base font-semibold md:text-lg">
        Wishlist ({itemCount})
      </h3>
      <div
        className={`flex w-fit cursor-pointer items-center justify-between gap-x-1.5 text-xs font-semibold text-red-500 md:text-sm ${!itemCount ? "hidden" : ""}`}
        onClick={() => removeAllItems()}
      >
        <CgTrash size={15} />
        Remove All
      </div>
    </div>
  );
}

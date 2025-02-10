import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { CgHeart } from "react-icons/cg";
import { useAuth } from "@/app/contexts/auth";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";

export default function ProductWishlistButton({ productId }) {
  const axiosPublic = useAxiosPublic();
  const { user, userData, setUserData } = useAuth();
  const { setIsPageLoading } = useLoading();

  const handleAddToWishlist = async () => {
    setIsPageLoading(true);

    const currentWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    if (!currentWishlist.some((item) => item._id === productId)) {
      const updatedWishlist = [...currentWishlist, { _id: productId }];

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
    setIsPageLoading(false);
  };

  return (
    <Button
      endContent={<CgHeart />}
      disableRipple
      className="bg-[#E0FCDC] hover:bg-[#C1F7B9]"
      onClick={() => handleAddToWishlist()}
    >
      Add to Wishlist
    </Button>
  );
}

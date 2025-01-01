import toast from "react-hot-toast";
import { CgHeart, CgShoppingCart } from "react-icons/cg";

export default function CardButtons({
  product,
  setSelectedAddToCartProduct,
  setIsAddToCartModalOpen,
  calculateFinalPrice,
}) {
  const handleAddToWishlist = (product) => {
    const currentWishlistItems =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    if (
      !currentWishlistItems.some((item) => item.title === product.productTitle)
    ) {
      const newlyAddedItem = {
        id: product._id,
        title: product.productTitle,
        price: product.regularPrice,
        discount: calculateFinalPrice(product),
        imgURL: product.imageUrls[0],
      };

      const updatedWishlistItems = JSON.stringify([
        ...currentWishlistItems,
        newlyAddedItem,
      ]);

      localStorage.setItem("wishlistItems", updatedWishlistItems);
      toast.success("Item added to wishlist.");
    } else {
      toast.error("Item is already in the wishlist.");
    }

    window.dispatchEvent(new Event("storageWishlist"));
  };

  return (
    <div
      id="card-buttons"
      className="absolute right-3.5 top-3.5 flex -translate-x-5 flex-col items-end space-y-1.5 opacity-0 transition-[transform,opacity] duration-300 ease-in-out [&>button]:rounded-lg [&>button]:font-semibold [&>button]:text-neutral-700 [&>button]:shadow-[3px_3px_20px_0_rgba(0,0,0,0.25)] hover:[&>button]:opacity-100"
    >
      {/* {product.productVariants.some((variant) => !!variant.sku) && ( */}
      <button
        className="relative h-9 w-9 overflow-hidden bg-[#FBEDE2] transition-[background-color,width] hover:w-[calc(36px+72px+10px)] hover:bg-[#F4D3BA]"
        onClick={() => {
          setSelectedAddToCartProduct(product);
          setIsAddToCartModalOpen(true);
        }}
      >
        <CgShoppingCart className="mx-2.5 h-9 w-4 object-contain" />
        <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
          Add to Cart
        </p>
      </button>
      {/* )} */}
      <button
        className="relative h-9 w-9 overflow-hidden bg-[#E0FCDC] transition-[background-color,width] hover:w-[calc(36px+96px+10px)] hover:bg-[#C1F7B9]"
        onClick={() => handleAddToWishlist(product)}
      >
        <CgHeart className="mx-2.5 h-9 w-4 object-contain" />
        <p className="absolute left-9 top-1/2 -translate-y-1/2 text-nowrap text-[13px]">
          Add to Wishlist
        </p>
      </button>
    </div>
  );
}

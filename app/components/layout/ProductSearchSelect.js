import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ProductSearchSelect = ({
  productList,
  onSelectionChange,
  selectedProductIds,
  setSelectedProductIds,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter products based on search input and remove already selected products
  const filteredProducts = productList?.filter(
    (product) =>
      product?.status === "active" &&
      (product?.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.productTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      !selectedProductIds.includes(product?.productId), // Exclude already selected products
  );

  // Handle adding/removing product selection
  const toggleProductSelection = (productId) => {
    let updatedSelectedProducts;
    if (selectedProductIds.includes(productId)) {
      // Remove product from selection
      updatedSelectedProducts = selectedProductIds.filter(
        (id) => id !== productId,
      );
    } else {
      // Add product to selection
      updatedSelectedProducts = [...selectedProductIds, productId];
    }

    onSelectionChange(updatedSelectedProducts); // Pass selected products to parent component
  };

  // Handle removing product directly from selected list
  const removeProduct = (productId) => {
    setSelectedProductIds((prevSelected) => {
      const updatedSelectedProducts = prevSelected.filter(
        (id) => id !== productId,
      );
      return updatedSelectedProducts.length > 0
        ? [...updatedSelectedProducts]
        : [];
    });

    // ✅ Ensure parent component updates as well
    onSelectionChange(selectedProductIds.filter((id) => id !== productId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="mx-auto w-full max-w-md" ref={dropdownRef}>
      {/* Search Box */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={() => setIsDropdownOpen(true)} // Toggle dropdown on input click
        placeholder="Search & Select by Product ID's"
        className="mb-2 w-full rounded-md border border-gray-300 p-2 outline-none transition-colors duration-1000 focus:border-[#9F5216]"
      />

      {/* Dropdown list for search results */}
      {isDropdownOpen && (
        <div className="max-h-64 overflow-y-auto rounded border p-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-1 hover:bg-gray-100 ${
                  selectedProductIds.includes(product.productId)
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={() => toggleProductSelection(product.productId)}
              >
                <div className="flex items-center gap-1">
                  <Image
                    width={4000}
                    height={4000}
                    src={product?.thumbnailImageUrl}
                    alt={product?.productId}
                    className="h-12 w-12 rounded object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="ml-2 font-bold">{product?.productId}</span>
                    <span className="ml-2 text-sm">
                      {product?.productTitle}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>
      )}

      {/* Selected products display */}
      {selectedProductIds.length > 0 && (
        <div className="mt-2 rounded border p-2">
          <h4 className="mb-2 text-sm font-semibold">Selected Products:</h4>
          <ul className="space-y-2">
            {selectedProductIds?.map((id) => (
              <li
                key={id}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <span>{id}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(id)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSearchSelect;

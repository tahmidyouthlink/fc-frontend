import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ProductSearchSelectId = ({
  productList = [],
  value,
  onSelectionChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter products based on search input and remove already selected products
  const filteredProducts = productList?.filter(
    (product) =>
      product.productId.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.includes(product.productId), // Exclude already selected products
  );

  // Handle adding/removing product selection
  const toggleProductSelection = (productId) => {
    let updatedSelectedProducts;
    if (value.includes(productId)) {
      // Remove product from selection
      updatedSelectedProducts = value.filter((id) => id !== productId);
    } else {
      // Add product to selection
      updatedSelectedProducts = [...value, productId];
    }

    onSelectionChange(updatedSelectedProducts); // Pass selected products to parent component
  };

  // Handle removing product directly from selected list
  const removeProduct = (productId) => {
    const updatedSelectedProducts = value.filter((id) => id !== productId);
    onSelectionChange(updatedSelectedProducts); // Pass selected products to parent component
  };

  // Toggle dropdown visibility
  const handleInputClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        onClick={handleInputClick} // Toggle dropdown on input click
        placeholder="Search & Select by Product ID's"
        className="mb-2 w-full rounded-md border border-gray-300 p-2 outline-none transition-colors duration-1000 focus:border-[#D2016E]"
      />

      {/* Dropdown list for search results */}
      {isDropdownOpen && (
        <div className="max-h-64 overflow-y-auto rounded border p-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`flex cursor-pointer items-center justify-between p-2 hover:bg-gray-100 ${
                  value.includes(product.productId) ? "bg-gray-200" : ""
                }`}
                onClick={() => toggleProductSelection(product.productId)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    width={400}
                    height={400}
                    src={product.imageUrls[0]}
                    alt={product.productId}
                    className="h-8 w-8 rounded object-contain"
                  />
                  <p>{product.productId}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>
      )}

      {/* Selected products display */}
      {value.length > 0 && (
        <div className="mt-2 rounded border p-2">
          <h4 className="mb-2 text-sm font-semibold">Selected Products:</h4>
          <ul className="space-y-2">
            {value.map((id) => (
              <li
                key={id}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <span>{id}</span>
                <button
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

export default ProductSearchSelectId;

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const ProductSearchSelectId = ({ productList = [], value, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter products based on search input and remove already selected products
  const filteredProducts = productList?.filter((product) =>
    (product?.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.productTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !value?.some((v) => v === product?.productId) // Exclude already selected products
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="w-full max-w-md mx-auto" ref={dropdownRef}>
      {/* Search Box */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={handleInputClick} // Toggle dropdown on input click
        placeholder="Search & Select by Product ID's"
        className="w-full p-2 border border-gray-300 outline-none focus:border-[#9F5216] transition-colors duration-1000 rounded-md mb-2"
      />

      {/* Dropdown list for search results */}
      {isDropdownOpen && (
        <div className="border rounded p-2 max-h-64 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`flex items-center border justify-between p-1 cursor-pointer hover:bg-gray-100 ${value.includes(product.productId) ? 'bg-gray-200' : ''
                  }`}
                onClick={() => toggleProductSelection(product.productId)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    width={4000} height={4000}
                    src={product?.thumbnailImageUrl}
                    alt={product?.productId}
                    className="h-8 w-8 object-contain rounded"
                  />
                  <div className='flex flex-col'>
                    <span className="ml-2 font-bold">{product?.productId}</span>
                    <span className="ml-2 text-sm">{product?.productTitle}</span>
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
      {value.length > 0 && (
        <div className="border p-2 rounded mt-2">
          <h4 className="text-sm font-semibold mb-2">Selected Products:</h4>
          <ul className="space-y-2">
            {value.map((id) => (
              <li
                key={id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>{id}</span>
                <button
                  onClick={() => removeProduct(id)}
                  className="text-red-500 text-sm"
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

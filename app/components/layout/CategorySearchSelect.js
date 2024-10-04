import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const CategorySearchSelect = ({ categoryList, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter categories based on search input and remove already selected categories
  const filteredCategories = categoryList?.filter((category) =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedCategories.includes(category.label) // Exclude already selected categories
  );

  // Handle adding/removing category selection
  const toggleCategorySelection = (categoryLabel) => {
    let updatedSelectedCategories;
    if (selectedCategories.includes(categoryLabel)) {
      // Remove category from selection
      updatedSelectedCategories = selectedCategories.filter((label) => label !== categoryLabel);
    } else {
      // Add category to selection
      updatedSelectedCategories = [...selectedCategories, categoryLabel];
    }

    setSelectedCategories(updatedSelectedCategories);
    onSelectionChange(updatedSelectedCategories); // Pass selected categories to parent component
  };

  // Handle removing category directly from selected list
  const removeCategory = (categoryLabel) => {
    const updatedSelectedCategories = selectedCategories.filter((label) => label !== categoryLabel);
    setSelectedCategories(updatedSelectedCategories);
    onSelectionChange(updatedSelectedCategories); // Pass selected categories to parent component
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
        placeholder="Search & Select by Categories"
        className="w-full p-2 border border-gray-300 outline-none focus:border-[#D2016E] transition-colors duration-1000 rounded-md mb-2"
      />

      {/* Dropdown list for search results */}
      {isDropdownOpen && (
        <div className="border rounded p-2 max-h-64 overflow-y-auto">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category._id}
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${selectedCategories.includes(category.label) ? 'bg-gray-200' : ''}`}
                onClick={() => toggleCategorySelection(category.label)}
              >
                <Image
                  width={400}
                  height={400}
                  src={category.imageUrl}
                  alt={category.label}
                  className="h-8 w-8 object-cover rounded"
                />
                <span className="ml-2">{category.label}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No categories found</p>
          )}
        </div>
      )}

      {/* Selected categories display */}
      {selectedCategories.length > 0 && (
        <div className="border p-2 rounded mt-2">
          <h4 className="text-sm font-semibold mb-2">Selected Categories:</h4>
          <ul className="space-y-2">
            {selectedCategories.map((label) => (
              <li
                key={label}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>{label}</span>
                <button
                  onClick={() => removeCategory(label)}
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

export default CategorySearchSelect;
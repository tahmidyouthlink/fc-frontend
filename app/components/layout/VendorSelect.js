"use client";
import useVendors from '@/app/hooks/useVendors';
import React from 'react';
import Loading from '../shared/Loading/Loading';

const VendorSelect = ({ selectedVendor, setSelectedVendor }) => {
  const [vendorList, isVendorPending] = useVendors();

  const handleSelectChange = (e) => {
    const vendorValue = e.target.value;
    const vendor = vendorList?.find(v => v.value === vendorValue);
    setSelectedVendor(vendor);
  };

  if (isVendorPending) {
    return <Loading />;
  }

  return (
    <div className='flex-1 space-y-3'>
      <h1 className='font-medium'>Supplier</h1>
      <select
        className='font-semibold text-lg'
        value={selectedVendor?.value || ""}
        onChange={handleSelectChange}
        style={{ zIndex: 10, pointerEvents: 'auto', position: 'relative', outline: 'none' }}
      >
        <option disabled value="">Select a vendor</option>
        {vendorList?.map(vendor => (
          <option key={vendor._id} value={vendor.value}>
            {vendor.label}
          </option>
        ))}
      </select>

      {selectedVendor && (
        <div>
          <p className='text-neutral-600 font-medium'>{selectedVendor.vendorAddress}</p>
        </div>
      )}
    </div>
  );
};

export default VendorSelect;
"use client";
import useLocations from '@/app/hooks/useLocations';
import React, { useMemo } from 'react';
import Loading from '../shared/Loading/Loading';

const OriginSelect = ({ selectedOrigin, setSelectedOrigin, register, errors }) => {
  const [locationList, isLocationPending] = useLocations();

  const activeLocation = useMemo(() => {
    return locationList?.filter(location => location?.status === true);
  }, [locationList]);

  const handleSelectChangeLocation = (e) => {
    const locationValue = e.target.value;
    const location = activeLocation?.find(l => l.locationName === locationValue);
    setSelectedOrigin(location);
  };

  if (isLocationPending) {
    return <Loading />;
  }

  return (
    <div className='flex-1 space-y-3'>
      <h1 className='font-medium'>Origin</h1>
      <select
        id="selectedOrigin"
        {...register('selectedOrigin', { required: 'Please select a destination.' })}
        className='font-semibold text-lg'
        value={selectedOrigin?.locationName || "" || selectedOrigin} // Set selected value here
        onChange={handleSelectChangeLocation}
        style={{ zIndex: 10, pointerEvents: 'auto', position: 'relative', outline: 'none' }}
      >
        <option disabled value="">Select a origin</option>
        {activeLocation?.map(location => (
          <option key={location._id} value={location.locationName}>
            {location.locationName}
          </option>
        ))}
      </select>

      {errors.selectedOrigin && (
        <p className="text-red-600 text-left">{errors.selectedOrigin.message}</p>
      )}

      {selectedOrigin && (
        <div>
          <p className='text-neutral-500 font-medium'>{selectedOrigin?.locationName}, {selectedOrigin?.cityName}, {selectedOrigin?.postalCode}</p>
        </div>
      )}
    </div>
  );
};

export default OriginSelect;
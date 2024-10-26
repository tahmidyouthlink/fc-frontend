"use client";
import useLocations from '@/app/hooks/useLocations';
import React, { useMemo } from 'react';
import Loading from '../shared/Loading/Loading';

const LocationSelect = ({ selectedLocation, setSelectedLocation, register, errors }) => {
  const [locationList, isLocationPending] = useLocations();

  const activeLocation = useMemo(() => {
    return locationList?.filter(location => location?.status === true);
  }, [locationList]);

  const handleSelectChangeLocation = (e) => {
    const locationValue = e.target.value;
    setSelectedLocation(locationValue);
  };

  if (isLocationPending) {
    return <Loading />;
  }

  return (
    <div className='flex-1 space-y-3'>
      <h1 className='font-medium'>Destination</h1>
      <select
        id="selectedLocation"
        {...register('selectedLocation', { required: 'Please select a destination.' })}
        className='font-semibold text-lg'
        value={selectedLocation} // Set selected value here
        onChange={handleSelectChangeLocation}
        style={{ zIndex: 10, pointerEvents: 'auto', position: 'relative', outline: 'none' }}
      >
        <option disabled value="">Select a location</option>
        {activeLocation?.map(location => (
          <option key={location._id} value={location.locationName}>
            {location.locationName}
          </option>
        ))}
      </select>

      {errors.selectedLocation && (
        <p className="text-red-600 text-left">{errors.selectedLocation.message}</p>
      )}

      {selectedLocation && (
        <div>
          <p className='text-neutral-500 font-medium'>{activeLocation?.find(loc => loc.locationName === selectedLocation)?.locationAddress}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSelect;
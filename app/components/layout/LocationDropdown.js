import useLocations from '@/app/hooks/useLocations';
import { useState } from 'react';
import Loading from '../shared/Loading/Loading';

const LocationDropdown = ({ onLocationSelect }) => {

  const [locationList, isLocationPending] = useLocations();
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedLocation(selectedValue); // Update the selected location in state
    onLocationSelect(selectedValue); // Pass selected location to parent component
  };

  if (isLocationPending) {
    return <Loading />
  }

  return (
    <select
      value={selectedLocation}
      onChange={handleChange} className='bg-gray-100 font-semibold text-xl lg:text-2xl'
      style={{ zIndex: 10, pointerEvents: 'auto', position: 'relative', outline: 'none' }}
    >
      <option disabled value="">Select Location</option>
      {locationList?.map((location) => (
        <option key={location._id} value={location.locationName}>
          {location.locationName}
        </option>
      ))}
    </select>
  );
};

export default LocationDropdown;

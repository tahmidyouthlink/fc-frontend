import React from 'react';
import { PiFlagPennantFill } from "react-icons/pi";

const StarRating = ({ rating, onRatingChange }) => {
  const colors = {
    default: 'text-gray-400',
    Red: 'text-red-500',
    Yellow: 'text-yellow-500',
    Green: 'text-green-500',
    Purple: 'text-purple-500',
  };

  const colorLabels = {
    Red: 'Suspicious',
    Yellow: 'Average',
    Green: 'Fair',
    Purple: 'Loyal',
  };

  return (
    <div className="flex flex-col items-start justify-center w-full gap-4 px-20">
      {['Red', 'Yellow', 'Green', 'Purple'].map((color, index) => (
        <div key={index} className="flex flex-col">
          <div className='flex items-center justify-center gap-6'>
            <PiFlagPennantFill
              className={`cursor-pointer transition-transform duration-200 transform ${rating === color ? 'scale-150' : 'scale-100'} ${colors[color]}`}
              onClick={() => onRatingChange(color)}
              size={24}
            />
            <span className="mt-2 text-sm">{colorLabels[color]}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StarRating;
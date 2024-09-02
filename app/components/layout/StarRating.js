import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange }) => {
  const colors = {
    default: 'text-gray-400',
    Red: 'text-red-500',
    Yellow: 'text-yellow-500',
    Green: 'text-green-500',
    Purple: 'text-purple-500',
  };

  return (
    <div className="flex space-x-2">
      {['Red', 'Yellow', 'Green', 'Purple'].map((color, index) => (
        <FaStar
          key={index}
          className={`cursor-pointer transition-transform duration-200 transform ${rating === color ? 'scale-125' : 'scale-100'} ${colors[color]}`}
          onClick={() => onRatingChange(color)}
          size={24}
        />
      ))}
    </div>
  );
};

export default StarRating;
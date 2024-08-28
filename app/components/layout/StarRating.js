import React, { useState } from 'react';
import StarRatings from 'react-star-ratings';

const StarRating = ({ rating, onRatingChange }) => {
  const [currentRating, setCurrentRating] = useState(rating);

  const handleRatingChange = (newRating) => {
    setCurrentRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <StarRatings
      rating={currentRating}
      starRatedColor="gold"
      starEmptyColor="gray"
      numberOfStars={5}
      name='rating'
      starDimension="20px"
      starSpacing="2px"
      changeRating={handleRatingChange}
    />
  );
};

export default StarRating;
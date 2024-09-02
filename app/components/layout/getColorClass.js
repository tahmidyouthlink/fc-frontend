// colorHelpers.js
export const getColorClass = (rating) => {
  const colorClasses = {
    Red: 'text-red-500',
    Yellow: 'text-yellow-500',
    Green: 'text-green-500',
    Purple: 'text-purple-500',
    Default: 'text-gray-400',
  };

  return colorClasses[rating] || colorClasses.Default;
};

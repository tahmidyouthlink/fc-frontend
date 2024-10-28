const Progressbar = ({ accepted, rejected, total }) => {
  const totalQuantity = total || 0; // Default to 0 if no total
  const acceptedQuantity = Math.min(accepted, totalQuantity); // Capping accepted quantity to total
  const rejectedQuantity = Math.min(rejected, totalQuantity); // Capping rejected quantity to total

  // Calculate percentage of accepted and rejected quantities
  const acceptedPercentage = totalQuantity > 0 ? (acceptedQuantity / totalQuantity) * 100 : 0;
  const rejectedPercentage = totalQuantity > 0 ? (rejectedQuantity / totalQuantity) * 100 : 0;

  return (
    <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className="bg-green-600 h-full"
        style={{ width: `${acceptedPercentage}%`, position: 'absolute' }}
      />
      <div
        className="bg-red-600 h-full"
        style={{ width: `${rejectedPercentage}%`, position: 'absolute', left: `${acceptedPercentage}%` }}
      />
    </div>
  );
};

export default Progressbar;
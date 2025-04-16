export const generateCardRotations = (length) => {
  const step = 6;
  const half = Math.floor(length / 2);
  const isEven = length % 2 === 0;

  return Array.from({ length }, (_, i) => {
    const relativePosition = i - half;
    const adjustedPosition =
      isEven && relativePosition >= 0 ? relativePosition + 1 : relativePosition;
    return adjustedPosition * step;
  });
};

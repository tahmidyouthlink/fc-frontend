export const generateSizes = (range) => {
  // Handle single sizes like "One Size"
  if (range === "One Size") {
    return ["One Size"];
  }

  // Handle letter sizes like "XS-6XL" or "XL-XXXL"
  if (/^[A-Z]+-\d*[A-Z]*$/.test(range)) {
    const [start, end] = range.split("-");
    const sizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
    const startIndex = sizeOrder.indexOf(start);
    const endIndex = sizeOrder.indexOf(end);
    if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
      return sizeOrder.slice(startIndex, endIndex + 1);
    }
  }

  // Handle any number ranges like "28-50" or "14-20"
  if (/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(range)) {
    const [start, end] = range.split("-").map(Number);
    const sizes = [];
    for (let i = Math.ceil(start); i <= Math.floor(end); i += 1) {
      sizes.push(i);
    }
    return sizes;
  }

  // Handle ranges with fractions like "6/8-12/14"
  if (/^\d+\/\d+-\d+\/\d+$/.test(range)) {
    const [start, end] = range.split("-");
    const [startLow, startHigh] = start.split("/").map(Number);
    const [endLow, endHigh] = end.split("/").map(Number);

    const sizes = [];
    for (let i = startLow; i <= endLow; i += 2) {
      sizes.push(`${i} - ${i + 2}`);
    }
    return sizes;
  }

  return [range]; // Return the input if no pattern matches
};
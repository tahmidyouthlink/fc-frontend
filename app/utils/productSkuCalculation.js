export const getProductVariantSku = (
  productVariants,
  primaryLocation,
  selectedColorId,
  selectedSize,
) => {
  return productVariants
    ?.filter(
      (variant) =>
        variant.color._id === selectedColorId &&
        variant.size === selectedSize &&
        variant.location === primaryLocation,
    )
    .reduce((acc, variant) => acc + Number(variant?.sku), 0);
};

const getProductTotalSku = (productVariants, primaryLocation) => {
  return productVariants
    ?.filter((variant) => variant?.location === primaryLocation)
    .reduce((acc, variant) => acc + Number(variant?.sku), 0);
};

export const CheckIfProductIsOutOfStock = (
  productVariants,
  primaryLocation,
) => {
  return !(getProductTotalSku(productVariants, primaryLocation) > 0);
};

export const checkIfProductIsLimitedStock = (
  productVariants,
  primaryLocation,
) => {
  return getProductTotalSku(productVariants, primaryLocation) < 20;
};

import ProductBadges from "../ui/badges/ProductBadges";
import TransitionLink from "../ui/TransitionLink";
import CardButtons from "./CardButtons";
import ColorSelectionTool from "./ColorSelectionTool";
import ProductThumbnail from "./ProductThumbnail";
import ProductInfo from "./ProductInfo";
import OutOfStockBanner from "./OutOfStockBanner";

export default function ProductCard({
  product,
  productIndex,
  calculateFinalPrice,
  isAddToCartModalOpen,
  setIsAddToCartModalOpen,
  setSelectedAddToCartProduct,
  getImageSetsBasedOnColors,
}) {
  return (
    <div
      key={product._id}
      // className={`relative ${!isAddToCartModalOpen ? "[&>a_img]:hover:scale-110 [&>div:is(#card-buttons,#color-select)]:hover:opacity-100" : ""} ${!product.productVariants.some((variant) => !!variant.sku) ? "[&>div]:hover:translate-x-0" : "[&>div:last-child]:hover:-translate-y-[calc(100%-1px)] [&>div:not(:last-child)]:hover:translate-x-0"}`}
      className={`relative [&>div:is(#card-buttons,#color-select)]:hover:opacity-100 [&>div:last-child]:hover:-translate-y-[calc(100%-1px)] [&>div:not(:last-child)]:hover:translate-x-0 ${!isAddToCartModalOpen ? "[&>a_img]:hover:scale-110 [&>div:is(#card-buttons,#color-select)]:hover:opacity-100" : ""}}`}
    >
      <TransitionLink
        href={`/product/${product.productTitle.split(" ").join("-").toLowerCase()}`}
      >
        <ProductThumbnail
          product={product}
          imageSets={getImageSetsBasedOnColors(product.productVariants)}
        />
        <ProductInfo
          product={product}
          calculateFinalPrice={calculateFinalPrice}
        />
      </TransitionLink>
      <ProductBadges
        isTrending={product.salesThisMonth >= 10}
        isNewArrival={product.newArrival === "Yes"}
        hasDiscount={!!Number(product.discountValue)}
        discount={{
          type: product.discountType,
          text:
            product.discountType === "Percentage"
              ? `${product.discountValue}%`
              : `৳ ${product.discountValue}`,
        }}
      />
      {/* {!product.productVariants.some((variant) => !!variant.sku) && (
      <OutOfStockBanner />
      )} */}
      <CardButtons
        product={product}
        setIsAddToCartModalOpen={setIsAddToCartModalOpen}
        setSelectedAddToCartProduct={setSelectedAddToCartProduct}
        calculateFinalPrice={calculateFinalPrice}
      />
      {/* {product.productVariants.some((variant) => !!variant.sku) && ( */}
      <ColorSelectionTool
        productTitle={product.productTitle}
        productColors={product.availableColors}
      />
      {/* )} */}
    </div>
  );
}

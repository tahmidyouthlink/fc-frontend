import Image from "next/image";
import { redirect } from "next/navigation";
import axios from "axios";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import ProductContents from "@/app/components/product/ProductContents";
import ProductRelatedContents from "@/app/components/product/ProductRelatedContents";

export default async function Product({ params: { slug } }) {
  let products, specialOffers, primaryLocation, notifyVariants;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allProducts`,
    );
    products = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (productDetails/products):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allOffers`,
    );
    specialOffers = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (productDetails/specialOffers):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allLocations`,
    );
    const locations = response.data || [];
    primaryLocation = locations?.find(
      (location) => location?.isPrimaryLocation == true,
    )?.locationName;
  } catch (error) {
    console.error(
      "Fetch error (productDetails/locations):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/get-all-availability-notifications`,
    );
    notifyVariants = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (productDetails/notifyVariants):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  const product = products?.find(
    (product) =>
      product?.productTitle?.split(" ")?.join("-")?.toLowerCase() === slug,
  );

  if (!product || product.status !== "active") redirect("/shop");

  return (
    <main className="relative overflow-hidden">
      {/* Mesh Gradient */}
      <div className="relative h-full w-full">
        <div className="fixed left-[2.5%] top-1/2 animate-blob bg-[var(--color-moving-bubble-primary)] sm:top-1/2 sm:bg-[var(--color-moving-bubble-secondary)]" />
        <div className="fixed left-[42.5%] top-[5%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:1s] sm:top-2/3 sm:bg-[var(--color-moving-bubble-primary)]" />
        <div className="fixed left-[80%] top-[15%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      </div>
      {/* Shape/SVG (circle with star) */}
      <div className="absolute right-3 top-36 z-[-1] aspect-square w-56 translate-x-1/2 opacity-85 max-[1200px]:hidden">
        <Image
          src={circleWithStarShape}
          alt="circle with star shape"
          className="object-contain"
          height={0}
          width={0}
          sizes="25vw"
        />
      </div>
      <div className="pt-header-h-full-section-pb relative overflow-hidden text-sm [&_img]:pointer-events-none">
        {/* Product Contents Section */}
        <ProductContents
          product={product}
          specialOffers={specialOffers}
          primaryLocation={primaryLocation}
          notifyVariants={notifyVariants}
        />
        {/* Product Related Contents */}
        <ProductRelatedContents
          products={products}
          product={product}
          specialOffers={specialOffers}
          primaryLocation={primaryLocation}
          notifyVariants={notifyVariants}
        />
      </div>
    </main>
  );
}

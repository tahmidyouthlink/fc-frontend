import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import { authOptions } from "@/app/utils/authOptions";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";
import ProductContents from "@/app/components/product/ProductContents";
import ProductRelatedContents from "@/app/components/product/ProductRelatedContents";

export default async function Product({ params: { slug } }) {
  const session = await getServerSession(authOptions);

  let userData, products, specialOffers, primaryLocation, notifyVariants;

  if (session?.user?.email) {
    try {
      const result = await tokenizedFetch(
        `/customerDetailsViaEmail/${session?.user?.email}`,
      );

      userData = result.data || {};
    } catch (error) {
      console.error("FetchError (checkout/userData):", error.message);
    }
  }

  try {
    const result = await rawFetch("/allProducts");
    products = result.data || [];
  } catch (error) {
    console.error("FetchError (productDetails/products):", error.message);
  }

  const product = products?.find(
    (product) =>
      product?.productTitle?.split(" ")?.join("-")?.toLowerCase() === slug,
  );

  if (!product || product.status !== "active") redirect("/shop");

  try {
    const result = await rawFetch("/allOffers");
    specialOffers = result.data || [];
  } catch (error) {
    console.error("FetchError (productDetails/specialOffers):", error.message);
  }

  try {
    const result = await rawFetch("/primary-location");
    primaryLocation = result.data?.primaryLocation || null;
  } catch (error) {
    console.error(
      "FetchError (productDetails/primaryLocation):",
      error.message,
    );
  }

  try {
    const result = await rawFetch("/get-all-availability-notifications");
    notifyVariants = result.data || [];
  } catch (error) {
    console.error("FetchError (productDetails/notifyVariants):", error.message);
  }

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
        <ProductContents
          userData={userData}
          product={product}
          specialOffers={specialOffers}
          primaryLocation={primaryLocation}
          notifyVariants={notifyVariants}
        />
        <ProductRelatedContents
          userData={userData}
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

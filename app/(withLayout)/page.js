import { getServerSession } from "next-auth";
import { tokenizedFetch } from "../lib/fetcher/tokenizedFetch";
import { rawFetch } from "../lib/fetcher/rawFetch";
import { authOptions } from "../utils/authOptions";
import { CheckIfProductIsOutOfStock } from "@/app/utils/productSkuCalculation";
import HomeHero from "../components/home/HomeHero";
import HomeCategories from "../components/home/HomeCategories";
import HomeTrending from "../components/home/HomeTrending";
import HomeNewArrival from "../components/home/HomeNewArrival";
import HomeFeatures from "../components/home/HomeFeatures";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let userData, products, primaryLocation, specialOffers, notifyVariants;

  try {
    const result = await tokenizedFetch(
      `/customerDetailsViaEmail/${session?.user?.email}`,
    );

    userData = result.data || {};
  } catch (error) {
    console.error("FetchError (home/userData):", error.message);
  }

  try {
    const result = await rawFetch("/allProducts");
    products = result.data || [];
  } catch (error) {
    console.error("FetchError (home/products):", error.message);
  }

  try {
    const result = await rawFetch("/allOffers");
    specialOffers = result.data || [];
  } catch (error) {
    console.error("FetchError (home/specialOffers):", error.message);
  }

  try {
    const result = await rawFetch("/primary-location");
    primaryLocation = result.data?.primaryLocation || null;
  } catch (error) {
    console.error("FetchError (home/primaryLocation):", error.message);
  }

  try {
    const result = await rawFetch("/get-all-availability-notifications");
    notifyVariants = result.data || [];
  } catch (error) {
    console.error("FetchError (home/notifyVariants):", error.message);
  }

  const trendingProducts = products
    ?.filter(
      (product) =>
        product?.status === "active" &&
        product?.trending === "Yes" &&
        !CheckIfProductIsOutOfStock(product?.productVariants, primaryLocation),
    )
    ?.slice(0, 4);
  const newlyArrivedProducts = products
    ?.filter(
      (product) =>
        product?.status === "active" &&
        product?.newArrival === "Yes" &&
        !CheckIfProductIsOutOfStock(product?.productVariants, primaryLocation),
    )
    ?.slice(0, 4);

  return (
    <main className="[&_img]:pointer-events-none">
      <HomeHero />
      <HomeCategories />
      <HomeTrending
        userData={userData}
        trendingProducts={trendingProducts}
        specialOffers={specialOffers}
        primaryLocation={primaryLocation}
        notifyVariants={notifyVariants}
      />
      <HomeNewArrival
        userData={userData}
        isAnyTrendingProductAvailable={trendingProducts?.length}
        newlyArrivedProducts={newlyArrivedProducts}
        specialOffers={specialOffers}
        primaryLocation={primaryLocation}
        notifyVariants={notifyVariants}
      />
      <HomeFeatures
        isAnyTrendingProductAvailable={trendingProducts?.length}
        isAnyNewProductAvailable={newlyArrivedProducts?.length}
      />
    </main>
  );
}

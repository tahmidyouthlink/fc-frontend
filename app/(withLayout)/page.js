import axios from "axios";
import { CheckIfProductIsOutOfStock } from "@/app/utils/productSkuCalculation";
import HomeHero from "../components/home/HomeHero";
import HomeCategories from "../components/home/HomeCategories";
import HomeTrending from "../components/home/HomeTrending";
import HomeNewArrival from "../components/home/HomeNewArrival";
import HomeFeatures from "../components/home/HomeFeatures";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products, locations, specialOffers;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allProducts`,
    );
    products = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (home/products):",
      error.response?.data?.message || error.response?.data,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allOffers`,
    );
    specialOffers = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (home/specialOffers):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allLocations`,
    );
    locations = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (home/locations):",
      error.response?.data?.message || error.response?.data,
    );
  }

  const primaryLocation = locations?.find(
    (location) => location?.isPrimaryLocation == true,
  )?.locationName;
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
        trendingProducts={trendingProducts}
        specialOffers={specialOffers}
        primaryLocation={primaryLocation}
      />
      <HomeNewArrival
        isAnyTrendingProductAvailable={trendingProducts?.length}
        newlyArrivedProducts={newlyArrivedProducts}
        specialOffers={specialOffers}
        primaryLocation={primaryLocation}
      />
      <HomeFeatures
        isAnyTrendingProductAvailable={trendingProducts?.length}
        isAnyNewProductAvailable={newlyArrivedProducts?.length}
      />
    </main>
  );
}

import Banner from "../components/layout/Home/Banner/Banner";
import Category from "../components/layout/Home/Category/Category";
import NewArrivals from "../components/layout/Home/NewArrivals/NewArrivals";
import Trending from "../components/layout/Home/Trending/Trending";

const Homepage = () => {
  return (
    <div>
      <Banner />
      <Category />
      <Trending />
      <NewArrivals />
    </div>
  );
};

export default Homepage;
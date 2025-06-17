import axios from "axios";
import TopFooterWrapper from "./TopFooterWrapper";
import TopFooterBanner from "./TopFooterBanner";
import TopFooterNewsletter from "./TopFooterNewsletter";

export default async function TopFooter() {
  let bannerImg;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allMarketingBanners`,
    );
    bannerImg = response.data[0] || [];
  } catch (error) {
    console.error(
      "Fetch error (footer/banner):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  return (
    <TopFooterWrapper bannerImgPosition={bannerImg?.position}>
      <TopFooterBanner bannerImg={bannerImg} />
      <TopFooterNewsletter />
    </TopFooterWrapper>
  );
}

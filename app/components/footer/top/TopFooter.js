import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import TopFooterWrapper from "./TopFooterWrapper";
import TopFooterBanner from "./TopFooterBanner";
import TopFooterNewsletter from "./TopFooterNewsletter";

export default async function TopFooter() {
  const session = await getServerSession(authOptions);

  let bannerImg, newsletterSubscriptions, isUserSubscribed;

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

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allNewsletters`,
    );
    newsletterSubscriptions = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (footer/newsletterSubscriptions):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/getSingleNewsletter/${session?.user?.email}`,
    );
    isUserSubscribed = !!response.data;
  } catch (error) {
    console.error(
      "Fetch error (footer/newsletterByEmail):",
      error.response?.data?.message || error.response?.data || error.message,
    );
  }

  return (
    <TopFooterWrapper bannerImgPosition={bannerImg?.position}>
      <TopFooterBanner bannerImg={bannerImg} />
      <TopFooterNewsletter
        newsletterSubscriptions={newsletterSubscriptions}
        isSubscribedInitial={isUserSubscribed}
      />
    </TopFooterWrapper>
  );
}

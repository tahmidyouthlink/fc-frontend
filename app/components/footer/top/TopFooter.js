import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import { authOptions } from "@/app/utils/authOptions";
import TopFooterWrapper from "./TopFooterWrapper";
import TopFooterBanner from "./TopFooterBanner";
import TopFooterNewsletter from "./TopFooterNewsletter";

export default async function TopFooter() {
  const session = await getServerSession(authOptions);

  let bannerImg, isUserSubscribed;

  try {
    const result = await rawFetch("/allMarketingBanners");
    [bannerImg] = result.data || [];
  } catch (error) {
    console.error("FetchError (footer/marketingBanner):", error.message);
  }

  if (session?.user?.email) {
    try {
      const result = await tokenizedFetch(
        `/getSingleNewsletter/${session.user.email}`,
      );
      isUserSubscribed = !!result.data;
    } catch (error) {
      console.error("FetchError (footer/newsletterByEmail):", error.message);
    }
  }

  return (
    <TopFooterWrapper bannerImgPosition={bannerImg?.position}>
      <TopFooterBanner bannerImg={bannerImg} />
      <TopFooterNewsletter
        userEmail={session?.user?.email}
        isUserSubscribed={isUserSubscribed}
      />
    </TopFooterWrapper>
  );
}

import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import { extractData } from "@/app/lib/extractData";
import { authOptions } from "@/app/utils/authOptions";
import TopFooterWrapper from "./TopFooterWrapper";
import TopFooterBanner from "./TopFooterBanner";
import TopFooterNewsletter from "./TopFooterNewsletter";

export default async function TopFooter() {
  const session = await getServerSession(authOptions);

  const promises = [
    rawFetch("/allMarketingBanners"),
    session?.user?.email
      ? tokenizedFetch(`/getSingleNewsletter/${session.user.email}`)
      : Promise.resolve(null),
  ];

  const [bannerRes, newsletterRes] = await Promise.allSettled(promises);

  const [bannerImg] = extractData(bannerRes, [], "footer/marketingBanner");
  const isUserSubscribed = !!extractData(
    newsletterRes,
    null,
    "footer/newsletterByEmail",
  );

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

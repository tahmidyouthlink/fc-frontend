import Image from "next/image";
import TransitionLink from "@/app/components/ui/TransitionLink";

export default function TopFooterBanner({ bannerImg }) {
  return (
    <TransitionLink
      className={`relative block h-40 w-full ${bannerImg?.position === "right" ? "order-last" : ""}`}
      href="/shop?filterBy=On+Sale"
    >
      {!!bannerImg?.url && (
        <Image
          src={bannerImg?.url}
          className="h-full w-full object-contain"
          alt="Marketing Banner"
          height={0}
          width={0}
          sizes="100dvw"
        />
      )}
    </TransitionLink>
  );
}

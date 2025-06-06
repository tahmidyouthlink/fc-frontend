import Image from "next/image";
import featureImg from "@/public/features/feature-main.jpg";
import curvedDottedLineShape from "@/public/shapes/curved-dotted-line-trending.svg";
import thunderShape from "@/public/shapes/thunder-without-stroke.svg";
import circleWithStarShape from "@/public/shapes/circle-with-star.svg";

export default function HomeFeatures({
  isAnyTrendingProductAvailable,
  isAnyNewProductAvailable,
}) {
  const features = [
    {
      title: "Free Shipping",
      description:
        "Enjoy free shipping on orders above a certain amount, making your shopping experience even more delightful.",
      imgSrc: "/features/shipping.svg",
    },
    {
      title: "Sustainable Materials",
      description:
        "We prioritize using eco-friendly and sustainable materials in our collections to reduce environmental impact.",
      imgSrc: "/features/sustainable.svg",
    },
    {
      title: "Exclusive Collections",
      description:
        "Our carefully curated collections feature limited-edition designs inspired by seasonal trends, ensuring you stand out.",
      imgSrc: "/features/collections.svg",
    },
    {
      title: "Secure Payments",
      description:
        "We offer secure payment methods, including bKash, Rocket, Nagad, Upay, and major credit cards.",
      imgSrc: "/features/payments.svg",
    },
    {
      title: "Customer Support",
      description:
        "Our dedicated support team is available from 9 AM to 6 PM on weekdays via email or live chat for your convenience.",
      imgSrc: "/features/support.svg",
    },
  ];

  return (
    <div
      className={`relative ${!(isAnyTrendingProductAvailable && isAnyNewProductAvailable) && (isAnyTrendingProductAvailable || isAnyNewProductAvailable) ? "bg-neutral-50" : ""}`}
    >
      <div className="relative gap-x-8 px-5 py-8 sm:px-8 md:grid md:grid-cols-2 md:py-10 lg:px-12 lg:py-12 xl:mx-auto xl:max-w-[1200px] xl:px-0">
        {/* Shape/SVG (circle with star) */}
        <div className="absolute bottom-4 left-0 z-[-1] aspect-square w-52 -translate-x-1/2 opacity-85 max-[1200px]:hidden sm:-right-10 sm:max-md:w-64 lg:-right-20">
          <Image
            src={circleWithStarShape}
            alt="circle with star shape"
            className="object-contain"
            height={0}
            width={0}
            sizes="25vw"
          />
        </div>
        <div className="absolute inset-0 [&_div]:z-[-1]">
          <div className="absolute left-[75%] top-[85%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-full bg-[var(--color-static-bubble-secondary)] opacity-70 blur-[60px] md:left-[90%] md:blur-[40px] xl:h-[187px] xl:w-[214px] 2xl:left-full" />
          <div className="absolute top-[40%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-full bg-[var(--color-static-bubble-secondary)] opacity-70 blur-[60px] md:blur-[40px] lg:top-[35%] xl:h-[187px] xl:w-[214px]" />
          <div className="absolute left-[60%] top-[20%] h-[150px] w-[150px] translate-x-[-50%] translate-y-[-50%] rounded-full bg-[var(--color-static-bubble-primary)] opacity-70 blur-[60px] md:blur-[40px] xl:h-[187px] xl:w-[214px]" />
        </div>
        <Image
          src={featureImg}
          alt="shopping"
          width={0}
          height={0}
          sizes="50dvw"
          className="min-h-full rounded-md object-cover max-md:mb-10"
        />
        <div className="col-span-2 space-y-8 md:col-span-1">
          <h2 className="relative w-fit text-xl font-bold lg:text-3xl">
            We Offer Everything You Need
            <div className="absolute -right-1.5 bottom-1/2 aspect-square w-7 translate-x-full sm:w-8 lg:w-9">
              <Image
                src={thunderShape}
                alt="Thunder shape"
                className="object-contain"
                height={0}
                width={0}
                sizes="25vw"
                fill
              />
            </div>
          </h2>
          <div className="space-y-6">
            {features.map((feature, index) => {
              return (
                <div key={feature.title + index} className="flex gap-x-5">
                  <Image
                    src={feature.imgSrc}
                    alt="shopping"
                    width={0}
                    height={0}
                    sizes="50px"
                    className="size-11"
                  />
                  <div className="space-y-1.5">
                    <h4
                      className={`text-lg/[1] font-semibold text-neutral-800 md:max-lg:text-base/[1] ${!(isAnyTrendingProductAvailable && isAnyNewProductAvailable) && (isAnyTrendingProductAvailable || isAnyNewProductAvailable) ? "bg-neutral-50" : ""}`}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className={`text-neutral-600 ${!(isAnyTrendingProductAvailable && isAnyNewProductAvailable) && (isAnyTrendingProductAvailable || isAnyNewProductAvailable) ? "bg-neutral-50" : ""}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

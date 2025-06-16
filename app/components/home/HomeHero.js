import axios from "axios";
import HomeHeroSlides from "./HomeHeroSlides";

export const dynamic = "force-dynamic";

export default async function HomeHero() {
  let sliderData;

  try {
    const response = await axios.get(
      `https://fc-backend-664306765395.asia-south1.run.app/allHeroBannerImageUrls`,
    );
    sliderData = response.data || [];
  } catch (error) {
    console.error(
      "Fetch error (home/sliderData):",
      error.response?.data?.message || error.response?.data,
    );
  }

  const [
    {
      isEnabled,
      slideInterval,
      sliders: { leftSlides, centerSlides, rightSlides } = {},
    } = {},
  ] = sliderData || [];

  return (
    <div className="relative">
      {/* Mesh Gradients */}
      <div className="absolute inset-0 h-full overflow-hidden">
        <div className="absolute left-[5%] top-[60%] animate-blob bg-[var(--color-moving-bubble-secondary)] max-sm:hidden" />
        <div className="absolute left-[30%] top-[30%] animate-blob bg-[var(--color-moving-bubble-primary)] [animation-delay:1.5s]" />
        <div className="absolute left-[55%] top-[70%] animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:0.5s] max-sm:left-[5%] sm:bg-[var(--color-moving-bubble-primary)]" />
        <div className="absolute left-[80%] top-1/3 animate-blob bg-[var(--color-moving-bubble-secondary)] [animation-delay:2s] max-sm:hidden" />
      </div>
      <HomeHeroSlides
        isEnabled={isEnabled}
        slideInterval={slideInterval}
        leftSlides={leftSlides}
        centerSlides={centerSlides}
        rightSlides={rightSlides}
      />
    </div>
  );
}

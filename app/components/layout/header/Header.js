import TopHeader from "./TopHeader";
import MobileNavbar from "./mobile/MobileNavbar";
import DesktopNavbar from "./desktop/DesktopNavbar";

export default function Header({
  logoWithoutTextSrc,
  logoWithTextSrc,
  isTopHeaderEnabled,
  slides,
  slideDuration,
  isAutoSlideEnabled,
  bgColor,
  textColor,
  isHighlightedColorEnabled,
  highlightedColor,
}) {
  return (
    <header
      id="header"
      className="absolute z-[5] w-full bg-white shadow-[5px_5px_24px_0_rgba(0,0,0,0.035)]"
    >
      {isTopHeaderEnabled && (
        <TopHeader
          slides={slides}
          slideDuration={slideDuration}
          isAutoSlideEnabled={isAutoSlideEnabled}
          bgColor={bgColor}
          textColor={textColor}
          isHighlightedColorEnabled={isHighlightedColorEnabled}
          highlightedColor={highlightedColor}
        />
      )}
      <div className="mx-auto flex items-center justify-between px-5 py-3 transition-[padding-bottom] duration-300 ease-in-out sm:px-8 sm:py-3.5 lg:px-12 lg:py-4 xl:max-w-[1200px] xl:px-0">
        <MobileNavbar
          logoWithoutTextSrc={logoWithoutTextSrc}
          logoWithTextSrc={logoWithTextSrc}
        />
        <DesktopNavbar logoWithTextSrc={logoWithTextSrc} />
      </div>
    </header>
  );
}

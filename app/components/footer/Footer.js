import TopFooter from "./top/TopFooter";
import BottomFooter from "./bottom/BottomFooter";

export default function Footer({ logoWithTextSrc }) {
  return (
    <footer className="relative z-[3] bg-white">
      <TopFooter />
      <BottomFooter logoWithTextSrc={logoWithTextSrc} />
    </footer>
  );
}

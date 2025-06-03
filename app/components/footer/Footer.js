import TopFooter from "./top/TopFooter";
import BottomFooter from "./bottom/BottomFooter";

export default function Footer() {
  return (
    <footer className="z-[3] bg-white">
      <TopFooter />
      <BottomFooter />
    </footer>
  );
}

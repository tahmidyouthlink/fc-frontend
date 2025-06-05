import FooterMenu from "./FooterMenu";
import Copyright from "./Copyright";

export default function BottomFooter({ logoImgSrc }) {
  return (
    <div className="px-5 text-sm text-neutral-500 sm:px-8 md:text-base lg:px-12 xl:mx-auto xl:max-w-[1200px] xl:px-0 [&_:is(h2,h3,h4)]:text-neutral-700">
      <FooterMenu logoImgSrc={logoImgSrc} />
      <hr />
      <Copyright />
    </div>
  );
}

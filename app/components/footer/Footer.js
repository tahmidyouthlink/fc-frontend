import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import TopFooter from "./top/TopFooter";
import BottomFooter from "./bottom/BottomFooter";

export default async function Footer({ logoWithTextSrc }) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  return (
    <footer className="relative z-[3] bg-white">
      <TopFooter userEmail={userEmail} />
      <BottomFooter
        logoWithTextSrc={logoWithTextSrc}
        isLoggedIn={!!userEmail}
      />
    </footer>
  );
}

import SecurityForm from "@/app/components/user/security/SecurityForm";
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";

export default async function Security() {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;
  const name = session?.user?.name;
  const isLinkedWithCredentials = session?.user?.isLinkedWithCredentials;
  const isLinkedWithGoogle = session?.user?.isLinkedWithGoogle;

  return (
    <SecurityForm
      email={email}
      name={name}
      isLinkedWithCredentials={isLinkedWithCredentials}
      isLinkedWithGoogle={isLinkedWithGoogle}
    />
  );
}

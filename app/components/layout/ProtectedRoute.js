"use client"; // ✅ Only this component is client-side
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../shared/Loading/Loading";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/restricted-access"); // Redirect to login
    } else if (status === "authenticated") {
      if (!allowedRoles.includes(session?.user?.role)) {
        router.push("/unauthorized"); // Redirect if role is not allowed
      }
    }
  }, [status, session, router, allowedRoles]);

  if (status === "loading") return <Loading />;

  if (!session || !allowedRoles.includes(session?.user?.role)) return null;

  return children;
};

export default ProtectedRoute;
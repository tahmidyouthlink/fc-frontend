import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth';
import { useRouter } from 'next/navigation';
import Loading from '../shared/Loading/Loading';

const ProtectedRoute = ({ children, pageName, requiredPermission }) => {
  const { existingUserData, isUserLoading } = useAuth(); // Get the user data and loading state
  const router = useRouter();

  console.log(existingUserData, "existingUserData");

  useEffect(() => {

    // If the user is still loading, don't do anything yet
    if (isUserLoading) return <Loading />;

    // Check if user permissions are available
    if (!existingUserData?.permissions) {
      router.push("/unauthorized");
      return;
    }

    // Check if the user has the required permission for the action
    if (!existingUserData?.permissions[pageName]?.actions?.[requiredPermission]) {
      router.push("/unauthorized");
    }
  }, [existingUserData, isUserLoading, requiredPermission, router, pageName]);

  // If user doesn't have permission or is still loading, nothing is rendered
  if (isUserLoading || !existingUserData?.permissions[pageName]?.actions?.[requiredPermission]) {
    return <Loading />; // You could show a loading spinner or a fallback UI here
  }

  return <>{children}</>; // Render the protected content if user has permission
};

export default ProtectedRoute;
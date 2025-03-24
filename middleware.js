import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isEditRoute, protectedAddRoutes, protectedRoutes } from "./app/components/ProtectedRoutes/ProtectedRoutes";

// Helper function to fetch user permissions
const fetchUserPermissions = async (userId) => {
  try {
    const response = await fetch(
      `https://fashion-commerce-backend.vercel.app/single-existing-user/${userId}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      role: data?.role || "viewer", // Default to "viewer" if not found
      permissions: data?.permissions || {} // Default to an empty object if no permissions found
    };

  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null;
  }
};

export async function middleware(req) {
  const session = cookies().get("user_session")?.value;
  const pathname = req.url;
  const nextUrlPathname = req.nextUrl.pathname;

  // If user enters wrong user/shop page URL, redirect to the correct one
  if (/\/user\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/user/profile", pathname));
  if (/\/product\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/shop", pathname));

  // Redirect to login page, if user tries to access any user page without being logged in
  if (!session && pathname.includes("user")) {
    return NextResponse.redirect(new URL("/", pathname));
  }

  // 🔹 Check if user is accessing backend dashboard
  const isBackendRoute = nextUrlPathname.startsWith("/dash-board");

  // 🔹 Redirect frontend users if no session but allow backend access check separately
  if (!session && !isBackendRoute) {
    return NextResponse.next(); // Allow frontend pages to load normally
  }

  if (isBackendRoute) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If the user is not logged in, redirect to login
    if (!token && pathname.includes("dash-board")) {
      return NextResponse.redirect(new URL("/auth/restricted-access", pathname));
    }

    // 🔹 Fetch user permissions from your API
    const userId = token?._id; // Assuming `sub` contains the user ID
    let userPermissions = null;

    if (userId) {
      userPermissions = await fetchUserPermissions(userId);
    }

    // 🔹 If userPermissions is null, auto-logout and redirect to login
    if (!userPermissions) {
      const response = NextResponse.redirect(new URL("/auth/restricted-access", req.url));

      // 🔹 Expire NextAuth session cookies (optional, better to handle in frontend)
      response.cookies.set("next-auth.session-token", "", { expires: new Date(0) });
      response.cookies.set("__Secure-next-auth.session-token", "", { expires: new Date(0) });
      response.cookies.set("next-auth.csrf-token", "", { expires: new Date(0) });

      return response;
    }

    // 🔹 Restrict "Viewer" role from Add Pages
    if (userPermissions?.role === "Viewer") {
      if (Object.keys(protectedAddRoutes).some(route => nextUrlPathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // 🔹 Restrict "Viewer" role from Edit Pages (using regex for dynamic IDs)
      if (isEditRoute(nextUrlPathname)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // 🔹 Check if user has permission for the accessed route
    const sortedRoutes = Object.keys(protectedRoutes).sort((a, b) => b.length - a.length); // Sort longest first
    const permissionKey = sortedRoutes.find(route => nextUrlPathname.startsWith(route));

    if (permissionKey) {
      const permissionCategory = protectedRoutes[permissionKey];

      if (!userPermissions?.permissions?.[permissionCategory]?.access) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

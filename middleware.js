import axios from "axios";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { protectedRoutes } from "./app/components/ProtectedRoutes/ProtectedRoutes";
import { settingsRoutes } from "./app/components/ProtectedRoutes/SettingsRoutes";

// Helper function to fetch user permissions
const fetchUserPermissions = async (userId) => {
  try {
    const response = await axios.get(
      `https://fashion-commerce-backend.vercel.app/single-existing-user/${userId}`
    );
    return response?.data?.permissions || null;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null;
  }
};

export async function middleware(req) {
  const session = cookies().get("user_session")?.value;
  const pathname = req.url;

  // If user enters wrong user/shop page URL, redirect to the correct one
  if (/\/user\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/user/profile", pathname));
  if (/\/product\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/shop", pathname));

  // Redirect to login page, if user tries to access any user page without being logged in
  if (!session && pathname.includes("user")) {
    return NextResponse.redirect(new URL("/", pathname));
  }

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

  // 🔹 Check if user has permission for the accessed route
  const sortedRoutes = Object.keys(protectedRoutes).sort((a, b) => b.length - a.length); // Sort longest first
  const permissionKey = sortedRoutes.find(route => req.nextUrl.pathname.startsWith(route));

  if (permissionKey) {
    const permissionCategory = protectedRoutes[permissionKey];

    if (!userPermissions?.[permissionCategory]?.access) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // 🔹 Block all settings-related pages if `Settings` access is false
  if (settingsRoutes.some(route => req.nextUrl.pathname.startsWith(route)) && !userPermissions?.["Settings"]?.access) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

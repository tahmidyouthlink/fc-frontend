import { NextResponse } from "next/server";
import {
  getModuleNameFromPath,
  isEditRoute,
  protectedAddRoutes,
  protectedRoutes,
} from "./app/components/ProtectedRoutes/ProtectedRoutes";
import { getToken } from "next-auth/jwt";

// Helper function to fetch user permissions
const fetchUserPermissions = async (userId) => {
  try {
    const response = await fetch(
      `https://fashion-commerce-backend.vercel.app/single-existing-user/${userId}`,
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      permissions: data?.permissions || [], // Default to an empty object if no permissions found
    };
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null;
  }
};

export async function middleware(req) {
  const pathname = req.url;
  const nextUrlPathname = req.nextUrl.pathname;

  // If user enters wrong user/shop page URL, redirect to the correct one
  if (/\/user\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/user/profile", pathname));
  if (/\/product\/?$/i.test(pathname))
    return NextResponse.redirect(new URL("/shop", pathname));

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not logged in and tries to access any of the user pages, redirect to homepage
  if (!token && pathname.includes("user")) {
    return NextResponse.redirect(new URL("/", pathname));
  }

  // 🔹 Check if user is accessing backend dashboard
  const isBackendRoute = nextUrlPathname.startsWith("/dash-board");

  // 🔹 Redirect frontend users if no token but allow backend access check separately
  if (!token && !isBackendRoute) {
    return NextResponse.next(); // Allow frontend pages to load normally
  }

  if (isBackendRoute) {
    // If the user is not logged in, redirect to login
    if (!token && pathname.includes("dash-board")) {
      return NextResponse.redirect(
        new URL("/auth/restricted-access", pathname),
      );
    }

    // 🔹 Fetch user permissions from your API
    const userId = token?._id; // Assuming `sub` contains the user ID
    let userPermissions = null;

    if (userId) {
      userPermissions = await fetchUserPermissions(userId);
    }

    // 🔹 If userPermissions is null, auto-logout and redirect to login
    if (!userPermissions) {
      const response = NextResponse.redirect(
        new URL("/auth/restricted-access", req.url),
      );

      response.cookies.set("next-auth.session-token", "", {
        expires: new Date(0),
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "Strict",
      });
      response.cookies.set("__Secure-next-auth.session-token", "", {
        expires: new Date(0),
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "Strict",
      });

      return response;
    }

    // 🔹 Restrict "Viewer" access on Add/Edit routes
    const viewerRoles = userPermissions?.permissions?.filter(
      (perm) => perm.role === "Viewer"
    );

    if (viewerRoles?.length) {

      // 👉 Check Add Routes
      const matchedAddRoute = Object.keys(protectedAddRoutes).find((route) =>
        nextUrlPathname.startsWith(route)
      );

      if (matchedAddRoute) {
        const moduleName = getModuleNameFromPath(matchedAddRoute); // e.g. "Product Hub", "Marketing"

        const isViewerBlocked = viewerRoles.some(
          (perm) => perm.modules?.[moduleName]?.access === true
        );

        if (isViewerBlocked) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }

      // 👉 Check Edit Routes
      if (isEditRoute(nextUrlPathname)) {
        const moduleName = getModuleNameFromPath(nextUrlPathname); // infer module from path

        const isViewerBlocked = viewerRoles.some(
          (perm) => perm.modules?.[moduleName]?.access === true
        );

        if (isViewerBlocked) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }

    }

    // 🔹 Check if user has permission for the accessed route
    const sortedRoutes = Object.keys(protectedRoutes).sort(
      (a, b) => b.length - a.length
    ); // Sort longest first

    const permissionKey = sortedRoutes.find((route) =>
      nextUrlPathname.startsWith(route)
    );

    if (permissionKey) {
      const permissionCategory = protectedRoutes[permissionKey]; // e.g., "Orders", "Product Hub", etc.

      const hasAccess = userPermissions?.permissions?.some(
        (perm) => perm.modules?.[permissionCategory]?.access === true
      );

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

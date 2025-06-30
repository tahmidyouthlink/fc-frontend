import handleResponse from "./handleResponse";

// Fetch for routes that do not require access token
export const rawFetch = async (path, options = {}) => {
  const backendUrl =
    typeof window === "undefined"
      ? process.env.BACKEND_URL
      : process.env.NEXT_PUBLIC_BACKEND_URL;
  const method = (options.method || "GET").toUpperCase();

  const isGetMethod = method === "GET";
  const hasCustomCache =
    options.cache === "force-cache" ||
    (options.next && "revalidate" in options.next);

  const res = await fetch(`${backendUrl}${path}`, {
    ...options,
    method,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
    ...(isGetMethod && !hasCustomCache && { cache: "no-store" }),
  });

  return handleResponse(res);
};

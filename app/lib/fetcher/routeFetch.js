import handleResponse from "./handleResponse";

// Fetch for route handlers
export const routeFetch = async (path, options = {}) => {
  const method = (options.method || "GET").toUpperCase();

  const isGetMethod = method === "GET";
  const hasCustomCache =
    options.cache === "force-cache" ||
    (options.next && "revalidate" in options.next);

  const res = await fetch(path, {
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

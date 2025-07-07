// Fetch for route handlers
export const routeFetch = async (path, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const isGetMethod = method === "GET";
  const hasCustomCache =
    options.cache === "force-cache" ||
    (options.next && "revalidate" in options.next);

  const headers = {
    ...(options.headers || {}),
  };

  const res = await fetch(path, {
    ...options,
    method,
    headers,
    ...(isGetMethod && !hasCustomCache && { cache: "no-store" }),
  });

  return await res.json();
};

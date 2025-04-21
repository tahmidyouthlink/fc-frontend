// Define permission-based routes
export const protectedRoutes = {
  "/dash-board/orders": "Orders",
  "/dash-board/product-hub": "Product Hub",
  "/dash-board/supply-chain": "Supply Chain",
  "/dash-board/customers": "Customers",
  "/dash-board/finances": "Finances",
  "/dash-board/analytics": "Analytics",
  "/dash-board/marketing": "Marketing",
  "/dash-board/settings": "Settings",
  "/dash-board": "Dashboard",
};

// 🔹 Object for "Add" Pages
export const protectedAddRoutes = {
  "/dash-board/product-hub/products/add-product": "Product Hub Add",
  "/dash-board/product-hub/products/add-product-2": "Product Hub Add",
  "/dash-board/product-hub/products/add-product-3": "Product Hub Add",
  "/dash-board/product-hub/purchase-orders/create-purchase-order": "Purchase Order Add",
  "/dash-board/product-hub/transfers/create-transfer": "Transfer Add",
  "/dash-board/product-hub/categories/add-category": "Category Add",
  "/dash-board/product-hub/seasons/add-season": "Season Add",
  "/dash-board/product-hub/colors/add-color": "Color Add",
  "/dash-board/product-hub/vendors/add-vendor": "Vendor Add",
  "/dash-board/product-hub/tags/add-tag": "Tag Add",
  "/dash-board/finances/payment-methods/add-payment-method": "Payment Method Add",
  "/dash-board/marketing/promo/add-promo": "Promo Add",
  "/dash-board/marketing/offer/add-offer": "Offer Add",
  "/dash-board/supply-chain/zone/add-shipping-zone": "Shipment Add",
  "/dash-board/supply-chain/zone/add-shipment-handler": "Shipment Handler Add",
  "/dash-board/supply-chain/locations/add-location": "Location Add",
};

// Function to check if a path matches any edit routes (handles dynamic IDs)
export const isEditRoute = (pathname) => {
  const editPatterns = [
    /^\/dash-board\/product-hub\/products\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/product-hub\/purchase-orders\/receive-inventory\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/product-hub\/transfers\/receive-transfer\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/product-hub\/categories\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/product-hub\/seasons\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/product-hub\/vendors\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/finances\/payment-methods\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/marketing\/promo\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/marketing\/offer\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/supply-chain\/zone\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/supply-chain\/zone\/add-shipment-handler\/[a-zA-Z0-9]+$/,
    /^\/dash-board\/supply-chain\/locations\/[a-zA-Z0-9]+$/,
  ];

  return editPatterns.some((pattern) => pattern.test(pathname));
};

// Maps path segments to permission module names
export function getModuleNameFromPath(path) {
  const map = {
    "product-hub": "Product Hub",
    "orders": "Orders",
    "customers": "Customers",
    "finances": "Finances",
    "analytics": "Analytics",
    "marketing": "Marketing",
    "supply-chain": "Supply Chain",
    "dashboard": "Dashboard",
    "settings": "Settings",
  };

  const parts = path.split("/").filter(Boolean); // remove empty strings
  const moduleSegment = parts[1]; // path like: /dash-board/**product-hub**/products/...

  return map[moduleSegment] || null;
}

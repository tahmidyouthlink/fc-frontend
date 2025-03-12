export const permissionsList = {
  "Dashboard": { "access": false },

  "Orders": {
    "access": false,
    "actions": {
      "New Orders": false,
      "Active Orders": false,
      "Completed Orders": false,
      "Returns & Refunds": false,
      "View Order Details": false,
      "Confirm Order": false,
      "Shipped Order": false,
      "On Hold Order": false,
      "Delivered Order": false,
      "Return Approve Order": false,
      "Return Decline Order": false,
      "Return Order": false,
      "Refund Order": false,
      "Revert Order": false
    }
  },

  "Products": {
    "access": false,
    "actions": {
      "Add Product": false,
      "View/Edit Product": false
    }
  },
  "Manage Inventory": { "access": false },
  "Purchase Orders": {
    "access": false,
    "actions": {
      "Create New Purchase Order": false,
      "Edit Purchase Order": false
    }
  },
  "Transfers": {
    "access": false,
    "actions": {
      "Create New Transfer Order": false,
      "Edit Transfer Order": false
    }
  },
  "Categories": {
    "access": false,
    "actions": {
      "Create New Category": false,
      "Select Featured Category": false,
      "Edit Category": false,
      "Delete Category": false
    }
  },
  "Seasons": {
    "access": false,
    "actions": {
      "Create New Season": false,
      "Edit Season": false,
      "Delete Season": false
    }
  },
  "Colors": {
    "access": false,
    "actions": {
      "Create New Color": false,
      "Delete Color": false
    }
  },
  "Vendors": {
    "access": false,
    "actions": {
      "Create New Vendor": false,
      "Edit Vendor": false,
      "Delete Vendor": false
    }
  },
  "Tags": {
    "access": false,
    "actions": {
      "Create New Tag": false,
      "Delete Tag": false
    }
  },

  "Customers": {
    "access": false,
    "actions": {
      "Customer Details": false,
      "Customer Order History": false
    }
  },

  "Finances": {
    "access": false,
    "actions": {
      "Completed Date range filtering": false,
      "Refunded Date range filtering": false
    }
  },

  "Analytics": { "access": false },

  "Marketing": {
    "access": false,
    "actions": {
      "Create Promo": false,
      "Edit Existing Promo": false,
      "Create Offer": false,
      "Edit Existing Offer": false,
      "Marketing Content": false,
      "Homepage Content": false,
      "Discounted Date range filtering": false
    }
  },

  "Settings": { "access": false }
};
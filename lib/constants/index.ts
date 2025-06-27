const PATHS = {
  dashboards: {
    supplier: "/dashboards/supplier-dashboard",
    retailer: "/dashboards/retailer-dashboard",
    admin: "/dashboards/admin-dashboard",
  },
  auth: {
    signin: "/",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
};

const ERROR_TYPES = {
  USER_MISSING: "USER_MISSING",
  CONTRACTS_FETCH_ERROR: "CONTRACTS_FETCH_ERROR",
};

export { PATHS, ERROR_TYPES };

export const API_ROUTES = {
  LOGIN: "api/admin/signin", //LOGIN
  LOGOUT: "api/admin/signout", //LOGOUT
  FORGOT_PASSWORD: "api/admin/forgot-password",
  VALIDATE_OTP: "api/admin/verify-otp",
  RESET_PASSWORD: "api/admin/reset-password",
  UPDATE_ADMIN_PROFILE: "api/admin/updateAdminProfile",
  GET_ADMIN_PROFILE: "api/admin/getMyProfile",
  CHANGE_PASSWORD: "api/admin/changePassword",


  // Category Management
  GET_CATEGORIES: "api/category/getAllCategories",
  GET_CATEGORY_BY_ID: "api/category/getCategory",
  CREATE_CATEGORY: "/api/category/create",
  UPDATE_CATEGORY: "/api/category/update",
  DELETE_CATEGORY: "/api/category/soft-delete",


  // User Management
  GET_ALL_USERS: "api/admin/getAllUsers", //GET ALL USERS
  DELETE_USER: "api/admin/deleteUser", //DELETE USER 
  BLOCK_USER: "api/admin/blockUser", // ACTIVE INACTIVE USER
  GET_USER: "api/admin/getUser", // GET SINGLE USER
  UPDATE_USER: "api/admin/updateUser", // UPDATE USER

  // Item Management
  GET_ITEM_DETAILS: "api/admin/getAllItems",
  GET_ITEMS_BY_SELLER: "api/admin/getItemsBySellerId",
  DELETE_ITEM: "api/admin/deleteItem", // Placeholder, assuming these exist or will be similar
  TOGGLE_ITEM_STATUS: "api/admin/status",
  TOGGLE_ITEM_PUBLISH: "api/admin/publish",
  GET_ITEM_BY_ID: "api/admin/getItemById",
  COMMISSION: "api/admin/commission",

};

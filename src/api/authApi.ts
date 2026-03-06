import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";

export const logoutApi = () => {
  return axiosInstance.post(API_ROUTES.LOGOUT);
};

// Send OTP to email
export const forgotPasswordApi = (email: string) => {
  return axiosInstance.post(API_ROUTES.FORGOT_PASSWORD, { email });
};

// Validate OTP
export const validateOtpApi = (data: { adminId: string; otp: string }) => {
  return axiosInstance.post(API_ROUTES.VALIDATE_OTP, data);
};

// Reset Password (OTP already verified)
export const resetPasswordApi = (data: {
  adminId: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return axiosInstance.post(API_ROUTES.RESET_PASSWORD, data);
};

// Change Password
export const changePasswordApi = (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return axiosInstance.post(API_ROUTES.CHANGE_PASSWORD, data);
};

// Update Profile
// export const updateAdminProfile = (payload: {
//   mail: string;
//   firstName: string;
//   phone: string;
//   facebookLink?: string;
//   instagramLink?: string;
//   twitterLink?: string;
//   linkedinLink?: string;
//   bio?: string;
// }) => {
//   return axiosInstance.put("/api/admin/updateAdminProfile", payload);
// };
export const updateAdminProfile = (payload: FormData) => {
  return axiosInstance.put(API_ROUTES.UPDATE_ADMIN_PROFILE, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get Profile
export const getAdminProfile = () => {
  return axiosInstance.get(API_ROUTES.GET_ADMIN_PROFILE);
};

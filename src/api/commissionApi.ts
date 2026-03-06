import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";

export interface CommissionData {
  requestPurchaseCommission: {
    type: "percentage" | "fixed";
    value: number;
  };
  directPurchaseCommission: {
    type: "percentage" | "fixed";
    value: number;
  };
}

// Get Commission
export const getCommissionApi = () => {
  return axiosInstance.get(API_ROUTES.COMMISSION);
};

// Update Commission
export const updateCommissionApi = (data: CommissionData) => {
  return axiosInstance.post(API_ROUTES.COMMISSION, data);
};

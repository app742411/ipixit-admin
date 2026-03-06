import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";

export const createSubadmin = (data: any) => {
  return axiosInstance.post(API_ROUTES.CREATE_SUBADMIN, data);
};

export const updateSubadmin = (id: string, data: any) => {
  return axiosInstance.put(`/${API_ROUTES.UPDATE_SUBADMIN}/${id}`, data);
};

export const getSubadmins = (params?: any) => {
  return axiosInstance.get(`/${API_ROUTES.GET_SUBADMINS}`, { params });
};

export const deleteSubadmin = (id: string) => {
  return axiosInstance.delete(`/${API_ROUTES.DELETE_SUBADMIN}/${id}`);
};

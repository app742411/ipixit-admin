import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";
import { GetAllUsersParams, GetAllUsersResponse } from "../types/user";

export const getAllUsers = async (params: GetAllUsersParams) => {
    const { page = 1, limit = 10, search = "", role = "", isDeleted, status = "" } = params;

    // Construct query parameters
    const queryParams: any = {
        page,
        limit,
        search,
    };

    if (role && role !== 'all') {
        queryParams.role = role;
    }

    if (status && status !== 'all') {
        queryParams.status = status;
    }

    if (isDeleted !== undefined) {
        queryParams.isDeleted = isDeleted;
    }

    const response = await axiosInstance.get<GetAllUsersResponse>(API_ROUTES.GET_ALL_USERS, {
        params: queryParams,
    });

    return response.data;
};

// Delete User
export const deleteUser = async (id: string) => {
    const response = await axiosInstance.patch(`${API_ROUTES.DELETE_USER}/${id}`);
    return response.data;
};

// Block User ( Active inactive)
export const blockUser = async (id: string) => {
    const response = await axiosInstance.patch(`${API_ROUTES.BLOCK_USER}/${id}`);
    return response.data;
};

// Get User By Id
export const getUserById = async (id: string) => {
    // Response has { message, data: User }
    const response = await axiosInstance.get(`${API_ROUTES.GET_USER}/${id}`);
    return response.data;
};

// Update User
export const updateUser = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.patch(`${API_ROUTES.UPDATE_USER}/${id}`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
    });
    return response.data;
};

import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";

export interface GetItemsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    seller?: string;
    format?: string;
    sort?: string;
    isPublish?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    status?: string; // Wrapper for UI filters
}

// Get All Items
export const getAllItems = async (params: GetItemsParams) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        category,
        seller,
        format,
        sort = "latest",
        status,
        isDeleted
    } = params;

    const queryParams: any = {
        page,
        limit,
        search,
        sort,
    };

    if (category) queryParams.category = category;
    if (seller) queryParams.seller = seller;
    if (format) queryParams.format = format;
    if (typeof isDeleted === 'boolean') queryParams.isDeleted = isDeleted;

    /* MAP STATUS FILTERS */
    if (status) {
        if (status === "active") queryParams.isActive = true;
        if (status === "inactive") queryParams.isActive = false;
        if (status === "published") queryParams.isPublish = true;
        if (status === "pending") queryParams.isPublish = false;
        if (status === "deleted") queryParams.isDeleted = true;
    }

    // Allow direct overrides if passed explicitly
    if (typeof params.isActive === 'boolean') queryParams.isActive = params.isActive;
    if (typeof params.isPublish === 'boolean') queryParams.isPublish = params.isPublish;

    const response = await axiosInstance.get(
        API_ROUTES.GET_ITEM_DETAILS, // /api/admin/getAllItems
        {
            params: queryParams,
        }
    );

    return response.data;
};
// Pending
export const deleteItem = async (id: string) => {
    // specific endpoint path might need adjustment based on backend
    const response = await axiosInstance.patch(`${API_ROUTES.DELETE_ITEM}/${id}`);
    return response.data;
};
// Pending
export const toggleItemStatus = async (id: string, isActive: boolean) => {
    const response = await axiosInstance.patch(`${API_ROUTES.TOGGLE_ITEM_STATUS}/${id}`, { isActive });
    return response.data;
};
// Pending
export const toggleItemPublish = async (id: string, isPublished: boolean) => {
    const response = await axiosInstance.patch(`${API_ROUTES.TOGGLE_ITEM_PUBLISH}/${id}`, { isPublished });
    return response.data;
};

// GET ALL ITEMS ON USER PAGE 
export const getItemsBySellerId = async (sellerId: string) => {
    const res = await axiosInstance.get(
        `${API_ROUTES.GET_ITEMS_BY_SELLER}/${sellerId}`
    );
    return res.data;
};


// GET SINGLE ITEM BY ID
export const getItemById = async (id: string) => {
    const response = await axiosInstance.get(`${API_ROUTES.GET_ITEM_BY_ID}/${id}`);
    return response.data;
};

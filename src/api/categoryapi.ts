import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";
// GET ALL CATEGORIES
export const getAllCategories = ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return axiosInstance.get(API_ROUTES.GET_CATEGORIES, {
    params: { page, limit, search },
  });
};

/* SOFT DELETE CATEGORY */
export const removeCategory = async (_id: string) => {
  const response = await axiosInstance.delete(
    `${API_ROUTES.DELETE_CATEGORY}/${_id}`,
  );
  return response.data;
};

// CREATE CATEGORY
export const createCategory = async (formData: FormData) => {
  const response = await axiosInstance.post(
    API_ROUTES.CREATE_CATEGORY,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/* GET CATEGORY BY ID */
export const getCategoryById = (id: string) => {
  return axiosInstance.get(`${API_ROUTES.GET_CATEGORY_BY_ID}/${id}`);
};

/* UPDATE CATEGORY */
export const updateCategory = (id: string, data: FormData) => {
  return axiosInstance.put(`${API_ROUTES.UPDATE_CATEGORY}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// -- SUB CATEGORIES --

/* GET SUBCATEGORIES BY CATEGORY ID */
export const getSubCategoriesByCategoryId = (categoryId: string) => {
  return axiosInstance.get(
    `${API_ROUTES.GET_SUBCATEGORIES_BY_CATEGORY_ID}/${categoryId}`,
  );
};

/* CREATE SUBCATEGORY */
export const createSubCategory = async (formData: FormData) => {
  const response = await axiosInstance.post(
    API_ROUTES.CREATE_SUBCATEGORY,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

/* UPDATE SUBCATEGORY */
export const updateSubCategory = async (id: string, formData: FormData) => {
  const response = await axiosInstance.put(
    `${API_ROUTES.UPDATE_SUBCATEGORY}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

/* DELETE SUBCATEGORY */
export const deleteSubCategory = async (id: string) => {
  const response = await axiosInstance.delete(
    `${API_ROUTES.DELETE_SUBCATEGORY}/${id}`,
  );
  return response.data;
};

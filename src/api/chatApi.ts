import axiosInstance from "../utils/axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

export const getAllConversations = async () => {
    return axiosInstance.get(`${API_BASE_URL}/api/admin/getAllConversation`, {
        headers: getAuthHeaders(),
    });
};

export const getConversationMessages = async (conversationId: string) => {
    return axiosInstance.get(
        `${API_BASE_URL}/api/admin/messages/${conversationId}`,
        {
            headers: getAuthHeaders(),
        },
    );
};

export const sendMessage = async (
    conversationId: string,
    content: string,
    chatMedia?: File | null
) => {
    const formData = new FormData();

    formData.append("conversationId", conversationId);
    formData.append("content", content);

    if (chatMedia) {
        formData.append("chatMedia", chatMedia);
    }

    return axiosInstance.post(`${API_BASE_URL}/api/admin/messages`, formData, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true"
        },
    });
};

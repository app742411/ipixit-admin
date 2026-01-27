
export const getProfilePicUrl = (profilePic?: string) => {
    if (!profilePic) return null;

    // If backend already sent full URL
    if (profilePic.startsWith("http")) return profilePic;

    // Correct backend path
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/profilePics/${profilePic}`;
};
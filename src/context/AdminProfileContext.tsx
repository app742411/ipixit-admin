import { createContext, useContext, useEffect, useState } from "react";
import { getAdminProfile } from "../api/authApi";

type AdminProfile = {
    _id: string;
    email: string;
    firstName: string;
    phone: string;
    profilePic?: string; // filename from backend
    profileImage: string; //  full image path (derived)
    facebookLink?: string;
    instagramLink?: string;
    linkedinLink?: string;
    twitterLink?: string;
    bio?: string;
};

type AdminProfileContextType = {
    profile: AdminProfile | null;
    loading: boolean;
    refreshProfile: () => void;
};

const AdminProfileContext = createContext<AdminProfileContextType | null>(null);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AdminProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await getAdminProfile();
            const data = res.data.data;

            const profileImage = data.profilePic
                ? `${BASE_URL}/uploads/profilePics/${data.profilePic}`
                : "/images/user/owner.jpg";

            setProfile({
                ...data,
                profileImage, //  single source of truth
            });
        } catch (err) {
            console.error("Profile fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile(); // called once on mount
    }, []);

    return (
        <AdminProfileContext.Provider
            value={{
                profile,
                loading,
                refreshProfile: fetchProfile,
            }}
        >
            {children}
        </AdminProfileContext.Provider>
    );
};

export const useAdminProfile = () => {
    const ctx = useContext(AdminProfileContext);
    if (!ctx) {
        throw new Error("useAdminProfile must be used inside AdminProfileProvider");
    }
    return ctx;
};

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../types/user";
import { getUserById, updateUser } from "../../api/userApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Avatar from "../../components/ui/avatar/Avatar";
import Badge from "../../components/ui/badge/Badge";
import { getProfilePicUrl } from "../../utils/common";

const UserDetails = () => {
    const { id } = useParams<{ id: string }>();

    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Image handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);




    console.log(previewUrl);


    const fetchRef = useRef(false);

    useEffect(() => {
        if (id && !fetchRef.current) {
            fetchRef.current = true;
            fetchUser(id);
        }
    }, [id]);



    const fetchUser = async (userId: string) => {
        setLoading(true);
        try {
            const res = await getUserById(userId);
            if (res?.data) {
                setUser(res.data);
                setFormData({
                    ...res.data,
                    kyc: {
                        address: res.data.kyc?.address || {},
                        bank: res.data.kyc?.bank || {},
                    },
                });
                setPreviewUrl(getProfilePicUrl(res.data.profilePic));

            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    /* supports kyc.address.street */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const keys = name.split(".");
            const updated: any = { ...prev };
            let temp = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                temp[keys[i]] = { ...temp[keys[i]] };
                temp = temp[keys[i]];
            }

            temp[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
        // If we want to explicitly remove on save, we might need a flag or special logic.
        // For now, if previewUrl is null, we can assume removal if we modify the logic below
        // or we handle "isDeleted" for image separately.
        // Let's assume sending a special flag or empty string for profilePic in FormData handles removal if supported by backend.
        // Or we just rely on visual removal for now and handle the specific "remove" instruction in handleSave.
    };

    const handleSave = async () => {
        if (!id) return;

        setLoading(true);

        try {
            const payload = new FormData();

            // Append all existing text fields
            Object.keys(formData).forEach((key) => {
                // Skip complex objects handled separately or not needed as is
                if (key === 'kyc' || key === 'categories' || key === 'image' || key === 'profilePic') return;
                const value = (formData as any)[key];
                if (value !== undefined && value !== null) {
                    payload.append(key, value as string);
                }
            });

            // Handle Nested Objects like KYC if needed flat or as JSON string.
            // Usually Request expects flat fields or nested notation like kyc[address][street].
            // But previous code sent JSON payload. Now we must adapt.
            // Let's assume backend handles `kyc.address.street` notation or similar for FormData 
            // OR checks for specific fields.
            // Based on previous JSON payload structure:
            if (formData.kyc?.address) {
                payload.append('kyc[address][street]', formData.kyc.address.street || '');
                payload.append('kyc[address][city]', formData.kyc.address.city || '');
                payload.append('kyc[address][state]', formData.kyc.address.state || '');
                payload.append('kyc[address][zip]', formData.kyc.address.zip || '');
            }
            if (formData.kyc?.bank) {
                payload.append('kyc[bank][bankName]', formData.kyc.bank.bankName || '');
                payload.append('kyc[bank][routingNumber]', formData.kyc.bank.routingNumber || '');
                payload.append('kyc[bank][accountNumber]', formData.kyc.bank.accountNumber || '');
            }

            // Handle Categories
            if (Array.isArray(formData.categories)) {
                const cats = formData.categories
                    .map((cat: any) =>
                        typeof cat === "object" ? cat._id : cat
                    )
                    .join(",");
                payload.append('categories', cats);
            }

            // Handle Image
            if (imageFile) {
                payload.append('profilePic', imageFile);
            } else if (previewUrl === null && user?.profilePic) {
                // User had a pic but removed it. Send instructions to remove.
                // Depending on backend, might need a specific flag.
                // For now, sending an empty string or null might work if backend expects it.
                // Or maybe 'removeProfilePic' flag.
                payload.append('profilePic', '');
            }

            // console.log("FORM-DATA PAYLOAD ENTRIES:");
            // for (let pair of payload.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]); 
            // }

            const res = await updateUser(id, payload);

            if (res) {
                alert("User Updated Successfully");
                setIsEditing(false);
                fetchUser(id);
            }
        } catch (error) {
            console.error("Failed to update user", error);
            alert("Failed to update user");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-brand-500 rounded-full" />
            </div>
        );
    }

    if (!user) return <div className="p-6">User not found</div>;

    const renderField = (
        label: string,
        value: any,
        name?: string,
        type: string = "text"
    ) => (
        <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
                {label}
            </label>
            {isEditing && name ? (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
            ) : (
                <p className="text-gray-900 dark:text-gray-300">
                    {value || "N/A"}
                </p>
            )}
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <PageMeta title={`User Details - ${user.firstName}`} />
            <PageBreadcrumb pageTitle="User Details" />

            {/* ================= HEADER ================= */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border relative">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute top-6 right-6 text-gray-500 hover:text-brand-500"
                >
                    {isEditing ? "✖" : "✏️"}
                </button>

                <div className="flex gap-6 items-center">
                    <div className="relative rounded-full overflow-hidden">
                        <Avatar
                            src={
                                getProfilePicUrl(user.profilePic) ||
                                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
                            }
                        />

                        {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 bg-white text-gray-800 rounded-full hover:bg-gray-100 mr-2"
                                    title="Upload Photo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.007 3h3.986a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7.757a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm5.66 2.038a4 4 0 115.356 3.948 1 1 0 01-1.6.14l-2.129 3.016a5.558 5.558 0 01-1.284 3.9C6.012 21.042 5.02 21 5.02 21l.138-1.46c.168-1.77.726-2.923 1.543-3.076.67-.123 1.636.566 2.012 1.348A2 2 0 0012 18a2 2 0 002-2 2 2 0 00-2-2 4 4 0 00-3.326-1.962zM9 10a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                                        <path d="M4 8a1 1 0 011-1h1.93a1 1 0 00.764-.373L8.68 5.02A1 1 0 019 5h2a1 1 0 01.32.02L12.306 6.627A1 1 0 0013.07 7H15a1 1 0 110 2H13.07a1 1 0 00-.764.373L11.32 10.98A1 1 0 0111 11H9a1 1 0 01-.32-.02L7.694 9.373A1 1 0 006.93 9H5a1 1 0 01-1-1z" />
                                        <path d="M8 11a3 3 0 100 6 3 3 0 000-6z" />
                                    </svg>
                                </button>
                                {(previewUrl || imageFile) && (
                                    <button
                                        onClick={handleRemoveImage}
                                        className="p-1.5 bg-white text-red-600 rounded-full hover:bg-gray-100"
                                        title="Remove Photo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">
                            {user.firstName} {user.lastName}
                        </h1>

                        <div className="flex gap-2 mt-2">
                            <Badge>{user.role}</Badge>
                            <Badge>{user.status}</Badge>
                            {user.isVerified && <Badge>Verified</Badge>}
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            ID: {user._id}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= PERSONAL INFO ================= */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">Personal Information</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                    {renderField("First Name", formData.firstName, "firstName")}
                    {renderField("Last Name", formData.lastName, "lastName")}
                    {renderField("Email", formData.email, "email")}
                    {renderField("Country Code", formData.countryCode, "countryCode")}
                    {renderField("Phone Number", formData.phoneNumber, "phoneNumber")}

                    {renderField(
                        "Date of Birth",
                        formData.dob?.slice(0, 10),
                        "dob",
                        "date"
                    )}
                    {renderField("Country", formData.country, "country")}
                    {renderField("Currency", formData.currency, "currency")}
                </div>
            </div>

            {/* ================= BUSINESS ================= */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">Business Information</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                    {renderField(
                        "Business Name",
                        formData.businessName,
                        "businessName"
                    )}
                    {renderField(
                        "Business ID",
                        formData.businessId,
                        "businessId"
                    )}
                </div>
            </div>

            {/* ================= KYC ADDRESS ================= */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">KYC Address</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                    {renderField(
                        "Street",
                        formData.kyc?.address?.street,
                        "kyc.address.street"
                    )}
                    {renderField(
                        "City",
                        formData.kyc?.address?.city,
                        "kyc.address.city"
                    )}
                    {renderField(
                        "State",
                        formData.kyc?.address?.state,
                        "kyc.address.state"
                    )}
                    {renderField(
                        "ZIP",
                        formData.kyc?.address?.zip,
                        "kyc.address.zip"
                    )}
                </div>
            </div>

            {/* ================= KYC BANK ================= */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border">
                <h3 className="font-semibold mb-4">KYC Bank Details</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                    {renderField(
                        "Bank Name",
                        formData.kyc?.bank?.bankName,
                        "kyc.bank.bankName"
                    )}
                    {renderField(
                        "Routing Number",
                        formData.kyc?.bank?.routingNumber,
                        "kyc.bank.routingNumber"
                    )}
                    {renderField(
                        "Account Number",
                        formData.kyc?.bank?.accountNumber,
                        "kyc.bank.accountNumber"
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-brand-500 text-white rounded"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDetails;

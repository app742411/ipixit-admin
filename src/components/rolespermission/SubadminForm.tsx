import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { PERMISSIONS } from "../../constants/permissions";

interface SubadminFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const SubadminForm: React.FC<SubadminFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        permissions: [] as string[],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || "",
                lastName: initialData.lastName || "",
                email: initialData.email || "",
                password: "", // Empty for edit
                phone: initialData.phone || "",
                permissions: initialData.permissions || [],
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionToggle = (permission: string) => {
        setFormData(prev => {
            const hasPerm = prev.permissions.includes(permission);
            if (hasPerm) {
                return { ...prev, permissions: prev.permissions.filter(p => !p.includes(permission)) };
            } else {
                return { ...prev, permissions: [...prev.permissions, permission] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare payload - only send password if provided
        const payload: any = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            permissions: formData.permissions,
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="subadmin@test.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isEditMode}
                    />
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="9999999999"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                {!isEditMode && (
                    <div className="md:col-span-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="SubAdmin@321"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEditMode}
                        />
                    </div>
                )}
            </div>

            <div>
                <Label className="mb-3 block text-lg font-medium">Role Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    {PERMISSIONS.map(permission => (
                        <label key={permission} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={formData.permissions.includes(permission)}
                                    onChange={() => handlePermissionToggle(permission)}
                                />
                                <div className="h-5 w-5 rounded border border-gray-300 bg-white shadow-sm ring-1 ring-transparent transition-all peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 peer-focus:ring-2 peer-focus:ring-brand-500/20 group-hover:border-brand-400">
                                </div>
                                <svg
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {permission.replace('_', ' ')}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : isEditMode ? "Update Subadmin" : "Create Subadmin"}
                </Button>
            </div>
        </form>
    );
};

export default SubadminForm;

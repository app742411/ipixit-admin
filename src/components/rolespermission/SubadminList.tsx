
import { TrashBinIcon } from "../../icons";

interface Subadmin {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    permissions: string[];
    status?: string;
    createdAt?: string;
}

interface SubadminListProps {
    subadmins: Subadmin[];
    loading?: boolean;
    onEdit: (admin: Subadmin) => void;
    onDelete: (id: string) => void;
}

const SubadminList: React.FC<SubadminListProps> = ({ subadmins, loading, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="border-b border-gray-100 bg-gray-50/50 dark:border-white/[0.05] dark:bg-white/[0.02]">
                        <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">Phone</th>
                            <th className="px-5 py-3">Permissions Count</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">Loading subadmins...</td>
                            </tr>
                        ) : subadmins.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">No subadmins found.</td>
                            </tr>
                        ) : (
                            subadmins.map((admin) => (
                                <tr key={admin._id || admin.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {admin.firstName} {admin.lastName}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {admin.email}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {admin.phone || "N/A"}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                            {admin.permissions?.length || 0} Permissions
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(admin)}
                                                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const id = admin._id || admin.id;
                                                    if (id && window.confirm("Are you sure you want to delete this subadmin?")) {
                                                        onDelete(id);
                                                    }
                                                }}
                                                className="text-error-500 hover:text-error-600"
                                            >
                                                <TrashBinIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubadminList;

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Avatar from "../ui/avatar/Avatar";
import { User } from "../../types/user";
import { TrashBinIcon } from "../../icons";
import { Link } from "react-router-dom";


interface AllListUserCompProps {
    users: User[];
    loading?: boolean;
    onDelete?: (id: string) => void;
    onStatusChange?: (id: string, currentStatus: string) => void;
}

const AllListUserComp: React.FC<AllListUserCompProps> = ({ users, onDelete, onStatusChange }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getFullName = (user: User) => {
        return `${user.firstName} ${user.lastName}`;
    };

    const getDisplayPhone = (user: User) => {
        if (user.phoneNumber) {
            return user.countryCode ? `${user.countryCode} ${user.phoneNumber}` : user.phoneNumber;
        }
        return "N/A";
    };

    const getProfilePicUrl = (profilePic?: string) => {
        if (!profilePic) return null;
        if (profilePic.startsWith("http")) return profilePic;
        return `${import.meta.env.VITE_API_BASE_URL}/uploads/profilePics/${profilePic}`;
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                User
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Role
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Created
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Verified
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Status
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => window.location.href = `/users/${user._id}`} // Or use useNavigate if I can inject it, but component props don't have navigate. 
                                    // The component is cleaner if I wrap row or use a Link. 
                                    // But I can't assume Router context unless I imported Link.
                                    // Better: Use Link from react-router-dom
                                    >
                                        <div className="w-10 h-10 overflow-hidden rounded-full">
                                            <Avatar
                                                src={getProfilePicUrl(user.profilePic) || `https://ui-avatars.com/api/?name=${getFullName(user)}&background=random`}
                                                size="medium"
                                                alt={getFullName(user)}
                                            />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {getFullName(user)}
                                            </span>
                                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                {user.email || getDisplayPhone(user)}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                    {user.role ? (
                                        <Badge
                                            size="sm"
                                            color={user.role === 'seller' ? 'primary' : 'info'}
                                            variant="light"
                                        >
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={user.isVerified ? 'success' : 'warning'}
                                        variant="light"
                                    >
                                        {user.isVerified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={user.status === 'active' ? 'success' : 'light'}
                                        variant="light"
                                    >
                                        {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex gap-2">
                                        {/* Status Toggle */}
                                        <button
                                            title={`Change status (${user.status})`}
                                            onClick={() => onStatusChange?.(user._id, user.status)}
                                            className={`transition-colors ${user.status === "active"
                                                ? "text-green-500 hover:text-green-600"
                                                : "text-gray-400 hover:text-gray-500"
                                                }`}
                                        >
                                            🔄
                                        </button>

                                        {/* Delete */}
                                        <button
                                            title="Delete User"
                                            onClick={() => onDelete?.(user._id)}
                                            className="text-error-500 hover:text-error-600 transition-colors"
                                        >
                                            <TrashBinIcon className="h-5 w-5" />
                                        </button>
                                        {/* View Items – ONLY SELLER */}
                                        {user.role === "seller" && (
                                            <Link
                                                to={`/seller-items/${user._id}`}
                                                title="View All Items"
                                                className="text-brand-500 hover:text-brand-600 transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="3" y="3" width="7" height="7" />
                                                    <rect x="14" y="3" width="7" height="7" />
                                                    <rect x="14" y="14" width="7" height="7" />
                                                    <rect x="3" y="14" width="7" height="7" />
                                                </svg>
                                            </Link>
                                        )}

                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AllListUserComp;

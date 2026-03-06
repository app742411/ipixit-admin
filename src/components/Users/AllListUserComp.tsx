import React, { useState, useEffect } from "react";
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
import { MoreDotIcon } from "../../icons";
import { Link } from "react-router-dom";


interface AllListUserCompProps {
    users: User[];
    loading?: boolean;
    onDelete?: (id: string) => void;
    onStatusChange?: (id: string, currentStatus: string) => void;
}

const AllListUserComp: React.FC<AllListUserCompProps> = ({ users, onDelete, onStatusChange }) => {

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

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
            <div className="relative overflow-x-auto" style={{ minHeight: 70 * 10 }}>
                <Table className="w-full text-left border-collapse whitespace-nowrap">
                    <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <TableCell isHeader className="px-4 py-3">
                                User
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3">
                                Role
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3">
                                Created
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3">
                                Verified
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3">
                                Status
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user._id}
                                className="hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer"
                                onClick={() => window.location.href = `/users/${user._id}`}
                            >
                                <TableCell className="px-4 py-3">
                                    <div
                                        className="flex items-center gap-3"
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
                                <TableCell className="px-4 py-3 text-sm text-gray-600">
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
                                <TableCell className="px-4 py-3 text-sm text-gray-600">
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-sm text-gray-600">
                                    <Badge
                                        size="sm"
                                        color={user.isVerified ? 'success' : 'warning'}
                                        variant="light"
                                    >
                                        {user.isVerified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-sm text-gray-600">
                                    <Badge
                                        size="sm"
                                        color={user.status === 'active' ? 'success' : 'light'}
                                        variant="light"
                                    >
                                        {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="relative inline-block text-left">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdownId(openDropdownId === user._id ? null : user._id);
                                            }}
                                            className="p-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            title="More Actions"
                                        >
                                            <MoreDotIcon className="w-5 h-5" />
                                        </button>

                                        {openDropdownId === user._id && (
                                            <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white/[0.05]">
                                                <div className="py-1">
                                                    {/* View Details - ONLY SELLER OR BOTH */}
                                                    {(user.role === "seller" || user.role === "both") && (
                                                        <Link
                                                            to={`/seller-items/${user._id}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                            title="View All Items"
                                                        >
                                                            View Details (Media)
                                                        </Link>
                                                    )}

                                                    {/* Status Toggle */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onStatusChange?.(user._id, user.status);
                                                            setOpenDropdownId(null);
                                                        }}
                                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                    >
                                                        {user.status === "active" ? "Set Inactive" : "Set Active"}
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete?.(user._id);
                                                            setOpenDropdownId(null);
                                                        }}
                                                        className="block w-full px-4 py-2 text-left text-sm text-error-500 transition-colors hover:bg-error-50 dark:hover:bg-error-500/10"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
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

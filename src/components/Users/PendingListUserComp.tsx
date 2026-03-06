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

interface PendingListUserCompProps {
    users: User[];
    loading?: boolean;
    onApprove?: (id: string, isBuyerToSeller: boolean) => void;
    onReject?: (id: string, isBuyerToSeller: boolean) => void;
}

const PendingListUserComp: React.FC<PendingListUserCompProps> = ({ users, loading, onApprove, onReject }) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getFullName = (user: User) => {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
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

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                No pending requests found.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="relative overflow-x-auto" style={{ minHeight: 70 * 10 }}>
                <Table className="w-full text-left border-collapse whitespace-nowrap">
                    <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <TableCell isHeader className="px-4 py-3">User</TableCell>
                            <TableCell isHeader className="px-4 py-3">Request Type</TableCell>
                            <TableCell isHeader className="px-4 py-3">Requested Date</TableCell>
                            <TableCell isHeader className="px-4 py-3">Status</TableCell>
                            <TableCell isHeader className="px-4 py-3">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const isBuyerToSeller = user.role === 'buyer' && !!user.sellerRequest;

                            return (
                                <TableRow key={user._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-3">
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
                                        <Badge
                                            size="sm"
                                            color={isBuyerToSeller ? 'info' : 'primary'}
                                            variant="light"
                                        >
                                            {isBuyerToSeller ? 'Buyer to Seller' : 'New Seller'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-gray-600">
                                        {formatDate(user.sellerRequest?.requestedAt || user.createdAt)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-gray-600">
                                        <Badge
                                            size="sm"
                                            color="warning"
                                            variant="light"
                                        >
                                            Pending
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onApprove?.(user._id, isBuyerToSeller)}
                                                className="px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-xs font-medium"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => onReject?.(user._id, isBuyerToSeller)}
                                                className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs font-medium"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PendingListUserComp;

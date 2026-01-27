import { useEffect, useState } from "react";
import AllListUserComp from "../../components/Users/AllListUserComp";
import { User, Meta } from "../../types/user";
import { getAllUsers, deleteUser, blockUser } from "../../api/userApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/common/Pagination";

const UserListManage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Filters
    const [search, setSearch] = useState<string>("");
    const [role, setRole] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [page, setPage] = useState<number>(1);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getAllUsers({
                page,
                limit: 10,
                search,
                role: role === 'all' ? undefined : role,
                status: status === 'all' ? undefined : status,
                isDeleted
            });
            setUsers(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, role, isDeleted, status]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 1) {
                setPage(1);
            } else {
                fetchUsers();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleStatusChange = async (id: string) => {
        try {
            await blockUser(id);
            fetchUsers();
        } catch (error) {
            console.error("Failed to change status", error);
            alert("Failed to update status");
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && meta && newPage <= meta.totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <PageMeta title="User Management" />
            <PageBreadcrumb pageTitle="User Management" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-white"
                    />
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-3">
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-white/[0.05]">
                <nav className="-mb-px flex space-x-6">
                    {['all', 'buyer', 'seller'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setRole(tab); setPage(1); }}
                            className={`
                            whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm
                            ${role === tab
                                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                        `}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} Users
                        </button>
                    ))}
                </nav>
            </div>

            {/* Deleted Toggle */}
            <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isDeleted}
                        onChange={(e) => { setIsDeleted(e.target.checked); setPage(1); }}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    Show Deleted Users
                </label>
            </div>

            {/* Content */}
            {loading && !users.length ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <>
                    <AllListUserComp
                        users={users}
                        loading={loading}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />

                    {/* Pagination */}
                    {meta && (
                        <Pagination
                            currentPage={page}
                            totalPages={meta.totalPages}
                            totalItems={meta.total}
                            limit={meta.limit}
                            onPageChange={handlePageChange}
                            loading={loading}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default UserListManage;

"use client";

import { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ItemListComp from "../../components/itemmanagement/ItemListComp";
import { getAllItems } from "../../api/itemApi";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

export default function ItemManagement() {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);
    // const [isDeleted, setIsDeleted] = useState(false);
    const isDeleted = false;

    // Filter handlers
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // const handleDeletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setIsDeleted(e.target.checked);
    //     setPagination(prev => ({ ...prev, page: 1 }));
    // };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
    };


    // Memoized fetch function
    const fetchItems = useCallback(
        async (page = 1, search = "", status = "", deleted = false) => {
            try {
                if (search || status || deleted) {
                    setSearchLoading(true);
                } else {
                    setLoading(true);
                }

                const res = await getAllItems({
                    page,
                    limit: ITEMS_PER_PAGE,
                    search,
                    status: status === "all" ? undefined : status,
                    isDeleted: deleted,
                });


                setItems(res.data || []);

                if (res.pagination) {
                    setPagination({
                        page: res.pagination.currentPage,
                        totalPages: res.pagination.totalPages,
                        total: res.pagination.totalItems,
                    });
                }

            } catch (error) {
                console.error("Failed to fetch items:", error);
            } finally {
                setLoading(false);
                setSearchLoading(false);
            }
        },
        []
    );
    /* 🔍 SEARCH & FILTER EFFECTS */
    useEffect(() => {
        fetchItems(1, debouncedSearch, statusFilter, isDeleted);
    }, [debouncedSearch, statusFilter, isDeleted, fetchItems]);

    const handlePageChange = useCallback(
        (page: number) => {
            fetchItems(page, debouncedSearch, statusFilter, isDeleted);
        },
        [fetchItems, debouncedSearch, statusFilter, isDeleted]
    );

    const handleRefresh = useCallback(() => {
        fetchItems(pagination.page, debouncedSearch, statusFilter, isDeleted);
    }, [fetchItems, pagination.page, debouncedSearch, statusFilter, isDeleted]);

    const handleEdit = useCallback((id: string) => {
        console.log("Edit item", id);
        // Implement edit logic
    }, []);

    const handleView = useCallback((id: string) => {
        console.log("Navigating to item:", id);
        navigate(`/media-management/${id}`);
    }, [navigate]);

    // Map items with category titles
    const mappedItems = items.map((item) => ({
        ...item,
        categoryTitle: item.category?.title ?? "Unknown",
        subCategoryTitles: item.subCategories?.map((s: any) => s.title).join(", ") ?? ""
    }));

    return (
        <div className="p-6 space-y-6">
            <PageMeta title="Item Management" />
            <PageBreadcrumb pageTitle="Item Management" />

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
                        placeholder="Search items..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-white"
                    />
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-3">
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-white"
                        value={statusFilter}
                        onChange={handleStatusChange}
                    >
                        <option value="all">All Items</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Deleted Toggle */}
            {/* <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isDeleted}
                        onChange={handleDeletedChange}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    Show Deleted Items
                </label>
            </div> */}

            <ItemListComp
                items={mappedItems}
                pagination={pagination}
                search={searchInput}
                onSearchChange={handleSearchChange}
                onPageChange={handlePageChange}
                onRefresh={handleRefresh}
                onEdit={handleEdit}
                onView={handleView}
                loading={loading}
                searchLoading={searchLoading}
            />
        </div>
    );
}

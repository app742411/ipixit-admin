"use client";

import { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AddCategoryForm from "../../components/categorymanagment/AddCategoryForm";
import CategoryListComp from "../../components/categorymanagment/CategoryListComp";
import { getAllCategories } from "../../api/categoryapi";
import { useDebounce } from "../../hooks/useDebounce";

const ITEMS_PER_PAGE = 8;

export default function CategoryManage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // 🔍 Controlled input value (instant)
  const [searchInput, setSearchInput] = useState("");

  //  Debounced value (500ms)
  const debouncedSearch = useDebounce(searchInput, 500);

  const [editId, setEditId] = useState<string | null>(null);

  // Memoized fetch function to prevent unnecessary recreations
  const fetchCategories = useCallback(
    async (page = 1, search = "", isSearch = false) => {
      try {
        // Use searchLoading for debounced searches, loading for initial/page changes
        if (isSearch) {
          setSearchLoading(true);
        } else {
          setLoading(true);
        }

        const res = await getAllCategories({
          page,
          limit: ITEMS_PER_PAGE,
          search,
        });

        setCategories(res.data.data);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [debouncedSearch]
  );

  /* INITIAL LOAD */
  useEffect(() => {
    fetchCategories(1, "");
  }, []);

  /* 🔍 SEARCH API (RUNS ONLY AFTER 500ms PAUSE) */
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      fetchCategories(1, debouncedSearch, true);
    }
  }, [debouncedSearch, fetchCategories]);

  // Memoized handlers to prevent prop changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setSearchLoading(true); // Show loading immediately on input
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchCategories(page, debouncedSearch);
    },
    [fetchCategories, debouncedSearch]
  );

  const handleRefresh = useCallback(() => {
    fetchCategories(pagination.page, debouncedSearch);
  }, [fetchCategories, pagination.page, debouncedSearch]);

  const handleEdit = useCallback((id: string) => {
    setEditId(id);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditId(null);
  }, []);

  const handleSuccess = useCallback(() => {
    setEditId(null);
    fetchCategories(pagination.page, debouncedSearch);
  }, [fetchCategories, pagination.page, debouncedSearch]);

  return (
    <div>
      <PageMeta title="Category Management" />
      <PageBreadcrumb pageTitle="Category Management" />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 rounded-2xl border bg-white p-5">
          <AddCategoryForm
            editId={editId}
            onCancelEdit={handleCancelEdit}
            onSuccess={handleSuccess}
          />
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2">
          <CategoryListComp
            categories={categories}
            pagination={pagination}
            search={searchInput}
            onSearchChange={handleSearchChange}
            onPageChange={handlePageChange}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
            loading={loading}
            searchLoading={searchLoading}
          />
        </div>
      </div>
    </div>
  );
}
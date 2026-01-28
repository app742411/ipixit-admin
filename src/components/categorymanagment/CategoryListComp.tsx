import { useState, memo, useCallback } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import toast from "react-hot-toast";
import { removeCategory } from "../../api/categoryapi";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Input from "../form/input/InputField";
import Pagination from "../common/Pagination";

const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/categories/`;

type Category = {
  _id: string;
  title: string;
  image: string;
};

type Props = {
  categories: Category[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  search: string;
  onSearchChange: (v: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onEdit: (id: string) => void;
  loading?: boolean;
  searchLoading?: boolean;
};

const ROW_HEIGHT = 56;
const ITEMS_PER_PAGE = 8;

/* ================= CATEGORY ROW ================= */

const CategoryRow = memo(
  ({
    category,
    onEdit,
    onDelete,
  }: {
    category: Category;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }) => {
    const imageSrc = category.image
      ? `${IMAGE_BASE_URL}${category.image}`
      : "/images/placeholder.png";

    return (
      <div className="flex h-14 items-center justify-between px-2 rounded hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <img
            src={imageSrc}
            alt={category.title}
            loading="lazy"
            className="h-10 w-10 rounded border object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.includes("placeholder")) {
                img.src = "/images/placeholder.png";
              }
            }}
          />
          <h4 className="text-sm font-medium text-gray-900">
            {category.title}
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(category._id)}
            className="text-blue-500 hover:text-blue-600 transition-colors"
            aria-label={`Edit ${category.title}`}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(category._id)}
            className="text-red-500 hover:text-red-600 transition-colors"
            aria-label={`Delete ${category.title}`}
          >
            <TrashBinIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }
);

CategoryRow.displayName = "CategoryRow";

/* ================= CATEGORY LIST ================= */

function CategoryListComp({
  categories,
  pagination,
  search,
  onSearchChange,
  onPageChange,
  onRefresh,
  onEdit,
  loading = false,
  searchLoading = false,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { page, totalPages } = pagination;

  /* ---------- STABLE CALLBACKS ---------- */

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      onEdit(id);
    },
    [onEdit]
  );

  /* ---------- DELETE CATEGORY ---------- */

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await removeCategory(deleteId);
      toast.success("Category deleted successfully");
      setDeleteId(null);
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border bg-white p-5">
      <ComponentCard title="Category List">
        {/* SEARCH */}
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded border px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            </div>
          )}
        </div>

        {/* LIST */}
        <div
          className="divide-y divide-gray-200"
          style={{ minHeight: ROW_HEIGHT * ITEMS_PER_PAGE }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-500">
                {search
                  ? `No categories found for "${search}"`
                  : "No categories found."}
              </p>
            </div>
          ) : (
            categories.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={pagination.total}
          limit={ITEMS_PER_PAGE}
          onPageChange={onPageChange}
          loading={loading}
        />

        {/* DELETE MODAL */}
        {deleteId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteId(null)}
          >
            <div
              className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Category?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </ComponentCard>
    </div>
  );
}

export default memo(CategoryListComp);

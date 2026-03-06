import { useState, memo, useCallback } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import toast from "react-hot-toast";
import { removeCategory, getSubCategoriesByCategoryId, createSubCategory, updateSubCategory, deleteSubCategory } from "../../api/categoryapi";
import { PencilIcon, TrashBinIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon } from "../../icons";
import Input from "../form/input/InputField";
import Pagination from "../common/Pagination";
import Button from "../ui/button/Button";
import Label from "../form/Label";

const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

type SubCategory = {
  _id: string;
  categoryId: string;
  title: string;
  image: string;
};

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
    const [isExpanded, setIsExpanded] = useState(false);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [subLoading, setSubLoading] = useState(false);

    // Subcategory form states
    const [showSubForm, setShowSubForm] = useState(false);
    const [subTitle, setSubTitle] = useState("");
    const [subImageFile, setSubImageFile] = useState<File | null>(null);
    const [subImagePreview, setSubImagePreview] = useState("");
    const [editSubId, setEditSubId] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Delete subcategory state
    const [deleteSubId, setDeleteSubId] = useState<string | null>(null);
    const [isDeletingSub, setIsDeletingSub] = useState(false);

    const imageSrc = category.image
      ? `${IMAGE_BASE_URL}/uploads/categories/${category.image}`
      : "/images/placeholder.png";


    const fetchSubCategories = async () => {
      setSubLoading(true);
      try {
        const res = await getSubCategoriesByCategoryId(category._id);
        // Ensure we always have an array, even if API returns null/undefined
        setSubCategories(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        toast.error("Failed to load subcategories");
        setSubCategories([]); // Fallback to empty array on error
      } finally {
        setSubLoading(false);
      }
    };

    const toggleAccordion = () => {
      if (!isExpanded && subCategories.length === 0) {
        fetchSubCategories();
      }
      setIsExpanded(!isExpanded);
    };

    // Handle Subcategory Add/Edit
    const handleSubSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!subTitle.trim()) {
        return toast.error("Title is required");
      }

      if (!editSubId && !subImageFile) {
        return toast.error("Image is required");
      }

      try {
        setFormLoading(true);
        const formData = new FormData();
        formData.append("categoryId", category._id);
        formData.append("title", subTitle);
        if (subImageFile) {
          formData.append("subImage", subImageFile);
        }

        if (editSubId) {
          await updateSubCategory(editSubId, formData);
          toast.success("Subcategory updated successfully");
        } else {
          await createSubCategory(formData);
          toast.success("Subcategory created successfully");
        }

        // Reset form and refresh list
        setShowSubForm(false);
        setSubTitle("");
        setSubImageFile(null);
        setSubImagePreview("");
        setEditSubId(null);
        fetchSubCategories();

      } catch (error) {
        toast.error(editSubId ? "Failed to update subcategory" : "Failed to create subcategory");
      } finally {
        setFormLoading(false);
      }
    };

    const openEditSubForm = (subReq: SubCategory) => {
      setEditSubId(subReq._id);
      setSubTitle(subReq.title);
      setSubImagePreview(subReq.image ? IMAGE_BASE_URL + subReq.image : "");
      setShowSubForm(true);
    };

    const handleSubDelete = async () => {
      if (!deleteSubId) return;
      setIsDeletingSub(true);
      try {
        await deleteSubCategory(deleteSubId);
        toast.success("Subcategory deleted successfully");
        setDeleteSubId(null);
        fetchSubCategories();
      } catch (error) {
        toast.error("Failed to delete subcategory");
      } finally {
        setIsDeletingSub(false);
      }
    };

    return (
      <div className="border border-gray-100 rounded-lg mb-2 overflow-hidden shadow-sm">
        {/* Main Row */}
        <div
          className="flex min-h-[56px] items-center justify-between px-4 py-2 bg-white hover:bg-gray-50 cursor-pointer"
          onClick={toggleAccordion}
        >
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </button>
            <img
              src={imageSrc}
              alt={category.title}
              loading="lazy"
              className="h-10 w-10 rounded border border-gray-200 object-cover"
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
              onClick={(e) => { e.stopPropagation(); onEdit(category._id); }}
              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
              title={`Edit ${category.title}`}
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(category._id); }}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
              title={`Delete ${category.title}`}
            >
              <TrashBinIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Accordion Content */}
        {isExpanded && (
          <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-sm font-semibold text-gray-700">Subcategories</h5>
              <Button
                size="sm"
                onClick={() => {
                  setEditSubId(null);
                  setSubTitle("");
                  setSubImageFile(null);
                  setSubImagePreview("");
                  setShowSubForm(!showSubForm);
                }}
                className="!px-3 !py-1.5 text-xs flex items-center gap-1"
              >
                {showSubForm ? "Cancel" : <><PlusIcon className="w-3 h-3" /> Add Subcategory</>}
              </Button>
            </div>

            {/* Add / Edit Sub Form */}
            {showSubForm && (
              <form onSubmit={handleSubSubmit} className="bg-white p-4 rounded border border-gray-200 mb-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                <h6 className="text-xs font-semibold mb-3 text-gray-600 uppercase">{editSubId ? 'Edit Subcategory' : 'Add New Subcategory'}</h6>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                      placeholder="Subcategory Title"
                      className="text-sm py-2"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Label className="text-xs">Image</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        id={`subimg-${category._id}`}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setSubImageFile(e.target.files[0]);
                            setSubImagePreview(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                      <label htmlFor={`subimg-${category._id}`} className="cursor-pointer border border-dashed border-gray-300 rounded px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 flex items-center justify-center min-w-[100px]">
                        {subImagePreview ? 'Change Image' : 'Upload Image'}
                      </label>
                      {subImagePreview && (
                        <img src={subImagePreview} className="w-8 h-8 rounded border object-cover" alt="Preview" />
                      )}
                    </div>
                  </div>
                  <div className="self-end pb-1 w-full md:w-auto flex md:block mt-2 md:mt-0">
                    <Button type="submit" disabled={formLoading} size="sm" className="w-full md:w-auto">
                      {formLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Subcategories List */}
            {subLoading ? (
              <div className="flex justify-center py-4 text-xs text-gray-500">Loading subcategories...</div>
            ) : (!subCategories || subCategories.length === 0) ? (
              <div className="text-center py-4 bg-white rounded border border-dashed border-gray-200 text-xs text-gray-500 italic">No subcategories found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subCategories.map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded shadow-sm hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3 truncate">

                      <img
                        src={sub.image ? IMAGE_BASE_URL + "/uploads/subCategories/" + sub.image : "/images/placeholder.png"}
                        className="w-8 h-8 rounded object-cover bg-gray-50"
                        alt={sub.title}
                        onError={(e) => {
                          if (!e.currentTarget.src.includes("placeholder")) {
                            e.currentTarget.src = "/images/placeholder.png";
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700 truncate font-medium">{sub.title}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEditSubForm(sub)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded hover:bg-blue-50">
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteSubId(sub._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50">
                        <TrashBinIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub DELETE MODAL */}
        {deleteSubId && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); !isDeletingSub && setDeleteSubId(null); }}
          >
            <div
              className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Subcategory?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteSubId(null)}
                  disabled={isDeletingSub}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubDelete}
                  disabled={isDeletingSub}
                  className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeletingSub ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
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
          className="flex flex-col space-y-2 mt-4"
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

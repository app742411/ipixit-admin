import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";

import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../../api/categoryapi";

const IMAGE_BASE_URL =
  `${import.meta.env.VITE_API_BASE_URL}/uploads/categories/`;


type Props = {
  onSuccess?: () => void;
  editId?: string | null;
  onCancelEdit?: () => void;
};

export default function AddCategoryForm({
  onSuccess,
  editId,
  onCancelEdit,
}: Props) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");

  /* 🔁 RESET WHEN EXIT EDIT MODE */
  useEffect(() => {
    if (!editId) {
      setTitle("");
      setImageFile(null);
      setImagePreview("");
      setTitleError("");
      setImageError("");
    }
  }, [editId]);

  /* LOAD CATEGORY FOR EDIT */
  useEffect(() => {
    if (!editId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await getCategoryById(editId);
        const category = res.data.data;

        setTitle(category.title);
        setImagePreview(
          category.image ? IMAGE_BASE_URL + category.image : ""
        );
        setImageFile(null);
      } catch {
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [editId]);

  /* IMAGE CHANGE */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed");
      return;
    }

    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ❌ REMOVE IMAGE */
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageError("");
  };

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!title.trim()) {
      setTitleError("Category title is required");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!editId && !imageFile) {
      setImageError("Category image is required");
      valid = false;
    } else {
      setImageError("");
    }

    if (!valid) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        /* UPDATE */
        await updateCategory(editId, formData);
        toast.success("Category updated successfully");
        onCancelEdit?.();
      } else {
        /* ADD */
        await createCategory(formData);
        toast.success("Category added successfully");

        //  RESET FORM AFTER ADD
        setTitle("");
        setImageFile(null);
        setImagePreview("");
        setTitleError("");
        setImageError("");
      }

      //  REFRESH CATEGORY LIST
      onSuccess?.();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };


  return (
    <ComponentCard title={editId ? "Edit Category" : "Add Category"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TITLE */}
        <div>
          <Label>Category Title</Label>
          <Input
            placeholder="Enter category title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {titleError && (
            <p className="mt-1 text-xs text-red-500">{titleError}</p>
          )}
        </div>

        {/* IMAGE */}
        <div>
          <Label>Category Image</Label>

          <label
            htmlFor="category-image"
            className="relative mt-1 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center hover:bg-gray-100"
          >
            <input
              id="category-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {!imagePreview ? (
              <>
                <p className="text-sm font-medium text-gray-700">
                  Upload category image
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG
                </p>
              </>
            ) : (
              <>
                {/* ❌ REMOVE ICON */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs text-red-600 shadow hover:bg-red-50"
                >
                  ✕
                </button>

                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-w-full h-auto max-h-[260px] rounded-md object-contain"
                />
              </>
            )}
          </label>

          {imageError && (
            <p className="mt-1 text-xs text-red-500">{imageError}</p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading
              ? editId
                ? "Updating..."
                : "Adding..."
              : editId
                ? "Update Category"
                : "Add Category"}
          </Button>

          {editId && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </ComponentCard>
  );
}

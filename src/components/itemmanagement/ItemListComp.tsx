import { useState, memo } from "react";
import toast from "react-hot-toast";
import { deleteItem, toggleItemStatus, toggleItemPublish } from "../../api/itemApi";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import Pagination from "../common/Pagination";

const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/items/images/`;

type Item = {
    _id: string;
    title: string;
    seller: {
        firstName: string;
        lastName: string;
        email: string;
    };
    category: { _id: string; title?: string }[];
    price: number;
    currency: string;
    format: string;
    isActive: boolean;
    isPublished: boolean;
    isDeleted: boolean;
    viewsCount: number;
    clicksCount: number;
    likesCount: number;
    purchasesCount: number;
    conversionRate: number;
    createdAt: string;
    updatedAt: string;
    media: { filename: string; type: string }[];
};


type Props = {
    items: Item[];
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
    onView: (id: string) => void;
    loading?: boolean;
    searchLoading?: boolean;
};

const ROW_HEIGHT = 70;
const ITEMS_PER_PAGE = 10;

const ItemRow = memo(
    ({

        item,
        onEdit,
        onDelete,
        onView,
        onToggleStatus,
        onTogglePublish,
    }: {
        item: Item;
        onEdit: (id: string) => void;
        onDelete: (id: string) => void;
        onView: (id: string) => void;
        onToggleStatus: (id: string, current: boolean) => void;
        onTogglePublish: (id: string, current: boolean) => void;
    }) => {


        const getFileIcon = (type: string) => {
            switch (type) {
                case "image":
                    return "🖼️";
                case "video":
                    return "🎥";
                case "audio":
                    return "🎵";
                case "document":
                    return "📄";
                default:
                    return "📁";
            }
        };
        return (
            <tr
                onClick={() => onView(item._id)}
                className="hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer"
            >
                {/* 1. Image */}
                <td className="px-4 py-3">
                    <img
                        src={
                            item.media && item.media.length > 0
                                ? `${IMAGE_BASE_URL}${item.media[0].filename}`
                                : "/images/placeholder.png"
                        }
                        alt={item.title}
                        className="h-10 w-10 rounded border object-cover"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                                "/images/placeholder.png";
                        }}
                    />
                </td>

                {/* 2. Title */}
                <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 truncate block max-w-[150px]" title={item.title}>{item.title}</span>
                </td>

                {/* 3. Seller */}
                <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex flex-col">
                        <span className="font-medium">{item.seller ? `${item.seller.firstName} ${item.seller.lastName}` : 'N/A'}</span>
                        <span className="text-xs text-gray-400">{item.seller?.email}</span>
                    </div>
                </td>

                {/* 4. Categories */}
                <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="truncate block max-w-[150px]" title={item.category?.map(c => c.title || "").filter(Boolean).join(", ")}>
                        {item.category?.map(c => c.title || "").filter(Boolean).join(", ") || "-"}
                    </span>
                </td>

                {/* 5. Format */}
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                    {item.format}
                </td>

                {/* 6. Price */}
                <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {item.price}
                </td>

                {/* 7. Currency */}
                <td className="px-4 py-3 text-sm text-gray-600 uppercase">
                    {item.currency || '-'}
                </td>

                {/* 8. Stats (Views, Clicks, Likes, Purchases) */}
                <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex gap-3 text-xs">
                        <span title="Views" className="flex items-center gap-1">👁 {item.viewsCount}</span>
                        <span title="Clicks" className="flex items-center gap-1">🖱️ {item.clicksCount}</span>
                        <span title="Likes" className="flex items-center gap-1">❤️ {item.likesCount}</span>
                        <span title="Purchases" className="flex items-center gap-1">🛒 {item.purchasesCount}</span>
                    </div>
                </td>

                {/* 9. File Type */}
                <td className="px-4 py-3 text-sm text-gray-600">
                    {item.media && item.media.length > 0 ? (
                        <div className="flex items-center gap-2 max-w-[220px]">
                            <span className="text-lg">
                                {getFileIcon(item.media[0].type)}
                            </span>

                            <div className="flex flex-col overflow-hidden">
                                {/* <span
                                    className="truncate font-medium text-gray-800"
                                    title={item.media[0].filename}
                                >
                                    {item.media[0].filename}
                                </span> */}
                                <span className="text-xs text-gray-400 capitalize">
                                    {item.media[0].type}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">No File</span>
                    )}
                </td>



                {/* 10. Published */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onTogglePublish(item._id, item.isPublished)}>
                        <Badge size="sm" color={item.isPublished ? "primary" : "warning"} variant="light">
                            {item.isPublished ? "Yes" : "No"}
                        </Badge>
                    </button>
                </td>


                {/* 11. Active */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onToggleStatus(item._id, item.isActive)}>
                        <Badge size="sm" color={item.isActive ? "success" : "error"} variant="light">
                            {item.isActive ? "Yes" : "No"}
                        </Badge>
                    </button>
                </td>


                {/* 12. Actions */}
                <td className="px-4 py-3">
                    <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => onEdit(item._id)}
                            className="p-1 text-blue-500 hover:text-blue-600"
                            title="Edit"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => onDelete(item._id)}
                            className="p-1 text-red-500 hover:text-red-600"
                            title="Delete"
                        >
                            <TrashBinIcon className="w-5 h-5" />
                        </button>
                    </div>
                </td>

            </tr>
        );
    }
);
ItemRow.displayName = "ItemRow";

function ItemListComp({
    items,
    pagination,
    search,
    onPageChange,
    onRefresh,
    onEdit,
    onView,
    loading = false,
    searchLoading = false,
}: Props) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { page, totalPages } = pagination;

    /* DELETE ITEM */
    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await deleteItem(deleteId);
            toast.success("Item deleted successfully");
            setDeleteId(null);
            onRefresh();
        } catch (error) {
            toast.error("Failed to delete item");
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    /* TOGGLE STATUS */
    const handleToggleStatus = async (id: string, current: boolean) => {
    try {
        await toggleItemStatus(id, !current);
        toast.success(`Item ${!current ? 'activated' : 'deactivated'}`);
        onRefresh();
    } catch {
        toast.error("Failed to update status");
    }
}

    /* TOGGLE PUBLISH */
    const handleTogglePublish = async (id: string, current: boolean) => {
    try {
        await toggleItemPublish(id, !current);
        toast.success(`Item ${!current ? 'published' : 'unpublished'}`);
        onRefresh();
    } catch {
        toast.error("Failed to update publish status");
    }
}

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="relative overflow-x-auto" style={{ minHeight: ROW_HEIGHT * ITEMS_PER_PAGE }}>
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Seller</th>
                            <th className="px-4 py-3">Categories</th>
                            <th className="px-4 py-3">Format</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Currency</th>
                            <th className="px-4 py-3">Stats</th>
                            <th className="px-4 py-3">File Type</th>
                            <th className="px-4 py-3">Published</th>
                            <th className="px-4 py-3">Active</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={12} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
                                        <p className="text-sm text-gray-500">Loading items...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="py-12 text-center text-sm text-gray-500">
                                    {search ? `No items found for "${search}"` : "No items found."}
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <ItemRow
                                    key={item._id}
                                    item={item}
                                    onEdit={onEdit}
                                    onDelete={setDeleteId}
                                    onView={onView}
                                    onToggleStatus={handleToggleStatus}
                                    onTogglePublish={handleTogglePublish}
                                />
                            ))
                        )}
                    </tbody>
                </table>

                {searchLoading && !loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
                    </div>
                )}
            </div>

            {/* 📄 PAGINATION */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={pagination.total}
                limit={ITEMS_PER_PAGE}
                onPageChange={onPageChange}
                loading={loading}
            />

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
                            Delete Item?
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(ItemListComp);

import React from "react";
import Badge from "../ui/badge/Badge";
import {
  EyeIcon,
  DollarLineIcon,
  BoxCubeIcon,
  ShootingStarIcon,
  UserIcon,
  FileIcon,
  AudioIcon,
  ChatIcon,
  PieChartIcon,
  FolderIcon,
} from "../../icons";

interface Media {
  _id: string;
  type: string;
  filename: string;
  uploadedAt: string;
  fileSize?: number;
  mimeType?: string;
  recommendedFor?: string;
  metadata?: Record<string, unknown>;
}

interface Item {
  _id: string;
  title: string;
  description: string;
  price?: number;
  currency: string;
  format: string;
  isActive: boolean;
  isPublished: boolean;
  isDeleted?: boolean;
  viewsCount: number;
  clicksCount: number;
  purchasesCount: number;
  likesCount: number;
  commentsCount: number;
  favoritesCount?: number;
  conversionRate?: number;
  tags: string[];
  category?: { _id: string; title: string };
  subCategories?: { _id: string; title: string }[];
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileCompletion?: number;
  };
  media: Media[];
  createdAt: string;
  updatedAt: string;
  publicToken?: string;
}

interface ItemDetailsCompProps {
  item: Item;
}

const ItemDetailsComp: React.FC<ItemDetailsCompProps> = ({ item }) => {
  const base = import.meta.env.VITE_API_BASE_URL;

  const getMediaUrl = (media: Media) => {
    let path = "images";
    if (media.type === "video") path = "videos";
    if (media.type === "audio") path = "audio";
    if (media.type === "document") path = "documents";

    return `${base}/uploads/items/${path}/${media.filename}`;
  };

  const renderMediaContent = (media: Media) => {
    const url = getMediaUrl(media);

    switch (media.type) {
      case "image":
        return (
          <img
            src={url}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
        );

      case "video":
        return (
          <video
            src={url}
            controls
            className="w-full h-full rounded-lg bg-black"
          />
        );

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg border border-dashed border-gray-200 dark:border-white/[0.1]">
            <AudioIcon className="w-12 h-12 text-brand-500 mb-4" />
            <audio src={url} controls className="w-full" />
            <p className="mt-2 text-xs text-gray-500 truncate w-full text-center">
              {media.filename}
            </p>
          </div>
        );

      case "document":
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 dark:bg-white/[0.02] rounded-lg border border-dashed border-gray-200 dark:border-white/[0.1] hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
            <FileIcon className="w-12 h-12 text-brand-500 mb-4" />
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate w-full text-center">
              {media.filename}
            </p>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-2 bg-brand-500 text-white text-sm rounded-md hover:bg-brand-600 transition-colors"
            >
              Download / View
            </a>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-white/[0.02] rounded-lg">
            <span className="text-gray-400">Unsupported Media Type</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN — MEDIA & DESCRIPTION */}

        <div className="lg:col-span-2 space-y-6">
          {/* Media Gallery Card */}
          <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-white/[0.05]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Media Gallery
            </h2>

            {item.media && item.media.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.media.map((m) => (
                  <div
                    key={m._id}
                    className="aspect-video relative overflow-hidden ring-1 ring-gray-200 dark:ring-white/[0.1] rounded-lg group"
                  >
                    {renderMediaContent(m)}

                    <div className="absolute top-2 right-2 flex gap-1">
                      {m.mimeType && (
                        <Badge size="sm" color="light" variant="light">
                          {m.mimeType.split("/").pop()}
                        </Badge>
                      )}

                      <Badge size="sm" color="light" variant="light">
                        {m.type}
                      </Badge>
                    </div>

                    {/* Hover Overlay with Metadata */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p className="truncate font-medium mb-1 drop-shadow-md">
                        {m.filename}
                      </p>
                      <div className="flex justify-between items-center text-white/80">
                        <span>
                          {m.fileSize
                            ? (m.fileSize / 1024).toFixed(1) + " KB"
                            : ""}
                        </span>
                        <span>
                          {m.metadata?.resolution
                            ? String(m.metadata.resolution)
                            : m.metadata?.pages
                              ? `${m.metadata.pages} pages`
                              : m.metadata?.duration
                                ? `${Number(m.metadata.duration).toFixed(1)}s`
                                : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-dashed border-gray-200 dark:border-white/[0.1]">
                <p className="text-gray-400">
                  No media available for this item
                </p>
              </div>
            )}
          </div>

          {/* Description */}

          <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-white/[0.05]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Description
            </h2>

            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
              {item.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN — INFO, STATS, SELLER, TAGS */}

        <div className="space-y-6">
          {/* Header Details Card */}
          <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-white/[0.05]">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                {item.title}
              </h1>

              <div className="flex flex-col gap-2 shrink-0 ml-2">
                {item.isDeleted && (
                  <Badge color="error" variant="light">
                    Deleted
                  </Badge>
                )}

                <Badge
                  color={item.isActive ? "success" : "error"}
                  variant="light"
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Badge
                color={item.isPublished ? "primary" : "warning"}
                variant="light"
              >
                {item.isPublished ? "Published" : "Draft"}
              </Badge>

              <Badge color="light" variant="light">
                {item.format}
              </Badge>
            </div>

            {item.price !== undefined && (
              <div className="text-3xl font-bold text-brand-600 mb-6 flex items-baseline gap-1">
                {item.price}
                <span className="text-lg font-normal text-gray-500 uppercase">
                  {item.currency}
                </span>
              </div>
            )}

            {item.price === undefined && item.currency && (
              <div className="text-lg font-normal text-gray-500 uppercase mb-6">
                {item.currency}
              </div>
            )}

            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 shrink-0">Main Category</span>
                <span className="text-brand-500 font-medium truncate ml-2">
                  {item.category?.title || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 shrink-0">Subcategories</span>

                <div className="flex flex-wrap gap-1 justify-end ml-2">
                  {item.subCategories?.length
                    ? item.subCategories.map((sub) => (
                        <span
                          key={sub._id}
                          className="text-purple-500 font-medium text-right"
                        >
                          {sub.title}
                        </span>
                      ))
                    : "-"}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created At</span>
                <span className="text-gray-900 dark:text-gray-300">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Updated At</span>
                <span className="text-gray-900 dark:text-gray-300">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {item.publicToken && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 shrink-0">Public Token</span>
                  <span
                    className="text-gray-900 dark:text-gray-300 font-mono text-xs truncate max-w-[150px] ml-2"
                    title={item.publicToken}
                  >
                    {item.publicToken}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-white/[0.05]">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Performance Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl flex items-center gap-3">
                <EyeIcon className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {item.viewsCount}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl flex items-center gap-3">
                <BoxCubeIcon className="w-5 h-5 text-purple-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Clicks</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {item.clicksCount}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl flex items-center gap-3">
                <ShootingStarIcon className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Likes</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {item.likesCount}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl flex items-center gap-3">
                <DollarLineIcon className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Sales</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {item.purchasesCount}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl flex items-center gap-3">
                <FolderIcon className="w-5 h-5 text-pink-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Favorites</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {item.favoritesCount ?? 0}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl flex items-center gap-3">
                <ChatIcon className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Comments</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {item.commentsCount ?? 0}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl flex items-center gap-3 col-span-2">
                <PieChartIcon className="w-5 h-5 text-teal-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Conversion Rate</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {item.conversionRate ? `${item.conversionRate}%` : "0%"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          {item.seller && (
            <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-white/[0.05]">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">
                Seller Information
              </h3>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500 text-2xl font-bold uppercase">
                  {item.seller?.firstName?.[0] || ""}
                  {item.seller?.lastName?.[0] || ""}
                </div>
                <div className="w-full">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    {item.seller?.firstName} {item.seller?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {item.seller?.email}
                  </p>
                  {item.seller?.profileCompletion !== undefined && (
                    <div className="w-full flex flex-col items-center mt-3">
                      <div className="flex justify-between w-full text-xs mb-1">
                        <span className="text-gray-500">
                          Profile Completion
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {item.seller.profileCompletion}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-white/[0.1] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-500 h-1.5 rounded-full"
                          style={{ width: `${item.seller.profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                  <Badge
                    color="light"
                    variant="light"
                    startIcon={<UserIcon className="w-3.5 h-3.5" />}
                  >
                    View Seller Profile
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Tags Card */}
          <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-white/[0.05]">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.tags?.length > 0 ? (
                item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-white/[0.1]"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No tags provided</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsComp;

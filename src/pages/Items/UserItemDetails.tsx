/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { getItemsBySellerId } from "../../api/itemApi";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

export default function SellerItemDetails() {
    const { id } = useParams<{ id: string }>();

    const [items, setItems] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getItemsBySellerId(id)
            .then((res: any) => {
                setItems(res.data || []);
                setSelectedItem(res.data?.[0] || null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const LoadingSkeleton = () => (
        <div className="animate-pulse p-6 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Items Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
                This seller hasn't listed any items yet. Check back later for updates.
            </p>
        </div>
    );

    if (loading) return <LoadingSkeleton />;
    if (!items.length) return <EmptyState />;

    return (
        <div className="p-6 space-y-8">
            <PageMeta title="Seller Items" />
            <PageBreadcrumb pageTitle="Seller Items" />

            {/* Header with Stats */}
            {/* <div className="bg-gradient-to-r from-brand-50 to-indigo-50 rounded-xl p-6 border">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Seller Items Management</h1>
                        <p className="text-gray-600 mt-1">Manage and view all items from this seller</p>
                    </div>
                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                        <p className="text-sm text-gray-500">Total Items</p>
                        <p className="text-2xl font-bold text-brand-600">{items.length}</p>
                    </div>
                </div>
            </div> */}

            {/* SELLER INFORMATION */}
            <ComponentCard
                title="Seller Profile"
                className="lg:col-span-3 border-0 shadow-lg"
            >
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedItem.seller.firstName} {selectedItem.seller.lastName}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Seller ID: {selectedItem.seller._id}</p>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 text-green-800 font-medium">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Profile Completion: {selectedItem.seller.profileCompletion}%
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Total Items</p>
                                <p className="text-lg font-bold text-gray-900">{items.length}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Active Items</p>
                                <p className="text-lg font-bold text-green-600">
                                    {items.filter(i => i.isActive).length}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Seller Since</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ComponentCard>

            {/* ITEM LIST */}
            <ComponentCard title="Item Gallery" className="border-0 shadow-lg">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">All Items ({items.length})</h3>
                        <p className="text-sm text-gray-500">Click on any item to view details</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Active:</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {items.filter(i => i.isActive).length} items
                        </span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="relative overflow-x-auto" style={{ minHeight: 70 * 5 }}>
                        <Table className="w-full text-left border-collapse whitespace-nowrap">
                            <TableHeader>
                                <TableRow className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <TableCell isHeader className="px-4 py-3">Image</TableCell>
                                    <TableCell isHeader className="px-4 py-3">Title</TableCell>
                                    <TableCell isHeader className="px-4 py-3">Format</TableCell>
                                    <TableCell isHeader className="px-4 py-3">Price</TableCell>
                                    <TableCell isHeader className="px-4 py-3">Stats</TableCell>
                                    <TableCell isHeader className="px-4 py-3">Active</TableCell>
                                    <TableCell isHeader className="px-4 py-3">Action</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow
                                        key={item._id}
                                        onClick={() => setSelectedItem(item)}
                                        className={`hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer ${selectedItem?._id === item._id ? "bg-brand-50/50" : ""
                                            }`}
                                    >
                                        <TableCell className="px-4 py-3">
                                            <img
                                                src={
                                                    item.media && item.media.length > 0
                                                        ? `${import.meta.env.VITE_API_BASE_URL}/uploads/items/images/${item.media[0].filename}`
                                                        : "/images/placeholder.png"
                                                }
                                                alt={item.title}
                                                className="h-10 w-10 rounded border object-cover"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src =
                                                        "/images/placeholder.png";
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 truncate block max-w-[150px]" title={item.title}>
                                                    {item.title}
                                                </span>
                                                {selectedItem?._id === item._id && (
                                                    <span className="text-xs text-brand-600 font-medium">Selected</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm text-gray-600 capitalize">
                                            {item.format}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {item.currency} {item.price}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm text-gray-600">
                                            <div className="flex gap-3 text-xs">
                                                <span title="Views" className="flex items-center gap-1">👁 {item.viewsCount}</span>
                                                <span title="Likes" className="flex items-center gap-1">❤️ {item.likesCount}</span>
                                                <span title="Purchases" className="flex items-center gap-1">🛒 {item.purchasesCount}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}>
                                                {item.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <button
                                                className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedItem(item);
                                                }}
                                            >
                                                View
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ComponentCard>

            {/* SELECTED ITEM DETAILS */}
            {selectedItem && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-l-4 border-brand-500 pl-3">
                        Item Details
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* MEDIA SECTION */}
                        <ComponentCard
                            title="Media Gallery"
                            className="lg:col-span-1 border-0 shadow-lg"
                        >
                            <div className="space-y-4">
                                {selectedItem.media.map((m: any) => {
                                    const base = import.meta.env.VITE_API_BASE_URL;
                                    return (
                                        <div key={m._id} className="border rounded-lg overflow-hidden group">
                                            <div className="bg-gray-50 p-3 border-b">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {m.type.charAt(0).toUpperCase() + m.type.slice(1)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {m.filename}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                {m.type === "image" && (
                                                    <div className="relative overflow-hidden rounded">
                                                        <img
                                                            src={`${base}/uploads/items/images/${m.filename}`}
                                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                            alt={selectedItem.title}
                                                        />
                                                    </div>
                                                )}
                                                {m.type === "video" && (
                                                    <div className="relative">
                                                        <video
                                                            controls
                                                            className="w-full rounded"
                                                            poster={`${base}/uploads/items/images/thumbnail_${m.filename.replace(/\.[^/.]+$/, ".jpg")}`}
                                                        >
                                                            <source src={`${base}/uploads/items/videos/${m.filename}`} />
                                                        </video>
                                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                            <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                {m.type === "audio" && (
                                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                            </svg>
                                                            <audio controls className="flex-1">
                                                                <source src={`${base}/uploads/items/audio/${m.filename}`} />
                                                            </audio>
                                                        </div>
                                                    </div>
                                                )}
                                                {m.type === "document" && (
                                                    <a
                                                        href={`${base}/uploads/items/documents/${m.filename}`}
                                                        target="_blank"
                                                        className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {m.filename}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Click to download</p>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ComponentCard>

                        {/* ITEM INFORMATION */}
                        <ComponentCard
                            title="Item Information"
                            className="lg:col-span-2 border-0 shadow-lg"
                        >
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                                    <p className="text-gray-600 leading-relaxed">{selectedItem.description}</p>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">Price</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {selectedItem.currency} {selectedItem.price}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">Format</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {selectedItem.format}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">Published</span>
                                        </div>
                                        <div className="mt-2">
                                            {selectedItem.isPublished ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    No
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">Public Token</span>
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 mt-2 truncate">
                                            {selectedItem.publicToken}
                                        </p>
                                    </div>
                                </div>

                                {/* Categories & Tags */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categories
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedItem.category ? (
                                                <span
                                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-brand-100 to-brand-50 text-brand-800 border border-brand-200"
                                                >
                                                    {selectedItem.category.title}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No category</span>
                                            )}
                                            {selectedItem.subCategories?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {selectedItem.subCategories.map((s: any) => (
                                                        <span
                                                            key={s._id}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                                                        >
                                                            {s.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedItem.tags.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tags
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedItem.tags.map((t: string) => (
                                                    <span
                                                        key={t}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Performance Stats */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{selectedItem.viewsCount}</p>
                                            <p className="text-sm text-gray-500">Total Views</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-3">
                                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{selectedItem.likesCount}</p>
                                            <p className="text-sm text-gray-500">Likes</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border">
                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{selectedItem.purchasesCount}</p>
                                            <p className="text-sm text-gray-500">Purchases</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ComponentCard>


                    </div>
                </div>
            )}
        </div>
    );
}

// const Info = ({ label, value }: any) => (
//     <div>
//         <p className="text-xs text-gray-500 uppercase">{label}</p>
//         <p className="font-medium">{value}</p>
//     </div>
// );

// const Stat = ({ label, value }: any) => (
//     <div className="p-3 border rounded">
//         <p className="text-lg font-bold">{value}</p>
//         <p className="text-xs text-gray-500">{label}</p>
//     </div>
// );
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    limit,
    onPageChange,
    loading = false,
}) => {
    if (totalPages <= 1) return null;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && !loading) {
            onPageChange(newPage);
        }
    };

    return (
        <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
            <div className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(currentPage * limit, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                >
                    Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalPages, startPage + 4);

                    if (endPage - startPage < 4) {
                        startPage = Math.max(1, endPage - 4);
                    }

                    const p = startPage + i;
                    if (p > totalPages) return null;

                    return (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            disabled={loading}
                            className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors
                            ${currentPage === p
                                    ? 'bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.05]'}
                        `}
                        >
                            {p}
                        </button>
                    );
                })}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;

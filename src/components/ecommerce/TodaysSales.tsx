

export default function TodaysSales() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-[300px] flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Today's Sales</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sales Summary</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors mt-3 sm:mt-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {/* Card 1 */}
                <div className="rounded-xl p-4 flex flex-col justify-between" style={{ backgroundColor: '#FFE2E5' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FA5A7D' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">$1k</h4>
                        <p className="text-sm font-medium text-gray-800 mb-2">Total Sales</p>
                        <p className="text-xs text-blue-500 font-medium">+8% from yesterday</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-xl p-4 flex flex-col justify-between" style={{ backgroundColor: '#FFF4DE' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FF947A' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">300</h4>
                        <p className="text-sm font-medium text-gray-800 mb-2">Total Order</p>
                        <p className="text-xs text-blue-500 font-medium">+5% from yesterday</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-xl p-4 flex flex-col justify-between" style={{ backgroundColor: '#DCFCE7' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#3CD856' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">5</h4>
                        <p className="text-sm font-medium text-gray-800 mb-2">Sold</p>
                        <p className="text-xs text-blue-500 font-medium">+1.2% from yesterday</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="rounded-xl p-4 flex flex-col justify-between" style={{ backgroundColor: '#F3E8FF' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#BF83FF' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5c-2.2 0-4 1.8-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-1">8</h4>
                        <p className="text-sm font-medium text-gray-800 mb-2">New Customers</p>
                        <p className="text-xs text-blue-500 font-medium">0.5% from yesterday</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

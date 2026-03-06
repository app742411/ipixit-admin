

// const products = [
//     { id: "01", name: "Home Decor Range", popularity: 45, color: "bg-blue-500", borderColor: "border-blue-500", textColor: "text-blue-500" },
//     { id: "02", name: "Disney Princess Pink Bag 18'", popularity: 29, color: "bg-green-500", borderColor: "border-green-500", textColor: "text-green-500" },
//     { id: "03", name: "Bathroom Essentials", popularity: 18, color: "bg-purple-500", borderColor: "border-purple-500", textColor: "text-purple-500" },
//     { id: "04", name: "Apple Smartwatches", popularity: 25, color: "bg-orange-500", borderColor: "border-orange-500", textColor: "text-orange-500" },
// ];

// export default function TopProducts() {
//     return (
//         <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-full flex flex-col">
//             <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Top Products</h3>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
//                     <thead className="text-xs uppercase bg-transparent text-gray-400 border-b border-gray-100 pb-2">
//                         <tr>
//                             <th className="font-medium pb-3 w-12">#</th>
//                             <th className="font-medium pb-3 w-1/2">Name</th>
//                             <th className="font-medium pb-3 text-center">Popularity</th>
//                             <th className="font-medium pb-3 text-right">Sales</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.map((product) => (
//                             <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
//                                 <td className="py-4 font-medium text-gray-600 dark:text-gray-300">{product.id}</td>
//                                 <td className="py-4 font-medium text-gray-800 dark:text-gray-200">{product.name}</td>
//                                 <td className="py-4 w-32 px-4">
//                                     <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
//                                         <div className={`${product.color} h-1.5 rounded-full`} style={{ width: `${product.popularity}%` }}></div>
//                                     </div>
//                                 </td>
//                                 <td className="py-4 text-right">
//                                     <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-md border ${product.borderColor} ${product.textColor} bg-transparent`}>
//                                         {product.popularity}%
//                                     </span>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
const products = [
    {
        id: "01",
        name: "Wild Animals Collection",
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
        orders: 210,
        popularity: 65,
        color: "bg-blue-500",
        borderColor: "border-blue-500",
        textColor: "text-blue-500",
    },
    {
        id: "02",
        name: "Luxury Cars Images",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        orders: 175,
        popularity: 52,
        color: "bg-green-500",
        borderColor: "border-green-500",
        textColor: "text-green-500",
    },
    {
        id: "03",
        name: "Dubai City Images",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090",
        orders: 140,
        popularity: 40,
        color: "bg-purple-500",
        borderColor: "border-purple-500",
        textColor: "text-purple-500",
    },
    {
        id: "04",
        name: "Exotic Animal Photos",
        image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7",
        orders: 95,
        popularity: 30,
        color: "bg-orange-500",
        borderColor: "border-orange-500",
        textColor: "text-orange-500",
    },
];

export default function ImageSellingOrders() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">
                Top Media
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="text-xs uppercase text-gray-400 border-b border-gray-100">
                        <tr>
                            <th className="pb-3 w-12">#</th>
                            <th className="pb-3">Image</th>
                            <th className="pb-3 text-center">Popularity</th>
                            <th className="pb-3 text-right">Orders</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="py-4 font-medium text-gray-600 dark:text-gray-300">
                                    {product.id}
                                </td>

                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            {product.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="py-4 w-40 px-4">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                        <div
                                            className={`${product.color} h-1.5 rounded-full`}
                                            style={{ width: `${product.popularity}%` }}
                                        ></div>
                                    </div>
                                </td>

                                <td className="py-4 text-right">
                                    <span
                                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-md border ${product.borderColor} ${product.textColor}`}
                                    >
                                        {product.orders}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
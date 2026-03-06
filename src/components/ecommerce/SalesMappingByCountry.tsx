
import CountryMap from "./CountryMap";

export default function SalesMappingByCountry() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Sales Mapping by Country</h3>
            <div className="flex-1 w-full flex items-center justify-center min-h-[250px] relative">
                <CountryMap mapColor="#E5E7EB" />
                {/* Placeholder for the color pins or custom SVG overlay if vector map doesn't match perfectly, but CountryMap works as a good starting point */}
            </div>
        </div>
    );
}


import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function TargetVsReality() {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            fontFamily: "Outfit, sans-serif",
            toolbar: { show: false },
        },
        colors: ["#10B981", "#F59E0B"], // Green, Yellow
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: "#9CA3AF" }
            }
        },
        yaxis: {
            show: false,
        },
        grid: { show: false },
        legend: { show: false }, // Use custom HTML legend instead
        fill: { opacity: 1 },
        tooltip: {
            y: { formatter: (val) => `${val}` }
        }
    };

    const series = [
        { name: "Reality", data: [40, 25, 30, 40, 25, 35, 40] },
        { name: "Target", data: [50, 40, 50, 60, 55, 65, 60] }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Target vs Reality</h3>
            <div className="flex-1 min-h-[150px]">
                <Chart options={options} series={series} type="bar" width="100%" height="150" />
            </div>

            <div className="flex flex-col gap-3 mt-4">
                {/* Metric 1 */}
                <div className="flex justify-between items-center w-full px-2 py-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg text-green-500">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Reality Sales</p>
                            <p className="text-xs text-gray-400">Global</p>
                        </div>
                    </div>
                    <p className="font-bold text-green-500">8.823</p>
                </div>
                {/* Metric 2 */}
                <div className="flex justify-between items-center w-full px-2 py-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg text-yellow-500">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Target Sales</p>
                            <p className="text-xs text-gray-400">Commercial</p>
                        </div>
                    </div>
                    <p className="font-bold text-yellow-500">12.122</p>
                </div>
            </div>
        </div>
    );
}

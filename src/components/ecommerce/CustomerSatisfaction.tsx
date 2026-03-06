
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function CustomerSatisfaction() {
    const options: ApexOptions = {
        chart: {
            type: "area",
            fontFamily: "Outfit, sans-serif",
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: ["#3B82F6", "#10B981"], // Blue, Green
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false } // Hide labels if wanted according to design, but maybe show them? The design shows the lines, but no x/y axis labels and a solid fill.
        },
        yaxis: {
            show: false,
        },
        grid: { show: false },
        legend: { show: false }, // Custom legend at bottom
        markers: {
            size: 4,
            hover: { size: 6 }
        }
    };

    const series = [
        { name: "Last Month", data: [40, 50, 30, 30, 45, 40, 60] },
        { name: "This Month", data: [60, 50, 55, 45, 60, 45, 80] }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-full flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-2 w-full text-left">Customer Satisfaction</h3>
            <div className="flex-1 w-full min-h-[200px]">
                <Chart options={options} series={series} type="area" width="100%" height="100%" />
            </div>

            <div className="flex justify-center items-center gap-10 border-t border-gray-100 pt-4 w-full mt-2">
                <div className="text-center">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-sm font-medium text-gray-500">Last Month</span>
                    </div>
                    <p className="font-bold text-gray-800 text-lg">$3,004</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm font-medium text-gray-500">This Month</span>
                    </div>
                    <p className="font-bold text-gray-800 text-lg">$4,504</p>
                </div>
            </div>
        </div>
    );
}

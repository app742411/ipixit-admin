
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function VolumeVsServiceLevel() {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            stacked: true,
            fontFamily: "Outfit, sans-serif",
            toolbar: { show: false },
        },
        colors: ["#3B82F6", "#10B981"], // Blue, Green
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "40%",
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: false },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false } // Hidden in design
        },
        yaxis: {
            show: false,
        },
        grid: { show: false },
        legend: { show: false },
        fill: { opacity: 1 },
        tooltip: {
            y: { formatter: (val) => `${val}` }
        }
    };

    const series = [
        { name: "Volume", data: [400, 300, 200, 180, 150, 100, 250] },
        { name: "Services", data: [150, 200, 100, 250, 200, 130, 200] }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Volume vs Service Level</h3>

            <div className="flex-1 min-h-[150px] w-full mt-4">
                <Chart options={options} series={series} type="bar" width="100%" height="150" />
            </div>

            <div className="flex justify-center items-center gap-8 mt-6 border-t border-gray-100 pt-4">
                <div className="text-center">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-sm font-medium text-gray-400">Volume</span>
                    </div>
                    <p className="font-bold text-gray-800">1,135</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm font-medium text-gray-400">Services</span>
                    </div>
                    <p className="font-bold text-gray-800">635</p>
                </div>
            </div>
        </div>
    );
}

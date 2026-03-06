
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function TotalRevenue() {
    const options: ApexOptions = {
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
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
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: "#9CA3AF" }
            }
        },
        yaxis: {
            min: 0,
            max: 25,
            tickAmount: 5,
            labels: {
                formatter: (value) => `${value}k`,
                style: { colors: "#9CA3AF" }
            }
        },
        grid: {
            borderColor: "#F3F4F6",
            strokeDashArray: 0,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } }
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            markers: { size: 6, shape: "circle" },
            itemMargin: { horizontal: 15 }
        },
        fill: { opacity: 1 },
        tooltip: {
            y: { formatter: (val) => `$${val}k` }
        }
    };

    const series = [
        { name: "Total Sales", data: [14, 17, 6, 16, 12, 17, 21] },
        { name: "Total Revenue", data: [13, 12, 23, 6, 11, 14, 11] }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Total Revenue</h3>
            <div className="flex-1 min-h-[300px]">
                <Chart options={options} series={series} type="bar" width="100%" height="100%" />
            </div>
        </div>
    );
}

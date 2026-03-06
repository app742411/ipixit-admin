
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function VisitorInsights() {
    const options: ApexOptions = {
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: ["#A700FF", "#EF4444", "#3FBAC2"],
        dataLabels: { enabled: false },
        stroke: {
            curve: "smooth",
            width: 3
        },
        fill: {
            type: "solid",
            opacity: 1,
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: "#9CA3AF",
                    fontSize: "12px",
                }
            }
        },
        yaxis: {
            min: 0,
            max: 400,
            tickAmount: 4,
            labels: {
                style: {
                    colors: "#9CA3AF",
                    fontSize: "12px",
                }
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
            markers: {
                shape: "square",
                size: 6,
                offsetX: -4,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 10
            }
        },
        markers: {
            size: 0,
            hover: { size: 6 }
        }
    };

    const series = [
        { name: "Loyal Customers", data: [320, 340, 260, 180, 200, 280, 350, 310, 250, 180, 150, 120] },
        { name: "New Customers", data: [250, 220, 140, 120, 210, 340, 380, 340, 280, 210, 160, 120] },
        { name: "Unique Customers", data: [280, 360, 360, 300, 220, 220, 280, 330, 320, 280, 220, 180] }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 w-full h-[300px] flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Visitor Insights</h3>
            <div className="flex-1 min-h-[300px]">
                <Chart options={options} series={series} type="line" width="100%" height="75%" />
            </div>
        </div>
    );
}

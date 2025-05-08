import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const BarChartRecruiter = ({ jobs, applications }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Công việc", "Đơn ứng tuyển"],
        datasets: [
          {
            label: "Dữ liệu",
            data: [jobs, applications],
            backgroundColor: ["#FFC107", "#2196F3"], // Customize colors if needed
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#495057",
              font: {
                size: 14,
              },
            },
          },
        },
        cutout: "60%",
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    });
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {jobs + applications}
        </div>
        <div className="text-gray-600">Tổng</div>
      </div>
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const TreatmentsChart = () => {
    const data = {
        labels: ['Consultation', 'Scaling', 'Root Canal', 'Others'],
        datasets: [
            {
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#2563eb', // blue-600
                    '#38bdf8', // sky-400
                    '#818cf8', // indigo-400
                    '#f1f5f9', // slate-100
                ],
                hoverOffset: 10,
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '70%', // This creates the "Donut" hole
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 12 }
                }
            },
        },
    };

    return (
        <div className="relative h-full w-full">
            <Doughnut data={data} options={options} />
            {/* Center Percentage Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">82%</span>
                <span className="text-xs text-slate-400 font-medium">Capacity</span>
            </div>
        </div>
    );
};
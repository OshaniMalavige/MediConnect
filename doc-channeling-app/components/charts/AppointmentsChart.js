"use client";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { border: { dash: [5, 5] }, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
    },
};

export const AppointmentsChart = ({ rawData = [] }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);

    rawData.forEach(app => {
        if (app.appointmentDate) {
            const dayIndex = new Date(app.appointmentDate).getDay();
            counts[dayIndex]++;
        }
    });

    // Reorder: Mon-Sun
    const sortedCounts = [...counts.slice(1), counts[0]];
    const sortedLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const data = {
        labels: sortedLabels,
        datasets: [{
            label: 'Total Appointments',
            data: sortedCounts,
            backgroundColor: '#2563eb',
            borderRadius: 8,
            barThickness: 20,
        }],
    };

    return <Bar options={chartOptions} data={data} />;
};
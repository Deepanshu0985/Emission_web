'use client';

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { emissionsData, getSectorColors, getTotalEmissionsByYear } from '@/data/emissions-data';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    activeSector: string;
}

export default function EmissionsLineChart({ activeSector }: LineChartProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sectorColors = getSectorColors();
    const years = emissionsData.years;

    let datasets;

    if (activeSector === 'All') {
        const totals = getTotalEmissionsByYear();
        datasets = [{
            label: 'Total Emissions',
            data: totals.map(t => t.total),
            borderColor: '#58A6FF',
            backgroundColor: 'rgba(88, 166, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#58A6FF',
            pointBorderColor: '#0D1117',
            pointBorderWidth: 2,
        }];
    } else {
        const sectorData = emissionsData.records.filter(r => r.sector === activeSector);
        const color = sectorColors[activeSector] || '#58A6FF';
        datasets = [{
            label: `${activeSector} Emissions`,
            data: years.map(year =>
                sectorData.find(r => r.year === year)?.emissions || 0
            ),
            borderColor: color,
            backgroundColor: color + '22',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: color,
            pointBorderColor: '#0D1117',
            pointBorderWidth: 2,
        }];
    }

    const data = {
        labels: years.map(y => y.toString()),
        datasets,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#C9D1D9',
                    padding: 20,
                    font: {
                        size: 12,
                    },
                    usePointStyle: true,
                },
            },
            title: {
                display: true,
                text: 'Emissions Trend Over Time',
                color: '#C9D1D9',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
                padding: { bottom: 20 },
            },
            tooltip: {
                backgroundColor: '#161B22',
                titleColor: '#C9D1D9',
                bodyColor: '#C9D1D9',
                borderColor: '#30363D',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#30363D44',
                },
                ticks: {
                    color: '#8B949E',
                },
            },
            y: {
                grid: {
                    color: '#30363D44',
                },
                ticks: {
                    color: '#8B949E',
                },
            },
        },
        animation: {
            duration: 750,
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    };

    if (!isClient) {
        return (
            <div className="glass-card p-6 h-[400px] animate-fade-in delay-100 flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 h-[400px] animate-fade-in delay-100">
            <Line data={data} options={options} />
        </div>
    );
}

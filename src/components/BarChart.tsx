'use client';

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { emissionsData, getSectorColors } from '@/data/emissions-data';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    activeSector: string;
}

export default function EmissionsBarChart({ activeSector }: BarChartProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sectorColors = getSectorColors();
    const years = emissionsData.years;

    // Filter sectors based on active selection
    const sectorsToShow = activeSector === 'All'
        ? emissionsData.sectors
        : [activeSector];

    const datasets = sectorsToShow.map(sector => {
        const sectorData = emissionsData.records.filter(r => r.sector === sector);
        return {
            label: sector,
            data: years.map(year =>
                sectorData.find(r => r.year === year)?.emissions || 0
            ),
            backgroundColor: sectorColors[sector] + '99',
            borderColor: sectorColors[sector],
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false as const,
        };
    });

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
                    pointStyle: 'rectRounded' as const,
                },
            },
            title: {
                display: true,
                text: 'Emissions by Sector (Million Metric Tons CO₂)',
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
                displayColors: true,
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
    };

    if (!isClient) {
        return (
            <div className="glass-card p-6 h-[400px] animate-fade-in flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 h-[400px] animate-fade-in">
            <Bar data={data} options={options} />
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { emissionsData, getSectorColors } from '@/data/emissions-data';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    activeSector: string;
}

export default function EmissionsPieChart({ activeSector }: PieChartProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sectorColors = getSectorColors();

    // Calculate total emissions by sector
    const sectorTotals = emissionsData.sectors.map(sector => ({
        sector,
        total: emissionsData.records
            .filter(r => r.sector === sector)
            .reduce((sum, r) => sum + r.emissions, 0)
    }));

    // If a specific sector is selected, highlight it
    const backgroundColors = emissionsData.sectors.map(sector => {
        if (activeSector === 'All') {
            return sectorColors[sector];
        }
        return sector === activeSector ? sectorColors[sector] : sectorColors[sector] + '33';
    });

    const data = {
        labels: emissionsData.sectors,
        datasets: [{
            data: sectorTotals.map(s => s.total),
            backgroundColor: backgroundColors,
            borderColor: '#0D1117',
            borderWidth: 3,
            hoverOffset: 10,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#C9D1D9',
                    padding: 15,
                    font: {
                        size: 11,
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: '#161B22',
                titleColor: '#C9D1D9',
                bodyColor: '#C9D1D9',
                borderColor: '#30363D',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context: { label?: string; parsed: number; dataset: { data: number[] } }) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed.toLocaleString()} MMT (${percentage}%)`;
                    }
                }
            },
        },
        cutout: '60%',
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
        },
    };

    if (!isClient) {
        return (
            <div className="glass-card p-6 h-[300px] animate-fade-in flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 animate-fade-in delay-200">
            <h3 className="text-sm font-semibold text-white mb-4 text-center">
                Sector Distribution (Total Emissions)
            </h3>
            <div className="h-[250px]">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
}

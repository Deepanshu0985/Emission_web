'use client';

import { TrendingUp, TrendingDown, BarChart2, Globe, Zap } from 'lucide-react';
import { getStats } from '@/data/emissions-data';

interface StatsCardsProps {
    activeSector: string;
}

export default function StatsCards({ activeSector }: StatsCardsProps) {
    const stats = getStats(activeSector);
    const trendUp = parseFloat(stats.trend) > 0;

    const cards = [
        {
            title: 'Total Emissions',
            value: `${(stats.totalEmissions / 1000).toFixed(1)}K`,
            unit: 'MMT CO₂',
            icon: Globe,
            color: '#58A6FF',
        },
        {
            title: 'Average',
            value: stats.avgEmissions,
            unit: 'MMT/record',
            icon: BarChart2,
            color: '#A371F7',
        },
        {
            title: 'Peak Emission',
            value: stats.maxEmission.emissions.toLocaleString(),
            unit: `${stats.maxEmission.sector} (${stats.maxEmission.year})`,
            icon: Zap,
            color: '#F97316',
        },
        {
            title: 'Trend',
            value: `${trendUp ? '+' : ''}${stats.trend}%`,
            unit: stats.yearRange,
            icon: trendUp ? TrendingUp : TrendingDown,
            color: trendUp ? '#EF4444' : '#22C55E',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 animate-fade-in delay-200">
            {cards.map((card, idx) => (
                <div
                    key={card.title}
                    className="glass-card p-4 hover:scale-[1.02] transition-transform duration-300"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-sm text-gray-400">{card.title}</span>
                        <card.icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: card.color }}>
                        {card.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{card.unit}</div>
                </div>
            ))}
        </div>
    );
}

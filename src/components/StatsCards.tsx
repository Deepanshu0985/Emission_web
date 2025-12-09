'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Globe, Zap, Activity } from 'lucide-react';
import { getStats } from '@/data/emissions-data';

interface StatsCardsProps {
    activeSector: string;
}

// Animated counter hook
function useCountUp(end: number, duration: number = 1500) {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        countRef.current = 0;
        startTimeRef.current = null;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return count;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
    const animatedValue = useCountUp(value);
    return <>{animatedValue.toLocaleString()}{suffix}</>;
}

export default function StatsCards({ activeSector }: StatsCardsProps) {
    const stats = getStats(activeSector);
    const trendUp = parseFloat(stats.trend) > 0;
    const totalInK = Math.round(stats.totalEmissions / 1000);
    const avgEmissions = parseInt(stats.avgEmissions);
    const trendValue = Math.abs(parseFloat(stats.trend));

    const cards = [
        {
            title: 'Total Emissions',
            value: totalInK,
            displayValue: <><AnimatedNumber value={totalInK} />K</>,
            unit: 'MMT CO₂',
            icon: Globe,
            color: '#58A6FF',
            gradient: 'from-blue-500/20 to-cyan-500/20',
        },
        {
            title: 'Average',
            value: avgEmissions,
            displayValue: <AnimatedNumber value={avgEmissions} />,
            unit: 'MMT/record',
            icon: BarChart2,
            color: '#A371F7',
            gradient: 'from-purple-500/20 to-pink-500/20',
        },
        {
            title: 'Peak Emission',
            value: stats.maxEmission.emissions,
            displayValue: <AnimatedNumber value={stats.maxEmission.emissions} />,
            unit: `${stats.maxEmission.sector} (${stats.maxEmission.year})`,
            icon: Zap,
            color: '#F97316',
            gradient: 'from-orange-500/20 to-red-500/20',
        },
        {
            title: 'Trend',
            value: trendValue,
            displayValue: <>{trendUp ? '+' : '-'}<AnimatedNumber value={Math.round(trendValue * 10) / 10} />%</>,
            unit: stats.yearRange,
            icon: trendUp ? TrendingUp : TrendingDown,
            color: trendUp ? '#EF4444' : '#22C55E',
            gradient: trendUp ? 'from-red-500/20 to-orange-500/20' : 'from-green-500/20 to-emerald-500/20',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {cards.map((card, idx) => (
                <div
                    key={card.title}
                    className={`glass-card p-4 hover:scale-[1.02] transition-all duration-300 animate-fade-in bg-gradient-to-br ${card.gradient} group cursor-default`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-400 font-medium">{card.title}</span>
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: card.color + '22' }}
                        >
                            <card.icon className="w-4 h-4" style={{ color: card.color }} />
                        </div>
                    </div>
                    <div
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: card.color }}
                    >
                        {card.displayValue}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">{card.unit}</div>
                </div>
            ))}
        </div>
    );
}

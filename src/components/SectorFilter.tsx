'use client';

interface SectorFilterProps {
    sectors: string[];
    activeSector: string;
    onSectorChange: (sector: string) => void;
}

export default function SectorFilter({ sectors, activeSector, onSectorChange }: SectorFilterProps) {
    const allSectors = ['All', ...sectors];

    return (
        <div className="flex flex-wrap gap-2">
            {allSectors.map((sector) => (
                <button
                    key={sector}
                    onClick={() => onSectorChange(sector)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${activeSector === sector
                            ? 'filter-active shadow-lg transform scale-105'
                            : 'bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                        }`}
                >
                    {sector}
                </button>
            ))}
        </div>
    );
}

export interface EmissionRecord {
    year: number;
    sector: string;
    emissions: number; // in million metric tons CO2 equivalent
}

export interface EmissionsData {
    records: EmissionRecord[];
    sectors: string[];
    years: number[];
}

// Sample emissions dataset
export const emissionsData: EmissionsData = {
    sectors: ['Energy', 'Industry', 'Transport', 'Agriculture', 'Buildings'],
    years: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2023],
    records: [
        // Energy sector
        { year: 2010, sector: 'Energy', emissions: 13200 },
        { year: 2012, sector: 'Energy', emissions: 13800 },
        { year: 2014, sector: 'Energy', emissions: 14100 },
        { year: 2016, sector: 'Energy', emissions: 14300 },
        { year: 2018, sector: 'Energy', emissions: 14800 },
        { year: 2020, sector: 'Energy', emissions: 13500 },
        { year: 2022, sector: 'Energy', emissions: 14200 },
        { year: 2023, sector: 'Energy', emissions: 14000 },

        // Industry sector
        { year: 2010, sector: 'Industry', emissions: 5800 },
        { year: 2012, sector: 'Industry', emissions: 6100 },
        { year: 2014, sector: 'Industry', emissions: 6400 },
        { year: 2016, sector: 'Industry', emissions: 6600 },
        { year: 2018, sector: 'Industry', emissions: 6900 },
        { year: 2020, sector: 'Industry', emissions: 6200 },
        { year: 2022, sector: 'Industry', emissions: 6800 },
        { year: 2023, sector: 'Industry', emissions: 6700 },

        // Transport sector
        { year: 2010, sector: 'Transport', emissions: 6200 },
        { year: 2012, sector: 'Transport', emissions: 6500 },
        { year: 2014, sector: 'Transport', emissions: 6800 },
        { year: 2016, sector: 'Transport', emissions: 7100 },
        { year: 2018, sector: 'Transport', emissions: 7500 },
        { year: 2020, sector: 'Transport', emissions: 6000 },
        { year: 2022, sector: 'Transport', emissions: 7200 },
        { year: 2023, sector: 'Transport', emissions: 7400 },

        // Agriculture sector
        { year: 2010, sector: 'Agriculture', emissions: 5200 },
        { year: 2012, sector: 'Agriculture', emissions: 5300 },
        { year: 2014, sector: 'Agriculture', emissions: 5400 },
        { year: 2016, sector: 'Agriculture', emissions: 5500 },
        { year: 2018, sector: 'Agriculture', emissions: 5600 },
        { year: 2020, sector: 'Agriculture', emissions: 5500 },
        { year: 2022, sector: 'Agriculture', emissions: 5700 },
        { year: 2023, sector: 'Agriculture', emissions: 5800 },

        // Buildings sector
        { year: 2010, sector: 'Buildings', emissions: 2800 },
        { year: 2012, sector: 'Buildings', emissions: 2900 },
        { year: 2014, sector: 'Buildings', emissions: 3000 },
        { year: 2016, sector: 'Buildings', emissions: 3100 },
        { year: 2018, sector: 'Buildings', emissions: 3200 },
        { year: 2020, sector: 'Buildings', emissions: 3000 },
        { year: 2022, sector: 'Buildings', emissions: 3150 },
        { year: 2023, sector: 'Buildings', emissions: 3100 },
    ]
};

// Helper functions
export function getEmissionsBySector(sector: string): EmissionRecord[] {
    if (sector === 'All') {
        return emissionsData.records;
    }
    return emissionsData.records.filter(r => r.sector === sector);
}

export function getEmissionsByYear(year: number): EmissionRecord[] {
    return emissionsData.records.filter(r => r.year === year);
}

export function getTotalEmissionsByYear(): { year: number; total: number }[] {
    return emissionsData.years.map(year => ({
        year,
        total: emissionsData.records
            .filter(r => r.year === year)
            .reduce((sum, r) => sum + r.emissions, 0)
    }));
}

export function getSectorColors(): Record<string, string> {
    return {
        'Energy': '#F97316',      // Orange
        'Industry': '#8B5CF6',    // Purple
        'Transport': '#06B6D4',   // Cyan
        'Agriculture': '#22C55E', // Green
        'Buildings': '#EC4899',   // Pink
    };
}

export function getStats(sector: string = 'All') {
    const records = getEmissionsBySector(sector);
    const totalEmissions = records.reduce((sum, r) => sum + r.emissions, 0);
    const avgEmissions = totalEmissions / records.length;

    const maxRecord = records.reduce((max, r) => r.emissions > max.emissions ? r : max, records[0]);
    const minRecord = records.reduce((min, r) => r.emissions < min.emissions ? r : min, records[0]);

    // Calculate trend (comparing most recent to oldest)
    const latestYear = Math.max(...emissionsData.years);
    const oldestYear = Math.min(...emissionsData.years);

    const latestTotal = records.filter(r => r.year === latestYear).reduce((s, r) => s + r.emissions, 0);
    const oldestTotal = records.filter(r => r.year === oldestYear).reduce((s, r) => s + r.emissions, 0);
    const trendPercent = ((latestTotal - oldestTotal) / oldestTotal * 100).toFixed(1);

    return {
        totalEmissions,
        avgEmissions: avgEmissions.toFixed(0),
        maxEmission: maxRecord,
        minEmission: minRecord,
        trend: trendPercent,
        recordCount: records.length,
        sectors: sector === 'All' ? emissionsData.sectors : [sector],
        yearRange: `${oldestYear}-${latestYear}`
    };
}

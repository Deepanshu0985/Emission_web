import { NextRequest, NextResponse } from 'next/server';
import { emissionsData, getStats, getTotalEmissionsByYear, getSectorColors } from '@/data/emissions-data';

// Query classification
function classifyQuery(query: string): 'data' | 'web' | 'hybrid' {
    const dataKeywords = [
        'emission', 'sector', 'year', 'trend', 'highest', 'lowest', 'total',
        'average', 'compare', 'data', 'statistics', 'stats', 'chart', 'graph',
        'energy', 'transport', 'industry', 'agriculture', 'buildings',
        '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2023'
    ];

    const webKeywords = [
        'what is', 'what are', 'why', 'how', 'explain', 'cause', 'effect',
        'definition', 'meaning', 'history', 'future', 'predict', 'solution',
        'reduce', 'prevent', 'impact', 'global warming', 'climate change',
        'carbon', 'greenhouse', 'pollution'
    ];

    const queryLower = query.toLowerCase();
    const hasDataKeywords = dataKeywords.some(k => queryLower.includes(k));
    const hasWebKeywords = webKeywords.some(k => queryLower.includes(k));

    if (hasDataKeywords && hasWebKeywords) return 'hybrid';
    if (hasDataKeywords) return 'data';
    return 'web';
}

// Analyze data for query
function analyzeData(query: string, activeSector: string): string {
    const queryLower = query.toLowerCase();
    const stats = getStats(activeSector);
    const totals = getTotalEmissionsByYear();

    // Highest emissions query
    if (queryLower.includes('highest') || queryLower.includes('most') || queryLower.includes('maximum')) {
        if (activeSector === 'All') {
            // Find sector with highest total emissions
            const sectorTotals = emissionsData.sectors.map(sector => ({
                sector,
                total: emissionsData.records
                    .filter(r => r.sector === sector)
                    .reduce((sum, r) => sum + r.emissions, 0)
            }));
            const highest = sectorTotals.reduce((max, s) => s.total > max.total ? s : max);
            return `Based on the data, **${highest.sector}** has the highest total emissions at **${highest.total.toLocaleString()} MMT CO₂** across all years (${stats.yearRange}).

The sector breakdown shows:
${sectorTotals.sort((a, b) => b.total - a.total).map((s, i) => `${i + 1}. ${s.sector}: ${s.total.toLocaleString()} MMT`).join('\n')}`;
        } else {
            return `For the **${activeSector}** sector, the highest emissions were **${stats.maxEmission.emissions.toLocaleString()} MMT CO₂** in **${stats.maxEmission.year}**.`;
        }
    }

    // Lowest emissions query
    if (queryLower.includes('lowest') || queryLower.includes('least') || queryLower.includes('minimum')) {
        return `The lowest emissions recorded for ${activeSector === 'All' ? 'the dataset' : activeSector} was **${stats.minEmission.emissions.toLocaleString()} MMT CO₂** (${stats.minEmission.sector}, ${stats.minEmission.year}).`;
    }

    // Trend query
    if (queryLower.includes('trend') || queryLower.includes('over time') || queryLower.includes('change')) {
        const trend = parseFloat(stats.trend);
        const direction = trend > 0 ? 'increased' : 'decreased';
        return `Emissions have **${direction} by ${Math.abs(trend)}%** from ${stats.yearRange}.

${activeSector === 'All' ? 'Total emissions by year:' : `${activeSector} emissions by year:`}
${totals.map(t => `• ${t.year}: ${t.total.toLocaleString()} MMT`).join('\n')}

Notable: There was a significant dip in 2020, likely due to pandemic-related reductions.`;
    }

    // Total emissions query
    if (queryLower.includes('total') || queryLower.includes('sum')) {
        return `The total emissions ${activeSector === 'All' ? 'across all sectors' : `for ${activeSector}`} is **${stats.totalEmissions.toLocaleString()} MMT CO₂** over ${stats.yearRange}.

Average per data point: **${stats.avgEmissions} MMT CO₂**`;
    }

    // Comparison query
    if (queryLower.includes('compare') || queryLower.includes('vs') || queryLower.includes('versus')) {
        const years = queryLower.match(/\d{4}/g);
        if (years && years.length >= 2) {
            const year1 = parseInt(years[0]);
            const year2 = parseInt(years[1]);
            const data1 = emissionsData.records.filter(r => r.year === year1);
            const data2 = emissionsData.records.filter(r => r.year === year2);
            const total1 = data1.reduce((s, r) => s + r.emissions, 0);
            const total2 = data2.reduce((s, r) => s + r.emissions, 0);
            const change = ((total2 - total1) / total1 * 100).toFixed(1);

            return `**Comparison: ${year1} vs ${year2}**

${year1} Total: ${total1.toLocaleString()} MMT CO₂
${year2} Total: ${total2.toLocaleString()} MMT CO₂
Change: ${parseFloat(change) > 0 ? '+' : ''}${change}%`;
        }
    }

    // Default stats response
    return `Here's a summary of ${activeSector === 'All' ? 'all emissions data' : `${activeSector} sector emissions`}:

📊 **Key Statistics:**
• Total Emissions: ${stats.totalEmissions.toLocaleString()} MMT CO₂
• Average: ${stats.avgEmissions} MMT per record
• Peak: ${stats.maxEmission.emissions.toLocaleString()} MMT (${stats.maxEmission.sector}, ${stats.maxEmission.year})
• Trend: ${parseFloat(stats.trend) > 0 ? '+' : ''}${stats.trend}% (${stats.yearRange})

Feel free to ask specific questions about the data!`;
}

// Fetch from Wikipedia
async function searchWikipedia(query: string): Promise<string> {
    try {
        // Extract key topic from query
        const topic = query
            .replace(/what is|what are|why|how|explain|tell me about/gi, '')
            .trim()
            .split(' ')
            .slice(0, 3)
            .join(' ');

        const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

        const response = await fetch(searchUrl, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            // Try a broader search
            const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=1&format=json`;
            const searchResponse = await fetch(searchApiUrl);
            const searchData = await searchResponse.json();

            if (searchData[1] && searchData[1].length > 0) {
                const title = searchData[1][0];
                const summaryResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
                const summaryData = await summaryResponse.json();
                return summaryData.extract || 'No information found.';
            }
            return 'I couldn\'t find specific information on that topic.';
        }

        const data = await response.json();
        return data.extract || 'No summary available.';
    } catch (error) {
        return 'I couldn\'t fetch external information at the moment. Please try again later.';
    }
}

export async function POST(request: NextRequest) {
    try {
        const { message, activeSector } = await request.json();

        if (!message) {
            return NextResponse.json({ response: 'Please provide a message.' }, { status: 400 });
        }

        const queryType = classifyQuery(message);
        let response = '';

        if (queryType === 'data') {
            response = analyzeData(message, activeSector || 'All');
        } else if (queryType === 'web') {
            const webInfo = await searchWikipedia(message);
            response = `🌐 **External Knowledge:**\n\n${webInfo}`;
        } else {
            // Hybrid: combine both
            const dataResponse = analyzeData(message, activeSector || 'All');
            const webInfo = await searchWikipedia(message);
            response = `${dataResponse}\n\n---\n\n🌐 **Additional Context from Web:**\n${webInfo}`;
        }

        return NextResponse.json({ response });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { response: 'Sorry, something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

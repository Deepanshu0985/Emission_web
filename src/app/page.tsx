'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SectorFilter from '@/components/SectorFilter';
import EmissionsBarChart from '@/components/BarChart';
import EmissionsLineChart from '@/components/LineChart';
import EmissionsPieChart from '@/components/PieChart';
import StatsCards from '@/components/StatsCards';
import ChatPanel from '@/components/ChatPanel';
import { emissionsData, getEmissionsBySector } from '@/data/emissions-data';

export default function Home() {
  const [activeSector, setActiveSector] = useState('All');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Download CSV function
  const handleDownloadCSV = () => {
    const records = getEmissionsBySector(activeSector);
    const headers = ['Year', 'Sector', 'Emissions (MMT CO₂)'];
    const csvContent = [
      headers.join(','),
      ...records.map(r => `${r.year},${r.sector},${r.emissions}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emissions_${activeSector.toLowerCase()}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      <main className={`transition-all duration-300 ${isChatOpen ? 'mr-[400px]' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="gradient-text">Emissions Analytics</span>
                </h1>
                <p className="text-gray-400">
                  Explore greenhouse gas emissions data across sectors and time periods
                </p>
              </div>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 animate-fade-in delay-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Filter by Sector</label>
                <SectorFilter
                  sectors={emissionsData.sectors}
                  activeSector={activeSector}
                  onSectorChange={setActiveSector}
                />
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 dashboard-grid">
            {/* Main Charts Section - 70% */}
            <div className="lg:col-span-2 space-y-6">
              <EmissionsBarChart activeSector={activeSector} />
              <EmissionsLineChart activeSector={activeSector} />
            </div>

            {/* Stats Panel - 30% */}
            <div className="space-y-6">
              <StatsCards activeSector={activeSector} />

              {/* Pie Chart */}
              <EmissionsPieChart activeSector={activeSector} />

              {/* Quick Actions */}
              <div className="glass-card p-6 animate-fade-in delay-400">
                <h3 className="font-semibold text-white mb-3">� Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="w-full btn-secondary text-left text-sm flex items-center gap-2 group"
                  >
                    <span className="text-lg">🤖</span>
                    <span className="group-hover:translate-x-1 transition-transform">Ask AI about trends →</span>
                  </button>
                  <button
                    onClick={() => setActiveSector('Energy')}
                    className="w-full btn-secondary text-left text-sm flex items-center gap-2 group"
                  >
                    <span className="text-lg">⚡</span>
                    <span className="group-hover:translate-x-1 transition-transform">View Energy Sector →</span>
                  </button>
                  <button
                    onClick={() => setActiveSector('All')}
                    className="w-full btn-secondary text-left text-sm flex items-center gap-2 group"
                  >
                    <span className="text-lg">📊</span>
                    <span className="group-hover:translate-x-1 transition-transform">Compare All Sectors →</span>
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="w-full btn-secondary text-left text-sm flex items-center gap-2 group"
                  >
                    <span className="text-lg">📥</span>
                    <span className="group-hover:translate-x-1 transition-transform">Download Data →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-[var(--border)] text-center text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              <span>🌍</span>
              <span>Stride Labs — HackForward 2025 Submission</span>
            </p>
            <p className="mt-1">Built with Next.js, Chart.js & AI-powered insights</p>
          </footer>
        </div>
      </main>

      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} activeSector={activeSector} />
    </div>
  );
}

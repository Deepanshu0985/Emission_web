'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SectorFilter from '@/components/SectorFilter';
import EmissionsBarChart from '@/components/BarChart';
import EmissionsLineChart from '@/components/LineChart';
import StatsCards from '@/components/StatsCards';
import ChatPanel from '@/components/ChatPanel';
import { emissionsData } from '@/data/emissions-data';

export default function Home() {
  const [activeSector, setActiveSector] = useState('All');
  const [isChatOpen, setIsChatOpen] = useState(false);

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
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Emissions Analytics</span>
            </h1>
            <p className="text-gray-400">
              Explore greenhouse gas emissions data across sectors and time periods
            </p>
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

              {/* Info Card */}
              <div className="glass-card p-6 animate-fade-in delay-300">
                <h3 className="font-semibold text-white mb-3">💡 Insights</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Energy sector remains the largest emitter</li>
                  <li>• 2020 saw significant reductions across all sectors</li>
                  <li>• Transport emissions growing fastest post-2020</li>
                  <li>• Use the AI assistant for deeper analysis</li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6 animate-fade-in delay-400">
                <h3 className="font-semibold text-white mb-3">🚀 Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="w-full btn-secondary text-left text-sm"
                  >
                    Ask AI about trends →
                  </button>
                  <button
                    onClick={() => setActiveSector('Energy')}
                    className="w-full btn-secondary text-left text-sm"
                  >
                    View Energy Sector →
                  </button>
                  <button
                    onClick={() => setActiveSector('All')}
                    className="w-full btn-secondary text-left text-sm"
                  >
                    Compare All Sectors →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-[var(--border)] text-center text-sm text-gray-500">
            <p>Stride Labs — HackForward 2025 Submission</p>
            <p className="mt-1">Built with Next.js, Chart.js & AI-powered insights</p>
          </footer>
        </div>
      </main>

      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} activeSector={activeSector} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { MessageCircle, BarChart3, X } from 'lucide-react';

interface NavbarProps {
    onChatToggle: () => void;
    isChatOpen: boolean;
}

export default function Navbar({ onChatToggle, isChatOpen }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-50 glass-card border-b border-[var(--border)] px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58A6FF] to-[#A371F7] flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold gradient-text">Emissions Insights</h1>
                        <p className="text-xs text-gray-500">AI-Powered Dashboard</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onChatToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isChatOpen
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)]'
                            }`}
                    >
                        {isChatOpen ? (
                            <>
                                <X className="w-5 h-5" />
                                <span className="hidden sm:inline">Close Chat</span>
                            </>
                        ) : (
                            <>
                                <MessageCircle className="w-5 h-5" />
                                <span className="hidden sm:inline">AI Assistant</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}

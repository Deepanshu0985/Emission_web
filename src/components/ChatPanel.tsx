'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatPanelProps {
    isOpen: boolean;
    activeSector: string;
}

// Suggested prompts for users
const suggestedPrompts = [
    { text: "Which sector has highest emissions?", icon: "📊" },
    { text: "Show me the trend over time", icon: "📈" },
    { text: "Compare 2010 vs 2023", icon: "🔄" },
    { text: "What causes greenhouse gas?", icon: "🌍" },
];

export default function ChatPanel({ isOpen, activeSector }: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `👋 Hello! I'm your AI assistant for emissions data analysis.\n\nI can help you:\n• Analyze dashboard data & statistics\n• Explain emissions concepts\n• Compare sectors and years\n\nTry the suggested prompts below or ask anything!`,
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPrompts, setShowPrompts] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        await sendMessage(input.trim());
    };

    const sendMessage = async (message: string) => {
        setInput('');
        setShowPrompts(false);
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    activeSector
                }),
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '❌ Sorry, I encountered an error. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromptClick = (prompt: string) => {
        sendMessage(prompt);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-screen w-full max-w-md glass-card border-l border-[var(--border)] animate-slide-in-left z-40 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center gap-3 bg-gradient-to-r from-[#58A6FF11] to-[#A371F711]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58A6FF] to-[#A371F7] flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h2 className="font-semibold text-white">AI Assistant</h2>
                    <p className="text-xs text-gray-400">
                        Analyzing: {activeSector === 'All' ? 'All Sectors' : activeSector}
                    </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
                    >
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-[#1F6FEB] to-[#58A6FF]'
                                    : 'bg-[var(--panel)] border border-[var(--border)]'
                                }`}
                        >
                            {message.role === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <Bot className="w-4 h-4 text-[var(--accent)]" />
                            )}
                        </div>
                        <div
                            className={`max-w-[80%] p-3 ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                    </div>
                ))}

                {/* Suggested Prompts */}
                {showPrompts && messages.length === 1 && (
                    <div className="space-y-2 animate-fade-in">
                        <p className="text-xs text-gray-500 font-medium px-1">💡 Try asking:</p>
                        <div className="grid gap-2">
                            {suggestedPrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePromptClick(prompt.text)}
                                    className="flex items-center gap-2 p-3 rounded-xl bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--border)] transition-all text-left text-sm group"
                                >
                                    <span className="text-lg">{prompt.icon}</span>
                                    <span className="text-gray-300 group-hover:text-white transition-colors">
                                        {prompt.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-lg bg-[var(--panel)] border border-[var(--border)] flex items-center justify-center">
                            <Bot className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        <div className="chat-bubble-assistant p-3 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                            <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border)] bg-[var(--panel)]">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about emissions data..."
                        className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-gray-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#1F6FEB] to-[#58A6FF] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#58A6FF33] transition-all hover:scale-105 active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}

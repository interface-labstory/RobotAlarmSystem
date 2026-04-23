'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NavbarProps {
  currentPage?: 'dashboard' | 'logs';
}

// ── ตั้งวันส่งมอบหุ่นที่นี่ ──────────────────────────────────────────────
const DELIVERY_DATE = new Date('2026-07-31T00:00:00');
// ────────────────────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, passed: true };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return { days, hours, minutes, passed: false };
  };
  const [countdown, setCountdown] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setCountdown(calc()), 60000);
    return () => clearInterval(t);
  }, []);
  return countdown;
}

export default function Navbar({ currentPage = 'dashboard' }: NavbarProps) {
  const [searchAlarmId, setSearchAlarmId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { days, hours, passed } = useCountdown(DELIVERY_DATE);

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchAlarmId.trim()) {
      window.location.href = `/logs/${searchAlarmId.trim()}`;
    }
  };

  const urgency = days <= 7 ? 'urgent' : days <= 30 ? 'soon' : 'normal';
  const deliveryLabel = DELIVERY_DATE.toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <nav className="sticky top-0 z-50 bg-[#08080f] border-b border-[#1a1a28]">
      {/* Delivery Date Banner */}
      <div className={`w-full px-4 py-2 flex items-center justify-center gap-3 text-xs font-semibold border-b ${
        passed
          ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
          : urgency === 'urgent'
          ? 'bg-red-500/10 border-red-500/20 text-red-300'
          : urgency === 'soon'
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          : 'bg-cyan-500/8 border-cyan-500/15 text-cyan-300'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          passed ? 'bg-zinc-500'
          : urgency === 'urgent' ? 'bg-red-400 animate-ping'
          : urgency === 'soon' ? 'bg-amber-400 animate-pulse'
          : 'bg-cyan-400'
        }`} />
        <span className="text-zinc-500 tracking-widest uppercase text-[10px]">ส่งมอบหุ่นวันที่</span>
        <span className={`font-bold text-sm ${
          passed ? 'text-zinc-300'
          : urgency === 'urgent' ? 'text-red-200'
          : urgency === 'soon' ? 'text-amber-200'
          : 'text-white'
        }`}>
          {deliveryLabel}
        </span>
        {/* {!passed && (
          <>
            <span className="text-zinc-600">·</span>
            <div className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono font-bold text-sm ${
                urgency === 'urgent' ? 'bg-red-500/20 text-red-300'
                : urgency === 'soon' ? 'bg-amber-500/20 text-amber-200'
                : 'bg-cyan-500/15 text-cyan-200'
              }`}>
                <span>{days}</span>
                <span className="text-[10px] font-normal opacity-70">วัน</span>
              </div>
              <div className="px-2 py-0.5 rounded-md font-mono text-xs bg-white/5 text-zinc-400">
                {String(hours).padStart(2, '0')} ชม.
              </div>
            </div>
            {urgency === 'urgent' && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                ด่วน
              </span>
            )}
            {urgency === 'soon' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                ใกล้ถึง
              </span>
            )}
          </>
        )} */}
        {passed && <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px]">ส่งมอบแล้ว</span>}
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-sm">
                🤖
              </div>
              <span className="font-bold text-base text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                AMR <span className="text-cyan-500">ALARM</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/logs"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 'logs'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Logs
              </Link>
            </div>
          </div>

          {/* Search + Mobile toggle */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Alarm ID..."
                  value={searchAlarmId}
                  onChange={(e) => setSearchAlarmId(e.target.value)}
                  className="w-40 pl-8 pr-3 py-1.5 bg-[#16161f] border border-[#2a2a3a] rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-all"
              >
                Search
              </button>
            </form>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-[#1e1e2e] pt-3">
            <form onSubmit={handleSearch} className="mb-3 flex gap-2">
              <input
                type="text"
                placeholder="Alarm ID..."
                value={searchAlarmId}
                onChange={(e) => setSearchAlarmId(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#16161f] border border-[#2a2a3a] rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button type="submit" className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium">
                Search
              </button>
            </form>
            <Link href="/" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition">
              Dashboard
            </Link>
            <Link href="/logs" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition">
              Logs
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

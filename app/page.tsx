'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './components/Navbar';
import AlarmTimeChart from './components/AlarmTimeChart';
import AlarmMonthlyChart from './components/AlarmMonthlyChart';
import { allAlarms, topAlarms, categoryColors } from './data/alarms';
import { maintenanceAlarms} from './data/alarms';


function LedBadge({ color }: { color: string }) {
  if (color === 'RED')
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />RED</span>;
  if (color === 'YELLOW')
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />YELLOW</span>;
  return <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">{color}</span>;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 py-5 border-b border-[#1e1e2e]">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-zinc-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
  );
}

const rankColors = ['text-amber-400', 'text-zinc-300', 'text-amber-600', 'text-zinc-300', 'text-zinc-300'];

function LastUpdated() {
  const [timestamp, setTimestamp] = useState('');
  useEffect(() => { setTimestamp(new Date().toLocaleString()); }, []);
  return <>{timestamp}</>;
}

export default function Dashboard() {
  const router = useRouter();
  const [alarmSearch, setAlarmSearch] = useState('');

  const filteredAllAlarms = allAlarms.filter(
    (a) =>
      a.id.toString().includes(alarmSearch) ||
      a.category.toLowerCase().includes(alarmSearch.toLowerCase()) ||
      a.alarmNameEN.toLowerCase().includes(alarmSearch.toLowerCase()) ||
      a.alarmNameTH.includes(alarmSearch)
  );

  const totalAlarms = allAlarms.reduce((s, a) => s + a.occurrenceCount, 0);
  const criticalCount = allAlarms.filter((a) => a.ledColor === 'RED').reduce((s, a) => s + a.occurrenceCount, 0);
  const warningCount = allAlarms.filter((a) => a.ledColor === 'YELLOW').reduce((s, a) => s + a.occurrenceCount, 0);

  return (
    <>
      <Navbar currentPage="dashboard" />
      <div className="min-h-screen bg-[#07070d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">Robot Alarm System</p>
            <h1 className="text-3xl font-bold text-white mb-1">Status Dashboard</h1>
            <p className="text-zinc-500 text-sm">Monitor alarm frequency, patterns, and maintenance requirements</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl p-5">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Total Alarms</p>
              <p className="text-4xl font-bold text-white">{totalAlarms.toLocaleString()}</p>
              <p className="text-zinc-600 text-sm mt-1">34 alarm types</p>
            </div>
            <div className="bg-[#0d0d14] border border-red-500/10 rounded-2xl p-5">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Critical (RED)</p>
              <p className="text-4xl font-bold text-red-400">{criticalCount.toLocaleString()}</p>
              <p className="text-zinc-600 text-sm mt-1">Motor stopped</p>
            </div>
            <div className="bg-[#0d0d14] border border-amber-500/10 rounded-2xl p-5">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Warning (YELLOW)</p>
              <p className="text-4xl font-bold text-amber-400">{warningCount.toLocaleString()}</p>
              <p className="text-zinc-600 text-sm mt-1">Still running</p>
            </div>
          </div>

          {/* Time Chart */}
          <AlarmTimeChart />

          {/* Monthly Chart */}
          <AlarmMonthlyChart />

          {/* Top 10 */}
          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6">
            <SectionHeader title="Top 10 Most Frequent Alarms" subtitle="จัดอันดับจากจำนวนครั้งที่เกิดสูงสุด" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1e2e]">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-14">#</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-12">ID</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Alarm Name</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">ชื่อ TH</th>
                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Count</th>
                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">LED</th>
                  </tr>
                </thead>
                <tbody>
                  {topAlarms.map((alarm, index) => (
                    <tr key={alarm.id} className="border-b border-[#1a1a24] hover:bg-[#16161f] transition-colors">
                      <td className="px-5 py-4">
                        <span className={`text-base font-black ${rankColors[index] ?? 'text-zinc-600'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-zinc-300 text-sm">{alarm.id}</td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`font-medium ${categoryColors[alarm.category] ?? 'text-zinc-300'}`}>
                          {alarm.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-white">{alarm.alarmNameEN}</td>
                      <td className="px-5 py-4 text-sm text-zinc-300">{alarm.alarmNameTH}</td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-lg font-bold text-white">{alarm.occurrenceCount}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <LedBadge color={alarm.ledColor} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alarm Reference */}
          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-white">Alarm Reference</h2>
                <p className="text-zinc-500 text-sm mt-0.5">ข้อมูล Alarm ทั้งหมด {allAlarms.length} รายการ</p>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="ค้นหา ID / Category / Name..."
                  value={alarmSearch}
                  onChange={(e) => setAlarmSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#16161f] border border-[#2a2a3a] rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 w-64 transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1e2e]">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-14">ID</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Alarm Name (EN)</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">ชื่อ (TH)</th>
                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-20">LED</th>
                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-24">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllAlarms.map((alarm, i) => (
                    <tr key={alarm.id} className={`border-b border-[#1a1a24] hover:bg-[#16161f] transition-colors ${i % 2 !== 0 ? 'bg-[#0a0a10]' : ''}`}>
                      <td className="px-5 py-3.5 font-mono font-bold text-zinc-300 text-sm">{alarm.id}</td>
                      <td className="px-5 py-3.5 text-sm">
                        <span className={`font-medium ${categoryColors[alarm.category] ?? 'text-zinc-300'}`}>
                          {alarm.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-white">{alarm.alarmNameEN}</td>
                      <td className="px-5 py-3.5 text-sm text-zinc-300">{alarm.alarmNameTH}</td>
                      <td className="px-5 py-3.5 text-center"><LedBadge color={alarm.ledColor} /></td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => router.push(`/logs?alarmId=${alarm.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAllAlarms.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-zinc-600">ไม่พบข้อมูล</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
                    {/* Row 2: ID 34 full-width */}
          {(() => {
            const alarm = maintenanceAlarms.find((a) => a.id === 34)!;
            const accentColor = { border: 'border-violet-500/25', bg: 'bg-violet-500/5', dot: 'bg-violet-400', text: 'text-violet-300', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20' };
            return (
              <div className={`rounded-2xl border overflow-hidden ${accentColor.border} ${accentColor.bg}`}>
                {/* Card Header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${accentColor.badge}`}>
                      ID {alarm.id}
                    </span>
                    <LedBadge color={alarm.ledColor} />
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug mb-0.5">{alarm.alarmNameEN}</h3>
                  <p className="text-base text-zinc-200">{alarm.alarmNameTH}</p>
                </div>

                <div className={`h-px mx-5 ${accentColor.border}`} />

                <div className="px-5 py-3 flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-zinc-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm text-zinc-200 leading-relaxed">{alarm.triggerCondition}</p>
                </div>

                <div className="border-t border-[#1e1e2e] px-5 pb-5 pt-4 space-y-4">
                  {/* <div className="flex gap-3">
                    <div className={`w-0.5 rounded-full flex-shrink-0 ${accentColor.dot}`} />
                    <p className="text-base text-white leading-relaxed">{alarm.description}</p>
                  </div> */}
                  {/* <div>
                    <p className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-3">วิธีแก้ปัญหา</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {alarm.solutions.map((s, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${accentColor.badge} border`}>
                            {i + 1}
                          </span>
                          <p className="text-base text-white leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {/* Top 10 Repeated Alarms Table */}
                  <div>
                    <p className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-3">Top 10 Alarms ที่เกิดซ้ำบ่อย</p>
                    <div className="border border-[#1e1e2e] rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#1e1e2e] bg-[#16161f]">
                              <th className="px-3 py-2.5 text-left text-xs font-bold text-zinc-200 uppercase tracking-wider w-10">#</th>
                              <th className="px-3 py-2.5 text-left text-xs font-bold text-zinc-200 uppercase tracking-wider w-12">ID</th>
                              <th className="px-3 py-2.5 text-left text-xs font-bold text-zinc-200 uppercase tracking-wider">Category</th>
                              <th className="px-3 py-2.5 text-left text-xs font-bold text-zinc-200 uppercase tracking-wider">Alarm Name (EN)</th>
                              <th className="px-3 py-2.5 text-left text-xs font-bold text-zinc-200 uppercase tracking-wider">ชื่อ (TH)</th>
                              <th className="px-3 py-2.5 text-right text-xs font-bold text-zinc-200 uppercase tracking-wider">Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topAlarms.map((a, i) => (
                              <tr key={a.id} className={`border-b border-[#1a1a24] hover:bg-[#16161f] transition-colors ${i % 2 !== 0 ? 'bg-[#0a0a10]' : ''}`}>
                                <td className="px-3 py-2.5">
                                  <span className={`text-sm font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-zinc-200' : i === 2 ? 'text-amber-500' : 'text-zinc-300'}`}>
                                    {i + 1}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className="font-mono font-bold text-sm text-white">{a.id}</span>
                                </td>
                                <td className="px-3 py-2.5">
                                  <span className={`text-sm ${categoryColors[a.category] ?? 'text-zinc-300'}`}>{a.category}</span>
                                </td>
                                <td className="px-3 py-2.5 text-sm text-white">{a.alarmNameEN}</td>
                                <td className="px-3 py-2.5 text-sm text-zinc-200">{a.alarmNameTH}</td>
                                <td className="px-3 py-2.5 text-right">
                                  <span className={`font-mono font-bold text-sm ${a.ledColor === 'RED' ? 'text-red-400' : 'text-amber-400'}`}>{a.occurrenceCount}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
              
            );
            
          })()}

        </div>
                  {/* Footer */}
          <div className="text-center text-zinc-700 text-xs pb-6">
            Last updated: <LastUpdated /> · AMR Alarm System
          </div>
      </div>
    </>
  );
}

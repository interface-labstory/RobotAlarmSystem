'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

// Generate 30 days of mock data for each alarm ID
// Base pattern: weekdays higher, weekends lower, random noise
function generateMonthlyData(seed: number, base: number): number[] {
  const days: number[] = [];
  for (let d = 0; d < 30; d++) {
    const dayOfWeek = d % 7;
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    const weekdayMul = isWeekend ? 0.4 : 1;
    const noise = Math.sin(d * seed) * 0.3 + 1;
    const trend = 1 + (d / 30) * 0.15;
    days.push(Math.max(0, Math.round(base * weekdayMul * noise * trend)));
  }
  return days;
}

const alarmMonthlyData: Record<number, number[]> = {
  2:  generateMonthlyData(1.1, 3),
  6:  generateMonthlyData(1.3, 7),
  8:  generateMonthlyData(0.9, 4),
  10: generateMonthlyData(1.7, 6),
  11: generateMonthlyData(2.1, 5),
  13: generateMonthlyData(0.7, 8),
  14: generateMonthlyData(1.5, 10),
  15: generateMonthlyData(2.3, 4),
  20: generateMonthlyData(0.5, 7),
  26: generateMonthlyData(1.9, 2),
};

const alarmNames: Record<number, string> = {
  2: 'Safety Scanner', 6: 'Localization Low', 8: 'Marker Not Found',
  10: 'Path Blocked', 11: 'Motor Overtemp', 13: 'Speed Feedback',
  14: 'Battery Low', 15: 'Battery Critical', 20: 'Lidar Fault',
  26: 'Lifter Failed',
};

const alarmColors: Record<number, string> = {
  2: '#f87171', 6: '#fb923c', 8: '#facc15', 10: '#a3e635',
  11: '#ef4444', 13: '#818cf8', 14: '#fbbf24', 15: '#f43f5e',
  20: '#22d3ee', 26: '#4ade80',
};

// Build chart data: each entry = one day
function buildMonthlyChartData(selectedIds: number[], startDate: Date) {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const entry: Record<string, string | number> = { day: label, dayIndex: i + 1 };
    selectedIds.forEach((id) => {
      entry[`ID ${id}`] = alarmMonthlyData[id]?.[i] ?? 0;
    });
    return entry;
  });
}

// Monthly total per alarm
function buildMonthlySummary() {
  return Object.entries(alarmMonthlyData).map(([idStr, days]) => {
    const id = Number(idStr);
    const total = days.reduce((a, b) => a + b, 0);
    const max = Math.max(...days);
    const maxDay = days.indexOf(max) + 1;
    const avg = (total / 30).toFixed(1);
    return { id, name: alarmNames[id] ?? `ID ${id}`, total, max, maxDay, avg };
  }).sort((a, b) => b.total - a.total);
}

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl px-4 py-3 shadow-xl max-w-xs">
      <p className="text-xs font-semibold text-zinc-400 mb-2">วันที่ {label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-zinc-400">{p.name}</span>
          </div>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AlarmMonthlyChart() {
  const allIds = Object.keys(alarmMonthlyData).map(Number);
  const [selectedIds, setSelectedIds] = useState<number[]>([14, 13, 20, 6, 10]);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Use April 2026 as mock month
  const startDate = new Date(2026, 2, 23); // March 23 → April 21
  const data = buildMonthlyChartData(selectedIds, startDate);
  const summary = buildMonthlySummary();

  const toggleId = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Alarm Occurrence — Monthly View</h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            จำนวน Alarm ที่เกิดแต่ละวัน ·{' '}
            <span className="text-cyan-400">
              {startDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {(['area', 'bar'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                chartType === t
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-transparent text-zinc-500 border-[#2a2a3a] hover:text-zinc-300'
              }`}
            >
              {t === 'area' ? 'Area' : 'Bar'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Alarm Selector */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">เลือก Alarm ID</p>
          <div className="flex flex-wrap gap-2">
            {allIds.map((id) => (
              <button
                key={id}
                onClick={() => toggleId(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedIds.includes(id)
                    ? 'border-transparent text-[#0d0d14]'
                    : 'bg-transparent text-zinc-500 border-[#2a2a3a] hover:text-zinc-300 hover:border-[#3a3a4a]'
                }`}
                style={selectedIds.includes(id) ? { backgroundColor: alarmColors[id] } : {}}
              >
                {id} · {alarmNames[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {selectedIds.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-zinc-600 text-sm">
            เลือก Alarm ID อย่างน้อย 1 รายการ
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            {chartType === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  {selectedIds.map((id) => (
                    <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={alarmColors[id]} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={alarmColors[id]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#71717a' }} />
                {selectedIds.map((id) => (
                  <Area
                    key={id}
                    type="monotone"
                    dataKey={`ID ${id}`}
                    stroke={alarmColors[id]}
                    strokeWidth={2}
                    fill={`url(#grad-${id})`}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#71717a' }} />
                {selectedIds.map((id) => (
                  <Bar key={id} dataKey={`ID ${id}`} fill={alarmColors[id]} radius={[3, 3, 0, 0]} maxBarSize={16} />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        )}

        {/* Monthly Summary Table */}
        <div className="mt-6 border border-[#1e1e2e] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#16161f] border-b border-[#1e1e2e]">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Monthly Summary</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Alarm</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total/Month</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Avg/Day</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Peak Day</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Peak Count</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((row, i) => (
                  <tr key={row.id} className={`border-b border-[#1a1a24] hover:bg-[#16161f] transition-colors ${i % 2 !== 0 ? 'bg-[#0a0a10]' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: alarmColors[row.id] }} />
                        <span className="font-mono font-bold text-white">{row.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{row.name}</td>
                    <td className="px-4 py-3 text-center font-bold text-white">{row.total}</td>
                    <td className="px-4 py-3 text-center text-zinc-400">{row.avg}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-cyan-400 font-semibold">Day {row.maxDay}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-red-400 font-bold">{row.max}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';

const alarmHourlyData: Record<number, number[]> = {
  2:  [0,0,0,0,1,0,2,5,8,6,4,3,2,3,4,6,9,11,8,5,3,2,1,0],
  6:  [0,0,0,0,0,1,3,8,12,15,10,8,6,9,11,13,16,14,9,6,4,2,1,0],
  8:  [1,0,0,0,0,0,1,2,4,6,5,4,3,4,5,6,7,6,4,3,2,1,0,0],
  10: [0,0,0,0,0,0,1,3,6,9,12,10,8,9,11,12,13,11,8,5,3,1,0,0],
  11: [0,0,0,0,0,0,0,1,3,5,6,4,3,4,5,6,7,8,6,4,2,1,0,0],
  13: [0,1,0,0,0,1,2,4,7,9,8,6,5,7,8,9,10,9,7,5,3,2,1,0],
  14: [2,1,1,0,1,2,4,8,14,18,15,12,11,13,15,17,20,18,14,10,7,5,3,2],
  15: [1,0,0,0,0,1,2,4,7,9,8,6,5,6,7,8,9,8,6,4,3,2,1,1],
  20: [0,0,0,0,0,0,1,2,5,8,7,5,4,5,6,7,8,7,5,3,2,1,0,0],
};

const alarmNames: Record<number, string> = {
  2: 'Safety Scanner', 6: 'Localization Low', 8: 'Marker Not Found',
  10: 'Path Blocked', 11: 'Motor Overtemp', 13: 'Speed Feedback',
  14: 'Battery Low', 15: 'Battery Critical', 20: 'Lidar Fault',
};

const alarmColors: Record<number, string> = {
  2: '#f87171', 6: '#fb923c', 8: '#facc15', 10: '#a3e635',
  11: '#ef4444', 13: '#818cf8', 14: '#fbbf24', 15: '#f43f5e',
  20: '#22d3ee',
};

function buildHourlyData(selectedIds: number[]) {
  return Array.from({ length: 24 }, (_, hour) => {
    const entry: Record<string, number | string> = {
      hour: `${hour.toString().padStart(2, '0')}:00`,
    };
    selectedIds.forEach((id) => {
      entry[`ID ${id}`] = alarmHourlyData[id]?.[hour] ?? 0;
    });
    return entry;
  });
}

function buildPeakSummary() {
  return Object.entries(alarmHourlyData).map(([idStr, hours]) => {
    const id = Number(idStr);
    const max = Math.max(...hours);
    const peakHour = hours.indexOf(max);
    const total = hours.reduce((a, b) => a + b, 0);
    return { id, name: alarmNames[id] ?? `ID ${id}`, peakHour: `${peakHour.toString().padStart(2, '0')}:00`, peakCount: max, total };
  }).sort((a, b) => b.total - a.total);
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-zinc-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-zinc-300">{p.name}:</span>
          <span className="font-semibold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AlarmTimeChart() {
  const allIds = Object.keys(alarmHourlyData).map(Number);
  const [selectedIds, setSelectedIds] = useState<number[]>([14, 13, 20, 6, 10]);
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');

  const toggleId = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const data = buildHourlyData(selectedIds);
  const peakSummary = buildPeakSummary();

  return (
    <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Alarm Occurrence by Time</h2>
          <p className="text-zinc-500 text-sm mt-0.5">ช่วงเวลาที่ Alarm เกิดบ่อยที่สุดในแต่ละชั่วโมง</p>
        </div>
        <div className="flex gap-2">
          {(['bar', 'line'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                chartType === t
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-transparent text-zinc-500 border-[#2a2a3a] hover:text-zinc-300'
              }`}
            >
              {t === 'bar' ? 'Bar' : 'Line'}
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
            {chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#71717a' }} />
                {selectedIds.map((id) => (
                  <Bar key={id} dataKey={`ID ${id}`} fill={alarmColors[id]} radius={[3, 3, 0, 0]} maxBarSize={20} />
                ))}
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: '#52525b' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#71717a' }} />
                {selectedIds.map((id) => (
                  <Line key={id} type="monotone" dataKey={`ID ${id}`} stroke={alarmColors[id]}
                    strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        )}

        {/* Peak Summary */}
        <div className="mt-6 border border-[#1e1e2e] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#16161f] border-b border-[#1e1e2e]">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Peak Hour Summary</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Alarm</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Peak Hour</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Peak Count</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total/Day</th>
                </tr>
              </thead>
              <tbody>
                {peakSummary.map((row, i) => (
                  <tr key={row.id} className={`border-b border-[#1a1a24] transition-colors hover:bg-[#16161f] ${i % 2 === 0 ? '' : 'bg-[#0a0a10]'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: alarmColors[row.id] }} />
                        <span className="font-mono font-bold text-white">{row.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{row.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-cyan-400 font-semibold">{row.peakHour}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-red-400 font-bold">{row.peakCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-zinc-400">{row.total}</td>
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

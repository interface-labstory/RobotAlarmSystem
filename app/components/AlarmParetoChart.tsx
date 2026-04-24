'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { allAlarms } from '../data/alarms';

// Sort all alarms descending by count and compute cumulative %
function buildParetoData() {
  const sorted = [...allAlarms].sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  const total = sorted.reduce((s, a) => s + a.occurrenceCount, 0);
  let running = 0;
  return sorted.map((a) => {
    running += a.occurrenceCount;
    return {
      label: `${a.id}`,
      name: a.alarmNameEN,
      nameTH: a.alarmNameTH,
      count: a.occurrenceCount,
      ledColor: a.ledColor,
      cumPct: parseFloat(((running / total) * 100).toFixed(1)),
    };
  });
}

const paretoData = buildParetoData();

const ParetoTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const entry = paretoData.find((d) => d.label === label);
  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl px-4 py-3 shadow-xl max-w-xs">
      <p className="text-xs font-bold text-white mb-0.5">ID {label}</p>
      <p className="text-xs text-zinc-300 mb-2">{entry?.nameTH}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm">
          <span className="text-zinc-400">{p.name}</span>
          <span className="font-bold" style={{ color: p.color }}>
            {typeof p.value === 'number' && p.name.includes('%') ? `${p.value}%` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Custom bar that colors RED or YELLOW based on ledColor
function CustomBar(props: {
  x?: number; y?: number; width?: number; height?: number;
  ledColor?: string; [key: string]: unknown;
}) {
  const { x = 0, y = 0, width = 0, height = 0, ledColor } = props;
  const fill = ledColor === 'RED' ? '#ef4444' : ledColor === 'YELLOW' ? '#f59e0b' : '#818cf8';
  return <rect x={x} y={y} width={width} height={Math.max(0, height)} fill={fill} rx={3} ry={3} />;
}

export default function AlarmParetoChart() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const chartHeight = isFullscreen ? 520 : 340;

  // 80/20 index: first entry where cumPct >= 80
  const eightyPctIdx = paretoData.findIndex((d) => d.cumPct >= 80);
  const eightyPctLabel = eightyPctIdx !== -1 ? paretoData[eightyPctIdx].label : null;

  const total = allAlarms.reduce((s, a) => s + a.occurrenceCount, 0);
  const top20Pct = Math.round(paretoData.length * 0.2);
  const top20Count = paretoData.slice(0, top20Pct).reduce((s, d) => s + d.count, 0);
  const top20Share = ((top20Count / total) * 100).toFixed(0);

  return (
    <div
      ref={containerRef}
      className={`chart-fullscreen-container bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6 ${isFullscreen ? 'is-fullscreen' : ''}`}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Pareto Chart — Alarm Frequency</h2>
          <p className="text-zinc-300 text-sm mt-0.5">
            จัดอันดับ Alarm ตามความถี่ · เส้นสะสม (Cumulative %)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 80/20 badge */}
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            20% ของ Alarm ({top20Pct} ประเภท) = <strong>{top20Share}%</strong> ของเหตุการณ์ทั้งหมด
          </div>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border border-[#2a2a3a] text-zinc-200 hover:text-cyan-400 hover:border-cyan-500/30"
            title={isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6" /><path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" /><path d="M3 21l7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart
            data={paretoData}
            margin={{ top: 10, right: 40, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Alarm ID', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#71717a' }}
            />
            {/* Left Y: count */}
            <YAxis
              yAxisId="count"
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={false}
              label={{ value: 'ครั้ง', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#71717a' }}
            />
            {/* Right Y: cumulative % */}
            <YAxis
              yAxisId="pct"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#a1a1aa' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ParetoTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />

            {/* 80% reference line */}
            <ReferenceLine
              yAxisId="pct"
              y={80}
              stroke="#f59e0b"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: '80%', fill: '#f59e0b', fontSize: 11, position: 'right' }}
            />
            {/* Vertical reference at 80% break point */}
            {eightyPctLabel && (
              <ReferenceLine
                yAxisId="count"
                x={eightyPctLabel}
                stroke="#f59e0b"
                strokeDasharray="4 3"
                strokeWidth={1.5}
              />
            )}

            <Bar
              yAxisId="count"
              dataKey="count"
              name="จำนวนครั้ง"
              maxBarSize={28}
              shape={(props: unknown) => {
                const p = props as { x?: number; y?: number; width?: number; height?: number; ledColor?: string; payload?: { ledColor?: string } };
                return <CustomBar {...p} ledColor={p.payload?.ledColor} />;
              }}
            />
            <Line
              yAxisId="pct"
              type="monotone"
              dataKey="cumPct"
              name="สะสม %"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ r: 2, fill: '#22d3ee', strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-red-500" />RED — Motor Stopped</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-amber-500" />YELLOW — Warning</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-5 h-0.5 bg-cyan-400" />Cumulative %</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-5 h-0.5 bg-amber-500" style={{ borderTop: '2px dashed #f59e0b', background: 'none' }} />80% threshold</span>
        </div>
      </div>
    </div>
  );
}

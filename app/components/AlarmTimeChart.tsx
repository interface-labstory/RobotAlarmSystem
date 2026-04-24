'use client';

import { useState, useRef, useEffect } from 'react';
import {
  BarChart, Bar, ComposedChart, Line, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
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

function buildTimePareto(ids: number[]) {
  const items = ids.map((id) => ({
    label: `ID ${id}`,
    name: alarmNames[id] ?? `ID ${id}`,
    count: (alarmHourlyData[id] ?? []).reduce((a, b) => a + b, 0),
    color: alarmColors[id] ?? '#818cf8',
  })).sort((a, b) => b.count - a.count);
  const grand = items.reduce((s, d) => s + d.count, 0) || 1;
  let running = 0;
  return items.map((d) => {
    running += d.count;
    return { ...d, cumPct: parseFloat(((running / grand) * 100).toFixed(1)) };
  });
}

const ParetoTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl px-4 py-3 shadow-xl max-w-xs">
      <p className="text-xs font-bold text-white mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm">
          <span className="text-zinc-400">{p.name}</span>
          <span className="font-bold" style={{ color: p.color }}>
            {p.name.includes('%') ? `${p.value}%` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-zinc-300 mb-2">{label}</p>
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
  const [chartType, setChartType] = useState<'bar' | 'pareto'>('pareto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ── Scroll-wheel zoom ──────────────────────────────────────────
  const [zoomWindow, setZoomWindow] = useState({ start: 0, end: 23 });
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomWindow((prev) => {
        const range = prev.end - prev.start;
        const center = (prev.start + prev.end) / 2;
        const step = Math.max(1, Math.round(range * 0.25));
        let newRange = e.deltaY < 0 ? range - step : range + step;
        newRange = Math.max(2, Math.min(23, newRange));
        let newStart = Math.round(center - newRange / 2);
        let newEnd = newStart + newRange;
        if (newStart < 0) { newEnd -= newStart; newStart = 0; }
        if (newEnd > 23) { newStart -= (newEnd - 23); newEnd = 23; }
        return { start: Math.max(0, newStart), end: Math.min(23, newEnd) };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const resetZoom = () => setZoomWindow({ start: 0, end: 23 });
  const isZoomed = zoomWindow.start !== 0 || zoomWindow.end !== 23;
  // ──────────────────────────────────────────────────────────────

  const toggleId = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const data = buildHourlyData(selectedIds);
  const peakSummary = buildPeakSummary();
  const visibleData = data.slice(zoomWindow.start, zoomWindow.end + 1);
  const paretoData = buildTimePareto(selectedIds);

  // ── Pareto scroll zoom ─────────────────────────────────────────
  const [paretoZoom, setParetoZoom] = useState({ start: 0, end: paretoData.length - 1 });
  const paretoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setParetoZoom({ start: 0, end: Math.max(0, buildTimePareto(selectedIds).length - 1) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.length]);

  useEffect(() => {
    const el = paretoWrapperRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setParetoZoom((prev) => {
        const max = paretoData.length - 1;
        const range = prev.end - prev.start;
        const step = Math.max(1, Math.round(range * 0.25));
        let newRange = e.deltaY < 0 ? range - step : range + step;
        newRange = Math.max(1, Math.min(max, newRange));
        let newStart = Math.round((prev.start + prev.end) / 2 - newRange / 2);
        let newEnd = newStart + newRange;
        if (newStart < 0) { newEnd -= newStart; newStart = 0; }
        if (newEnd > max) { newStart -= (newEnd - max); newEnd = max; }
        return { start: Math.max(0, newStart), end: Math.min(max, newEnd) };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [paretoData.length]);

  const resetParetoZoom = () => setParetoZoom({ start: 0, end: Math.max(0, paretoData.length - 1) });
  const isParetoZoomed = paretoZoom.start !== 0 || paretoZoom.end !== paretoData.length - 1;
  const visibleParetoData = paretoData.slice(paretoZoom.start, paretoZoom.end + 1);
  // ─────────────────────────────────────────────────────────────

  const chartHeight = isFullscreen ? 520 : 320;

  const chartContent = () => (
    <>
      {/* Alarm Selector */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">เลือก Alarm ID</p>
        <div className="flex flex-wrap gap-2">
          {allIds.map((id) => (
            <button
              key={id}
              onClick={() => toggleId(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedIds.includes(id)
                  ? 'border-transparent text-[#0d0d14]'
                  : 'bg-transparent text-zinc-200 border-[#2a2a3a] hover:text-white hover:border-[#3a3a4a]'
              }`}
              style={selectedIds.includes(id) ? { backgroundColor: alarmColors[id] } : {}}
            >
              {id} · {alarmNames[id]}
            </button>
          ))}
        </div>
      </div>


      {selectedIds.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-zinc-300 text-sm">
          เลือก Alarm ID อย่างน้อย 1 รายการ
        </div>
      ) : chartType === 'pareto' ? (
        // ── PARETO VIEW ──────────────────────────────────────────
        <>
          <div className="flex items-center justify-between mb-2 select-none">
            {(() => {
              const eightyIdx = visibleParetoData.findIndex((d) => d.cumPct >= 80);
              const top = eightyIdx !== -1 ? eightyIdx + 1 : visibleParetoData.length;
              const share = visibleParetoData[eightyIdx !== -1 ? eightyIdx : visibleParetoData.length - 1]?.cumPct ?? 100;
              return (
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  {top} Alarm = <strong>{share}%</strong> ของเหตุการณ์ที่เลือก
                </span>
              );
            })()}
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">
                {isParetoZoomed
                  ? `🔍 ${paretoZoom.end - paretoZoom.start + 1} Alarm (scroll เพื่อ zoom)`
                  : 'เลื่อน scroll เพื่อ zoom · double-click เพื่อรีเซต'}
              </span>
              {isParetoZoomed && (
                <button onClick={resetParetoZoom} className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                  รีเซต zoom
                </button>
              )}
            </div>
          </div>
          <div ref={paretoWrapperRef} onDoubleClick={resetParetoZoom} style={{ cursor: 'crosshair' }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <ComposedChart data={visibleParetoData} margin={{ top: 10, right: 50, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="count" tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ParetoTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <ReferenceLine yAxisId="pct" y={80} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5}
                  label={{ value: '80%', fill: '#f59e0b', fontSize: 11, position: 'right' }} />
                <Bar yAxisId="count" dataKey="count" name="จำนวนครั้ง" maxBarSize={36} radius={[3, 3, 0, 0]}>
                  {visibleParetoData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
                <Line yAxisId="pct" type="monotone" dataKey="cumPct" name="สะสม %" stroke="#22d3ee" strokeWidth={2}
                  dot={{ r: 3, fill: '#22d3ee', strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="inline-block w-5 h-0.5 bg-cyan-400" />สะสม %</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-5 border-t-2 border-dashed border-amber-500" />80% threshold</span>
          </div>
        </>
      ) : (
        // ── BAR VIEW ─────────────────────────────────────────────
        <>
          {/* Zoom status */}
          <div className="flex items-center justify-between mb-2 select-none">
            <span className="text-xs text-zinc-500">
              {isZoomed
                ? `🔍 ${String(zoomWindow.start).padStart(2, '0')}:00 – ${String(zoomWindow.end).padStart(2, '0')}:00 · ${zoomWindow.end - zoomWindow.start + 1} ชั่วโมง`
                : 'เลื่อน scroll เพื่อ zoom · double-click เพื่อรีเซต'}
            </span>
            {isZoomed && (
              <button onClick={resetZoom} className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                รีเซต zoom
              </button>
            )}
          </div>
          <div ref={chartWrapperRef} onDoubleClick={resetZoom} style={{ cursor: 'crosshair' }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={visibleData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#d4d4d8' }} />
                {selectedIds.map((id) => (
                  <Bar key={id} dataKey={`ID ${id}`} fill={alarmColors[id]} radius={[3, 3, 0, 0]} maxBarSize={20} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`chart-fullscreen-container bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6 ${isFullscreen ? 'is-fullscreen' : ''}`}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Alarm Occurrence by Time</h2>
          <p className="text-zinc-300 text-sm mt-0.5">ช่วงเวลาที่ Alarm เกิดบ่อยที่สุดในแต่ละชั่วโมง</p>
        </div>
        <div className="flex gap-2">
          {(['bar', 'pareto'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                chartType === t
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-transparent text-zinc-200 border-[#2a2a3a] hover:text-white'
              }`}
            >
              {t === 'bar' ? 'Bar' : 'Pareto'}
            </button>
          ))}
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
        {chartContent()}

        {/* Peak Summary */}
        <div className="mt-6 border border-[#1e1e2e] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#16161f] border-b border-[#1e1e2e]">
            <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Peak Hour Summary</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">Alarm</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-300 uppercase tracking-wider">Peak Hour</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-300 uppercase tracking-wider">Peak Count</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-zinc-300 uppercase tracking-wider">Total/Day</th>
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
                    <td className="px-4 py-3 text-center text-zinc-300">{row.total}</td>
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

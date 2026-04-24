'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { maintenanceAlarms } from '../data/alarms';

// ─── Mock Maintenance Log ────────────────────────────────────────────────────
type LogType = 'Battery' | 'Motor';
interface ServiceLog {
  id: number;
  timestamp: string;
  type: LogType;
  event: string;
  technician: string;
  status: 'Completed' | 'Scheduled' | 'Pending';
  note?: string;
}

const maintenanceLogs: ServiceLog[] = [
  { id: 1,  timestamp: '2026-04-22 07:00', type: 'Battery', event: 'Battery Lifetime Warning triggered (920/1000 cycles)',       technician: 'System Auto',  status: 'Pending',   note: 'Alarm triggered during dock charging' },
  { id: 2,  timestamp: '2026-04-20 09:15', type: 'Motor',   event: 'Motor Lifetime Warning triggered (8,750/10,000 hrs)',        technician: 'System Auto',  status: 'Pending',   note: 'Alarm triggered during dock charging' },
  { id: 3,  timestamp: '2026-04-18 14:30', type: 'Battery', event: 'Cell voltage delta check — delta 0.05 V (within limit)',    technician: 'Technician A', status: 'Completed', note: 'Cell balancing normal' },
  { id: 4,  timestamp: '2026-04-15 10:00', type: 'Motor',   event: 'Scheduled motor inspection at 8,500 hrs',                  technician: 'Technician B', status: 'Completed', note: 'Lubrication replaced, no abnormal wear' },
  { id: 5,  timestamp: '2026-04-10 08:45', type: 'Battery', event: 'Battery pack voltage check — 25.6 V nominal',              technician: 'Technician A', status: 'Completed', note: 'All cells within spec' },
  { id: 6,  timestamp: '2026-03-28 13:20', type: 'Motor',   event: 'Motor temperature anomaly review',                         technician: 'Technician C', status: 'Completed', note: 'Cooling vent cleared' },
  { id: 7,  timestamp: '2026-03-20 11:00', type: 'Battery', event: 'Battery swap scheduled — Unit AMR-02',                     technician: 'Technician B', status: 'Scheduled', note: 'Replacement part ordered (ETA: 2026-05-01)' },
  { id: 8,  timestamp: '2026-03-10 09:30', type: 'Motor',   event: 'Motor encoder calibration',                                technician: 'Technician A', status: 'Completed', note: 'Encoder offset corrected ±0.02°' },
  { id: 9,  timestamp: '2026-02-25 15:00', type: 'Battery', event: 'Battery lifetime threshold 80% — advisory issued',         technician: 'System Auto',  status: 'Completed', note: '' },
  { id: 10, timestamp: '2026-02-12 08:00', type: 'Motor',   event: 'Motor brush inspection at 8,000 hrs',                     technician: 'Technician C', status: 'Completed', note: 'Brushes replaced' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function LedBadge({ color }: { color: string }) {
  if (color === 'RED')
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />RED</span>;
  if (color === 'YELLOW')
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />YELLOW</span>;
  return <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">{color}</span>;
}

function StatusBadge({ status }: { status: ServiceLog['status'] }) {
  const map = {
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Scheduled: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${map[status]}`}>{status}</span>;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const barColor =
    pct >= 90 ? 'bg-red-500' :
    pct >= 75 ? 'bg-amber-500' :
    color;
  return (
    <div className="w-full bg-[#1a1a28] rounded-full h-2.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Battery Section ──────────────────────────────────────────────────────────
function BatteryWarningCard({ lastServiceDate, onUpdateService }: { lastServiceDate: string; onUpdateService: (d: string) => void }) {
  const alarm = maintenanceAlarms.find((a) => a.id === 32)!;
  const cycleUsed    = 920;
  const cycleMax     = 1000;
  const lifetimeUsed = 92;
  const healthPct    = 100 - lifetimeUsed;
  const [editDate, setEditDate] = useState(false);
  const [dateInput, setDateInput] = useState(lastServiceDate);

  return (
    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 overflow-hidden mb-5">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border bg-amber-500/15 text-amber-300 border-amber-500/20">ID {alarm.id}</span>
          <LedBadge color={alarm.ledColor} />
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse">⚠ Service Required</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-0.5">{alarm.alarmNameEN}</h3>
        <p className="text-zinc-300 text-sm">{alarm.alarmNameTH} · Trigger: {alarm.triggerCondition}</p>
      </div>

      <div className="h-px mx-6 bg-amber-500/20" />

      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Col 1: Current Health Status */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">1 · Current Health Status</p>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Battery Health</span>
              <span className="text-2xl font-bold text-red-400">{healthPct}%</span>
            </div>
            <ProgressBar value={lifetimeUsed} max={100} color="bg-teal-500" />
            <p className="text-xs text-zinc-600 mt-1.5">Lifetime used: <span className="text-red-400 font-semibold">{lifetimeUsed}%</span> — ต่ำกว่าเกณฑ์มาตรฐาน</p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Charge Cycle Count</span>
              <span className="text-lg font-bold text-amber-400">{cycleUsed.toLocaleString()} <span className="text-zinc-600 text-sm font-normal">/ {cycleMax.toLocaleString()}</span></span>
            </div>
            <ProgressBar value={cycleUsed} max={cycleMax} color="bg-cyan-500" />
            <p className="text-xs text-zinc-600 mt-1.5">เหลืออีก <span className="text-amber-400 font-semibold">{cycleMax - cycleUsed} cycles</span> ก่อนถึงขีดจำกัด</p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-2">Pack Voltage</p>
            <p className="text-xl font-bold text-white">25.6 V <span className="text-xs font-normal text-zinc-500">nominal</span></p>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {[3.21, 3.20, 3.18, 3.22, 3.19, 3.20, 3.17].map((v, i) => (
                <div key={i} className={`rounded px-1.5 py-1 text-center text-xs font-mono ${v < 3.19 ? 'bg-red-500/10 text-red-400' : 'bg-[#1a1a28] text-zinc-300'}`}>
                  C{i + 1}<br />{v}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-1.5">Cell Delta: <span className="text-amber-400">0.05 V</span></p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-2">วันที่เข้าซ่อมล่าสุด</p>
            {editDate ? (
              <div className="flex gap-2">
                <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                  className="flex-1 bg-[#1a1a28] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-amber-500/50" />
                <button onClick={() => { onUpdateService(dateInput); setEditDate(false); }}
                  className="px-3 py-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-semibold hover:bg-amber-500/25 transition-colors">
                  บันทึก
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">{lastServiceDate || '—'}</span>
                <button onClick={() => setEditDate(true)}
                  className="text-xs text-zinc-500 hover:text-amber-400 transition-colors border border-[#2a2a3a] hover:border-amber-500/30 px-2.5 py-1 rounded-lg">
                  แก้ไข
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Risks + Interim Care */}
        <div className="lg:col-span-1 space-y-5">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">2 · ความเสี่ยงที่ต้องระวัง</p>
            <div className="space-y-2.5">
              <div className="bg-[#0d0d14] border border-orange-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-orange-400 mb-1">⚡ Performance Throttling</p>
                <p className="text-xs text-zinc-300 leading-relaxed">แบตเตอรี่ที่เสื่อมสภาพทำให้เครื่องทำงานช้าลง ความเร็วและแรงยกลดลงเพื่อปกป้องแบต</p>
              </div>
              <div className="bg-[#0d0d14] border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-400 mb-1">🔴 Unpredictable Shutdown</p>
                <p className="text-xs text-zinc-300 leading-relaxed">เครื่องอาจดับเองกะทันหันแม้จะยังมีเปอร์เซ็นต์แบตแสดงอยู่ เนื่องจาก capacity drift</p>
              </div>
              <div className="bg-[#0d0d14] border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 mb-1">🔥 Battery Swelling Risk</p>
                <p className="text-xs text-zinc-300 leading-relaxed">เพื่อป้องกันแบตบวม ซึ่งอาจสร้างความเสียหายต่อ chassis และวงจรภายในถาวร</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">4 · การดูแลระหว่างรอเปลี่ยน</p>
            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4 space-y-2.5">
              {[
                { icon: '🔌', text: 'เสียบสายชาร์จไว้ขณะใช้งานหนัก เพื่อลดการดึงจากแบต' },
                { icon: '🌡', text: 'หลีกเลี่ยงการใช้งานในที่มีอุณหภูมิสูง (>40 °C)' },
                { icon: '🔋', text: 'เปิด Low Power Mode เพื่อลด workload และลดความร้อน' },
                { icon: '📋', text: 'สำรองข้อมูลสำคัญก่อนนำเครื่องเข้าซ่อม' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0 mt-0.5">{tip.icon}</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

// ─── Motor Section ────────────────────────────────────────────────────────────
function MotorWarningCard({ lastServiceDate, onUpdateService }: { lastServiceDate: string; onUpdateService: (d: string) => void }) {
  const alarm = maintenanceAlarms.find((a) => a.id === 33)!;
  const runtimeHrs = 8750;
  const runtimeMax  = 10000;
  const runtimePct  = Math.round((runtimeHrs / runtimeMax) * 100);
  const healthPct   = 100 - runtimePct;
  const [editDate, setEditDate] = useState(false);
  const [dateInput, setDateInput] = useState(lastServiceDate);

  return (
    <div className="rounded-2xl border border-teal-500/25 bg-teal-500/5 overflow-hidden mb-5">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border bg-teal-500/15 text-teal-300 border-teal-500/20">ID {alarm.id}</span>
          <LedBadge color={alarm.ledColor} />
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">⚠ Plan Service Soon</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-0.5">{alarm.alarmNameEN}</h3>
        <p className="text-zinc-300 text-sm">{alarm.alarmNameTH} · Trigger: {alarm.triggerCondition}</p>
      </div>

      <div className="h-px mx-6 bg-teal-500/20" />

      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Col 1: Current Health Status */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">1 · Current Health Status</p>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Motor Health</span>
              <span className="text-2xl font-bold text-amber-400">{healthPct}%</span>
            </div>
            <ProgressBar value={runtimePct} max={100} color="bg-teal-500" />
            <p className="text-xs text-zinc-600 mt-1.5">Lifetime used: <span className="text-amber-400 font-semibold">{runtimePct}%</span></p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Runtime Hours</span>
              <span className="text-lg font-bold text-teal-400">{runtimeHrs.toLocaleString()} <span className="text-zinc-600 text-sm font-normal">/ {runtimeMax.toLocaleString()} hrs</span></span>
            </div>
            <ProgressBar value={runtimeHrs} max={runtimeMax} color="bg-teal-500" />
            <p className="text-xs text-zinc-600 mt-1.5">เหลืออีก <span className="text-teal-400 font-semibold">{(runtimeMax - runtimeHrs).toLocaleString()} hrs</span> ก่อนถึงขีดจำกัด</p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-2">Request Status</p>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">PENDING REQUEST</span>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-2">วันที่เข้าซ่อมล่าสุด</p>
            {editDate ? (
              <div className="flex gap-2">
                <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                  className="flex-1 bg-[#1a1a28] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-teal-500/50" />
                <button onClick={() => { onUpdateService(dateInput); setEditDate(false); }}
                  className="px-3 py-1.5 bg-teal-500/15 text-teal-400 border border-teal-500/20 rounded-lg text-xs font-semibold hover:bg-teal-500/25 transition-colors">
                  บันทึก
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">{lastServiceDate || '—'}</span>
                <button onClick={() => setEditDate(true)}
                  className="text-xs text-zinc-500 hover:text-teal-400 transition-colors border border-[#2a2a3a] hover:border-teal-500/30 px-2.5 py-1 rounded-lg">
                  แก้ไข
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Risks + Interim Care */}
        <div className="lg:col-span-1 space-y-5">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">2 · ความเสี่ยงที่ต้องระวัง</p>
            <div className="space-y-2.5">
              <div className="bg-[#0d0d14] border border-orange-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-orange-400 mb-1">⚡ Performance Degradation</p>
                <p className="text-xs text-zinc-300 leading-relaxed">มอเตอร์ที่ใกล้ถึงขีดจำกัดอาจมี torque ลดลง ส่งผลต่อความสามารถในการยกน้ำหนัก</p>
              </div>
              <div className="bg-[#0d0d14] border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-400 mb-1">🔴 Unexpected Motor Failure</p>
                <p className="text-xs text-zinc-300 leading-relaxed">มอเตอร์อาจหยุดทำงานกลางคันโดยไม่มีสัญญาณเตือนล่วงหน้า ส่งผลให้ mission ล้มเหลว</p>
              </div>
              <div className="bg-[#0d0d14] border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 mb-1">🌡 Overheating Risk</p>
                <p className="text-xs text-zinc-300 leading-relaxed">แบริ่งที่สึกหรออาจทำให้เกิดความร้อนสูงผิดปกติ เพิ่มความเสี่ยงต่อ safety alarm</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">4 · การดูแลระหว่างรอเปลี่ยน</p>
            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4 space-y-2.5">
              {[
                { icon: '🔧', text: 'ลด duty cycle หรือความถี่ mission เพื่อลดชั่วโมงมอเตอร์' },
                { icon: '🌡', text: 'ตรวจสอบอุณหภูมิมอเตอร์ทุกกะ หากเกิน 65 °C ให้หยุดทันที' },
                { icon: '🔊', text: 'หากได้ยินเสียงผิดปกติ (เสียงดัง/สั่น) ให้รายงานทันที' },
                { icon: '📋', text: 'จดบันทึก hours ใช้งานจริงเพื่อแจ้งช่างก่อนเข้าซ่อม' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0 mt-0.5">{tip.icon}</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

// ─── Maintenance Log Table ────────────────────────────────────────────────────
function MaintenanceLogTable() {
  const [filter, setFilter] = useState<'All' | LogType>('All');
  const filtered = filter === 'All' ? maintenanceLogs : maintenanceLogs.filter((l) => l.type === filter);
  const tabs: Array<'All' | LogType> = ['All', 'Battery', 'Motor'];
  const tabCount = (t: 'All' | LogType) =>
    t === 'All' ? maintenanceLogs.length : maintenanceLogs.filter((l) => l.type === t).length;

  return (
    <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-[#1e1e2e] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Maintenance Log</h2>
          <p className="text-zinc-500 text-sm mt-0.5">ประวัติการบำรุงรักษาพร้อม Timestamp แยกตามประเภท</p>
        </div>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filter === t
                  ? t === 'Battery' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : t === 'Motor'   ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                  :                   'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-transparent text-zinc-500 border-[#2a2a3a] hover:text-zinc-300'
              }`}>
              {t} <span className="ml-1 opacity-60">({tabCount(t)})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2e]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-40">Timestamp</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-28">Type</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Event</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-32">Technician</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id} className={`border-b border-[#1a1a24] hover:bg-[#16161f] transition-colors ${i % 2 !== 0 ? 'bg-[#0a0a10]' : ''}`}>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-zinc-300">{row.timestamp}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    row.type === 'Battery'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                  }`}>
                    {row.type === 'Battery' ? '🔋 Battery' : '⚙ Motor'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-white text-sm leading-snug">{row.event}</p>
                  {row.note && <p className="text-zinc-600 text-xs mt-0.5">{row.note}</p>}
                </td>
                <td className="px-5 py-3.5 text-zinc-300 text-sm">{row.technician}</td>
                <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MaintenancePage() {
  const [batteryLastService, setBatteryLastService] = useState('2026-04-15');
  const [motorLastService, setMotorLastService]     = useState('2026-04-15');

  const alarm34 = maintenanceAlarms.find((a) => a.id === 34)!;

  return (
    <>
      <Navbar currentPage="maintenance" />
      <div className="min-h-screen bg-[#07070d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-2">Robot Alarm System</p>
            <h1 className="text-3xl font-bold text-white mb-1">Maintenance & Warning</h1>
            <p className="text-zinc-300 text-sm">แนวทางการแก้ปัญหาและเงื่อนไข Trigger สำหรับงานบำรุงรักษา</p>
          </div>

          <BatteryWarningCard lastServiceDate={batteryLastService} onUpdateService={setBatteryLastService} />
          <MotorWarningCard   lastServiceDate={motorLastService}   onUpdateService={setMotorLastService} />
          <MaintenanceLogTable />


          <div className="text-center text-zinc-600 text-xs pb-4 mt-8">
            AMR Alarm System · Maintenance & Warning
          </div>
        </div>
      </div>
    </>
  );
}

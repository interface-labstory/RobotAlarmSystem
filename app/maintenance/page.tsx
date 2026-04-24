'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { maintenanceAlarms } from '../data/alarms';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const map = {
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Scheduled: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  const label = {
    Completed: t('status.completed'),
    Scheduled: t('status.scheduled'),
    Pending:   t('status.pending'),
  };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${map[status]}`}>{label[status]}</span>;
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
  const { t } = useLanguage();
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
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse">{t('maint.serviceRequired')}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-0.5">{alarm.alarmNameEN}</h3>
        <p className="text-zinc-300 text-sm">{alarm.alarmNameTH} · {t('maint.trigger')} {alarm.triggerCondition}</p>
      </div>

      <div className="h-px mx-6 bg-amber-500/20" />

      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Col 1: Current Health Status */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">{t('maint.bat.health1')}</p>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">{t('maint.bat.health')}</span>
              <span className="text-2xl font-bold text-red-400">{healthPct}%</span>
            </div>
            <ProgressBar value={lifetimeUsed} max={100} color="bg-teal-500" />
            <p className="text-xs text-zinc-600 mt-1.5">{t('maint.bat.lifetimeLabel')} <span className="text-red-400 font-semibold">{lifetimeUsed}%</span> — {t('maint.bat.belowSpec')}</p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">{t('maint.bat.cycleCount')}</span>
              <span className="text-lg font-bold text-amber-400">{cycleUsed.toLocaleString()} <span className="text-zinc-600 text-sm font-normal">/ {cycleMax.toLocaleString()}</span></span>
            </div>
            <ProgressBar value={cycleUsed} max={cycleMax} color="bg-cyan-500" />
            <p className="text-xs text-zinc-600 mt-1.5"><span className="text-amber-400 font-semibold">{cycleMax - cycleUsed}</span> {t('maint.bat.cyclesLeft')}</p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-2">{t('maint.bat.packVoltage')}</p>
            <p className="text-xl font-bold text-white">25.6 V <span className="text-xs font-normal text-zinc-500">nominal</span></p>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {[3.21, 3.20, 3.18, 3.22, 3.19, 3.20, 3.17].map((v, i) => (
                <div key={i} className={`rounded px-1.5 py-1 text-center text-xs font-mono ${v < 3.19 ? 'bg-red-500/10 text-red-400' : 'bg-[#1a1a28] text-zinc-300'}`}>
                  C{i + 1}<br />{v}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-1.5">{t('maint.bat.cellDelta')} <span className="text-amber-400">0.05 V</span></p>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-2">{t('maint.bat.lastService')}</p>
            {editDate ? (
              <div className="flex gap-2">
                <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                  className="flex-1 bg-[#1a1a28] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-amber-500/50" />
                <button onClick={() => { onUpdateService(dateInput); setEditDate(false); }}
                  className="px-3 py-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-semibold hover:bg-amber-500/25 transition-colors">
                  {t('maint.save')}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">{lastServiceDate || '—'}</span>
                <button onClick={() => setEditDate(true)}
                  className="text-xs text-zinc-500 hover:text-amber-400 transition-colors border border-[#2a2a3a] hover:border-amber-500/30 px-2.5 py-1 rounded-lg">
                  {t('maint.edit')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Risks + Interim Care */}
        <div className="lg:col-span-1 space-y-5">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{t('maint.bat.risks')}</p>
            <div className="space-y-2.5">
              <div className="bg-[#0d0d14] border border-orange-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-orange-400 mb-1">{t('maint.bat.r1.t')}</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{t('maint.bat.r1.d')}</p>
              </div>
              <div className="bg-[#0d0d14] border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-400 mb-1">{t('maint.bat.r2.t')}</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{t('maint.bat.r2.d')}</p>
              </div>
              <div className="bg-[#0d0d14] border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 mb-1">{t('maint.bat.r3.t')}</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{t('maint.bat.r3.d')}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{t('maint.bat.interim')}</p>
            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4 space-y-2.5">
              {([
                { icon: '🔌', key: 'maint.bat.tip1' },
                { icon: '🌡', key: 'maint.bat.tip2' },
                { icon: '🔋', key: 'maint.bat.tip3' },
                { icon: '📋', key: 'maint.bat.tip4' },
              ] as { icon: string; key: string }[]).map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0 mt-0.5">{tip.icon}</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{t(tip.key)}</p>
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
const WARRANTY_MAX_HRS = 50_000;
const WARRANTY_MAX_KM  = 4_500;

function MotorWarningCard({ lastServiceDate, onUpdateService }: { lastServiceDate: string; onUpdateService: (d: string) => void }) {
  const alarm = maintenanceAlarms.find((a) => a.id === 33)!;
  const { t } = useLanguage();
  const runtimeHrs = 8_750;
  const runtimeMax  = 10_000;
  const runtimePct  = Math.round((runtimeHrs / runtimeMax) * 100);
  const healthPct   = 100 - runtimePct;
  const [editDate, setEditDate] = useState(false);
  const [dateInput, setDateInput] = useState(lastServiceDate);

  // ─ Aggregate across all motors ─────────────────────────────────
  const totalHrs = 196_700;   // 48,200 + 51,500 + 45,000 + 52,000
  const totalKm  = 17_670;    // 4,320  + 4,650  + 3,900  + 4,800
  const hrVoid   = totalHrs > WARRANTY_MAX_HRS;
  const kmVoid   = totalKm  > WARRANTY_MAX_KM;
  const warrantyVoid = hrVoid || kmVoid;
  const hrPct    = Math.min(100, (totalHrs / WARRANTY_MAX_HRS) * 100);
  const kmPct    = Math.min(100, (totalKm  / WARRANTY_MAX_KM)  * 100);
  // ─────────────────────────────────────────────────────────────

  return (
    <div className={`rounded-2xl border overflow-hidden mb-5 ${warrantyVoid ? 'border-red-500/40 bg-red-500/5' : 'border-teal-500/25 bg-teal-500/5'}`}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border bg-teal-500/15 text-teal-300 border-teal-500/20">ID {alarm.id}</span>
          <LedBadge color={alarm.ledColor} />
          {warrantyVoid ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
              {t('maint.warrantyVoidBadge')}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">{t('maint.planService')}</span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-white mb-0.5">{alarm.alarmNameEN}</h3>
        <p className="text-zinc-300 text-sm">{alarm.alarmNameTH} · Trigger: {alarm.triggerCondition}</p>
      </div>

      {/* ── Warranty Void Banner ── */}
      {warrantyVoid && (
        <div className="mx-6 mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🚫</span>
            <div>
              <p className="text-sm font-bold text-red-400 mb-1">{t('maint.mot.voidTitle')}</p>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {t('maint.mot.voidHours')}<span className="text-red-300 font-semibold">{totalHrs.toLocaleString()} hr</span>)
                {hrVoid && <span className="text-red-300 font-semibold"> {t('maint.mot.voidOver')} 50,000 hr</span>}
                {hrVoid && kmVoid && <span className="text-zinc-400"> · </span>}
                {kmVoid && <>{t('maint.mot.voidKm')}<span className="text-red-300 font-semibold">{totalKm.toLocaleString()} km</span>)
                  <span className="text-red-300 font-semibold"> {t('maint.mot.voidOver')} 4,500 km</span>
                </>}
                {' '}— <strong className="text-red-300">{t('maint.mot.voidEnd')}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`h-px mx-6 ${warrantyVoid ? 'bg-red-500/20' : 'bg-teal-500/20'}`} />

      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Col 1: Current Health Status */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">{t('maint.mot.health1')}</p>

          {/* <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Motor Health</span>
              <span className="text-2xl font-bold text-amber-400">{healthPct}%</span>
            </div>
            <ProgressBar value={runtimePct} max={100} color="bg-teal-500" />
            <p className="text-xs text-zinc-600 mt-1.5">Lifetime used: <span className="text-amber-400 font-semibold">{runtimePct}%</span></p>
          </div> */}

          {/* <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Runtime Hours (System)</span>
              <span className="text-lg font-bold text-teal-400">{runtimeHrs.toLocaleString()} <span className="text-zinc-600 text-sm font-normal">/ {runtimeMax.toLocaleString()} hrs</span></span>
            </div>
            <ProgressBar value={runtimeHrs} max={runtimeMax} color="bg-teal-500" />
            <p className="text-xs text-zinc-600 mt-1.5">เหลืออีก <span className="text-teal-400 font-semibold">{(runtimeMax - runtimeHrs).toLocaleString()} hrs</span> ก่อนถึงขีดจำกัด</p>
          </div> */}

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-3">{t('maint.mot.warrantyStatus')}</p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-400">{t('maint.mot.totalHours')}</span>
                  <span className={`text-sm font-bold ${hrVoid ? 'text-red-400' : 'text-teal-400'}`}>
                    {totalHrs.toLocaleString()} <span className="text-zinc-600 font-normal text-xs">/ 50,000 hr</span>
                    {hrVoid && <span className="ml-1 text-red-400">⚠</span>}
                  </span>
                </div>
                <div className="w-full bg-[#1a1a28] rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${hrVoid ? 'bg-red-500' : hrPct >= 90 ? 'bg-amber-500' : 'bg-teal-500'}`} style={{ width: `${hrPct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-400">{t('maint.mot.totalDist')}</span>
                  <span className={`text-sm font-bold ${kmVoid ? 'text-red-400' : 'text-teal-400'}`}>
                    {totalKm.toLocaleString()} <span className="text-zinc-600 font-normal text-xs">/ 4,500 km</span>
                    {kmVoid && <span className="ml-1 text-red-400">⚠</span>}
                  </span>
                </div>
                <div className="w-full bg-[#1a1a28] rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${kmVoid ? 'bg-red-500' : kmPct >= 90 ? 'bg-amber-500' : 'bg-teal-500'}`} style={{ width: `${kmPct}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#1e1e2e]">
                <span className="text-xs text-zinc-400">{t('maint.mot.totalWarranty')}</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded ${warrantyVoid ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {warrantyVoid ? 'VOID' : 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-xs text-zinc-500 font-medium mb-2">{t('maint.mot.lastService')}</p>
            {editDate ? (
              <div className="flex gap-2">
                <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                  className="flex-1 bg-[#1a1a28] border border-[#2a2a3a] rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-teal-500/50" />
                <button onClick={() => { onUpdateService(dateInput); setEditDate(false); }}
                  className="px-3 py-1.5 bg-teal-500/15 text-teal-400 border border-teal-500/20 rounded-lg text-xs font-semibold hover:bg-teal-500/25 transition-colors">
                  {t('maint.save')}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">{lastServiceDate || '—'}</span>
                <button onClick={() => setEditDate(true)}
                  className="text-xs text-zinc-500 hover:text-teal-400 transition-colors border border-[#2a2a3a] hover:border-teal-500/30 px-2.5 py-1 rounded-lg">
                  {t('maint.edit')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Risks + Interim Care */}
        <div className="lg:col-span-1 space-y-5">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{t('maint.mot.risks')}</p>
            <div className="space-y-2.5">
              {warrantyVoid && (
                <div className="bg-[#0d0d14] border border-red-500/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-red-400 mb-1">{t('maint.mot.r0.t')}</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{t('maint.mot.r0.d')}</p>
                </div>
              )}
              <div className="bg-[#0d0d14] border border-orange-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-orange-400 mb-1">{t('maint.mot.r1.t')}</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{t('maint.mot.r1.d')}</p>
              </div>
              <div className="bg-[#0d0d14] border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-400 mb-1">{t('maint.mot.r2.t')}</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{t('maint.mot.r2.d')}</p>
              </div>
              <div className="bg-[#0d0d14] border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-400 mb-1">{t('maint.mot.r3.t')}</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{t('maint.mot.r3.d')}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              {warrantyVoid ? t('maint.mot.urgentVoid') : t('maint.mot.interim')}
            </p>
            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4 space-y-2.5">
              {(warrantyVoid ? [
                { icon: '📞', key: 'maint.mot.void.tip1' },
                { icon: '📑', key: 'maint.mot.void.tip2' },
                { icon: '⛔', key: 'maint.mot.void.tip3' },
                { icon: '💰', key: 'maint.mot.void.tip4' },
              ] : [
                { icon: '🔧', key: 'maint.mot.tip1' },
                { icon: '🌡', key: 'maint.mot.tip2' },
                { icon: '🔊', key: 'maint.mot.tip3' },
                { icon: '📋', key: 'maint.mot.tip4' },
              ] as { icon: string; key: string }[]).map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0 mt-0.5">{tip.icon}</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{t(tip.key)}</p>
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
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'All' | LogType>('All');
  const filtered = filter === 'All' ? maintenanceLogs : maintenanceLogs.filter((l) => l.type === filter);
  const tabs: Array<'All' | LogType> = ['All', 'Battery', 'Motor'];
  const tabCount = (tab: 'All' | LogType) =>
    tab === 'All' ? maintenanceLogs.length : maintenanceLogs.filter((l) => l.type === tab).length;

  return (
    <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-[#1e1e2e] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{t('maint.log.title')}</h2>
          <p className="text-zinc-500 text-sm mt-0.5">{t('maint.log.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filter === tab
                  ? tab === 'Battery' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : tab === 'Motor'   ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                  :                    'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-transparent text-zinc-500 border-[#2a2a3a] hover:text-zinc-300'
              }`}>
              {tab} <span className="ml-1 opacity-60">({tabCount(tab)})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2e]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-40">{t('table.timestamp')}</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-28">{t('table.type')}</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('table.event')}</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-32">{t('table.technician')}</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-28">{t('table.status')}</th>
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
  const { t } = useLanguage();
  const [batteryLastService, setBatteryLastService] = useState('2026-04-15');
  const [motorLastService, setMotorLastService]     = useState('2026-04-15');

  return (
    <>
      <Navbar currentPage="maintenance" />
      <div className="min-h-screen bg-[#07070d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-2">{t('common.robotAlarmSystem')}</p>
            <h1 className="text-3xl font-bold text-white mb-1">{t('maint.title')}</h1>
            <p className="text-zinc-300 text-sm">{t('maint.subtitle')}</p>
          </div>

          <BatteryWarningCard lastServiceDate={batteryLastService} onUpdateService={setBatteryLastService} />
          <MotorWarningCard   lastServiceDate={motorLastService}   onUpdateService={setMotorLastService} />
          <MaintenanceLogTable />


          <div className="text-center text-zinc-600 text-xs pb-4 mt-8">
            AMR Alarm System · {t('maint.title')}
          </div>
        </div>
      </div>
    </>
  );
}

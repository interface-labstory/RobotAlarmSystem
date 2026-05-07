"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Activity,
  Clock,
  List,
  Cpu,
  TrendingUp,
} from "lucide-react";

// --- Mock Data ---
const pieData = [
  { name: "Run", value: 65, color: "#22c55e" },
  { name: "Stop", value: 20, color: "#ef4444" },
  { name: "Manual", value: 15, color: "#facc15" },
];

const tableData = [
  {
    RoundTimestamp: "10:00 - 10:30",
    BaterryChargeLastestDock: "50",
    BaterryChargeLastestwhenendChargeTime: "75",
  },
  {
    RoundTimestamp: "10:30 - 11:00",
    BaterryChargeLastestDock: "65",
    BaterryChargeLastestwhenendChargeTime: "82",
  },
  {
    RoundTimestamp: "11:00 - 11:30",
    BaterryChargeLastestDock: "70",
    BaterryChargeLastestwhenendChargeTime: "100",
  },
];

const timelineData = [
  { status: "Run", width: "40%", color: "bg-emerald-500", label: "08:00" },
  { status: "Stop", width: "10%", color: "bg-rose-500", label: "12:00" },
  { status: "Manual", width: "15%", color: "bg-yellow-500", label: "13:00" },
  {
    status: "Run",
    width: "35%",
    color: "bg-emerald-500",
    label: "15:00 - 20:00",
  },
];

export default function MachineDashboard() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-200 p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Machine Monitoring Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Real-time monitoring & machine analytics
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Machine Status</p>
              <h2 className="text-2xl font-bold mt-1 text-emerald-400">
                RUNNING
              </h2>
            </div>
            <Cpu className="text-emerald-400" size={30} />
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Count Manual Charge</p>
              <h2 className="text-2xl font-bold mt-1">92</h2>
            </div>
            <TrendingUp className="text-cyan-400" size={30} />
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Count Auto Charge</p>
              <h2 className="text-2xl font-bold mt-1">23</h2>
            </div>
            <Activity className="text-violet-400" size={30} />
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Count Shutdown</p>
              <h2 className="text-2xl font-bold mt-1 text-yellow-400">
                25
              </h2>
            </div>
            <Clock className="text-yellow-400" size={30} />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIE CHART */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4">
            Machine Status Ratio
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CENTER SCORE */}
        <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700  rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute w-52 h-52 bg-white/10 rounded-full -top-10 -right-10"></div>

          <Activity size={40} className="text-white mb-3 z-10" />

          <p className="text-cyan-100 text-lg z-10">
            Emergency Stop
          </p>

          <h2 className="text-8xl font-black text-white leading-none my-3 z-10">
            23
          </h2>

        </div>

        {/* TABLE */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-5">
            <List size={18} className="text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">
              Round cycles
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="pb-3 text-left">Round</th>
                  <th className="pb-3 text-left">StartDock</th>
                  <th className="pb-3 text-right">EndRound</th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 hover:bg-[#1b2435] transition"
                  >
                    <td className="py-4 font-medium text-white">
                      {row.RoundTimestamp}
                    </td>

                    <td className="py-4 text-gray-400">{row.BaterryChargeLastestDock}%</td>

                    <td className="py-4 text-right font-bold text-cyan-400">
                      {row.BaterryChargeLastestwhenendChargeTime}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="mt-6 bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="text-cyan-400" size={18} />
          <h2 className="text-lg font-semibold text-white">
            Machine Timeline
          </h2>
        </div>

        {/* Timeline Bar */}
        <div className="relative h-14 w-full flex overflow-hidden rounded-xl border border-gray-700">
          {timelineData.map((segment, i) => (
            <div
              key={i}
              style={{ width: segment.width }}
              className={`${segment.color} flex items-center justify-center text-xs font-bold text-white hover:opacity-90 transition`}
              title={`${segment.status}: ${segment.label}`}
            >
              {segment.status}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-xs text-gray-500 px-1">
          <span>08:00</span>
          <span>11:00</span>
          <span>14:00</span>
          <span>17:00</span>
          <span>20:00</span>
        </div>
      </div>
    </div>
  );
}
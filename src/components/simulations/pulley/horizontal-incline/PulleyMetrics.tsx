"use client";

import { PulleyPhysicsState, PulleySimulationParams } from "@/types/pulley";
import { Activity, Gauge, Zap, Timer, ArrowDown, Scale } from "lucide-react";

interface PulleyMetricsProps {
  state: PulleyPhysicsState;
  params: PulleySimulationParams;
}

export function PulleyMetrics({ state, params }: PulleyMetricsProps) {
  const isEquilibrium = state.acceleration === 0;

  return (
    <div className="space-y-4">
      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Rope Tension T */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">সুতার টান (Tension, T)</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.tension.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              N
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            রশির টান বল
          </span>
        </div>

        {/* Acceleration a */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">সিস্টেমের ত্বরণ (a)</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.acceleration.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              m/s²
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {isEquilibrium ? "সাম্যাবস্থা (স্থির)" : "গতিশীল ত্বরণ"}
          </span>
        </div>

        {/* Speed / Velocity of m1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">m₁ এর বেগ (Speed, v)</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.velocity.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              m/s
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            বর্তমান অধোগতি দ্রুতি
          </span>
        </div>

        {/* Displacement s */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">অতিক্রান্ত দূরত্ব (s)</span>
            <ArrowDown className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.displacement.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              m
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            m₁ এর উল্লম্ব পতন সরণ
          </span>
        </div>

        {/* Elapsed Time t */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">সময় (Elapsed Time, t)</span>
            <Timer className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.time.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              s
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            গতিশীল সময়কাল
          </span>
        </div>

        {/* Net Force F_net */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">লব্ধি ত্বরণ বল (F_net)</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.netForce.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              N
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            (m₁ + m₂) × a
          </span>
        </div>
      </div>

      {/* Force Breakdown Table */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center justify-between">
          <span>বলের বিস্তারিত হিসাব (Force Breakdown at 90°)</span>
          <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
            g = {params.gravity} m/s², কোণ = ৯০°
          </span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-600 dark:text-zinc-300">
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">m₁ এর ওজন (W₁)</div>
            <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {state.drivingForce.toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">m₁·g (অধোমুখী বল)</div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">m₂ লম্ব প্রতিক্রিয়া (N₂)</div>
            <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {state.normal2.toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">m₂·g (টেবিলের ওপর)</div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">টেবিলের ঘর্ষণ বল (f₂)</div>
            <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {state.friction2.toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">μ · N₂</div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">লব্ধি চালক বল (F_drive)</div>
            <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {state.netForce.toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">m₁·g - f₂</div>
          </div>
        </div>
      </div>
    </div>
  );
}

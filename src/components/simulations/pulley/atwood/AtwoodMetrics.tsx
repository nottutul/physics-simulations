"use client";

import { AtwoodState } from "@/types/atwood-machine";
import { Gauge, ArrowDown, ArrowUp, CheckCircle2 } from "lucide-react";

interface AtwoodMetricsProps {
  state: AtwoodState;
}

export function AtwoodMetrics({ state }: AtwoodMetricsProps) {
  const getDirectionBadge = () => {
    if (state.hasReachedLimit) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          ভূমিতে আঘাত সম্পন্ন (Impact / Limit Reached)
        </span>
      );
    }
    if (state.motionDirection === "m1_down") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
          <ArrowDown className="w-3.5 h-3.5" />
          m₁ নিচে নামছে (m₁ ↓, m₂ ↑)
        </span>
      );
    }
    if (state.motionDirection === "m2_down") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
          <ArrowUp className="w-3.5 h-3.5" />
          m₂ নিচে নামছে (m₂ ↓, m₁ ↑)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        সাম্যাবস্থা (Equilibrium / Static)
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-sm">
          <Gauge className="w-4 h-4 text-blue-600" />
          গতিবিদ্যা ও বলের পরিমাপ (Live Metrics)
        </h3>
        {getDirectionBadge()}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Tension T */}
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
          <span className="text-xs text-amber-700 dark:text-amber-400 font-medium block">
            সুতার টান (Tension, T)
          </span>
          <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-300">
            {state.tension.toFixed(2)}{" "}
            <span className="text-xs font-normal">N</span>
          </span>
        </div>

        {/* Acceleration a */}
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
          <span className="text-xs text-blue-700 dark:text-blue-400 font-medium block">
            ত্বরণ (Acceleration, a)
          </span>
          <span className="text-xl font-bold font-mono text-blue-700 dark:text-blue-300">
            {Math.abs(state.acceleration).toFixed(2)}{" "}
            <span className="text-xs font-normal">m/s²</span>
          </span>
        </div>

        {/* Impact / Current Velocity */}
        <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
          <span className="text-xs text-purple-700 dark:text-purple-400 font-medium block">
            বর্তমান বেগ (Velocity, v)
          </span>
          <span className="text-xl font-bold font-mono text-purple-700 dark:text-purple-300">
            {Math.abs(state.velocity).toFixed(2)}{" "}
            <span className="text-xs font-normal">m/s</span>
          </span>
        </div>

        {/* Theoretical time to ground */}
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium block">
            ভূমিতে পৌঁছার সময় (t)
          </span>
          <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
            {state.timeToGround.toFixed(2)}{" "}
            <span className="text-xs font-normal">s</span>
          </span>
        </div>

        {/* Theoretical impact velocity */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium block">
            ভূমিতে আঘাতের বেগ (v_impact)
          </span>
          <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {state.impactVelocity.toFixed(2)}{" "}
            <span className="text-xs font-normal">m/s</span>
          </span>
        </div>

        {/* Elapsed simulation time */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium block">
            অতিবাহিত সময় (Elapsed, t)
          </span>
          <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {state.time.toFixed(2)}{" "}
            <span className="text-xs font-normal">s</span>
          </span>
        </div>
      </div>
    </div>
  );
}

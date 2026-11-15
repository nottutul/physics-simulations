"use client";

import { DoublePulleyParams, DoublePulleyState } from "@/types/double-pulley";
import { Activity, Gauge, Scale, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface DoublePulleyMetricsProps {
  state: DoublePulleyState;
  params: DoublePulleyParams;
}

export function DoublePulleyMetrics({
  state,
  params,
}: DoublePulleyMetricsProps) {
  const directionText =
    state.direction === "right"
      ? "ডান দিকে গতিশীল (m₁ > m₂)"
      : state.direction === "left"
      ? "বাম দিকে গতিশীল (m₂ > m₁)"
      : "সাম্যাবস্থায় স্থির";

  return (
    <div className="space-y-4">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Tension T1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">টান বল (T₁) [ডান রশি]</span>
            <Scale className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.t1.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              N
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            m₁ ও m এর মধ্যবর্তী টান
          </span>
        </div>

        {/* Tension T2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">টান বল (T₂) [বাম রশি]</span>
            <Scale className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.t2.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              N
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            m₂ ও m এর মধ্যবর্তী টান
          </span>
        </div>

        {/* Acceleration a */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">সিস্টেমের ত্বরণ (a)</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {state.acceleration.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              m/s²
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
            {state.direction === "right" && <ArrowRight className="w-3 h-3 text-blue-500" />}
            {state.direction === "left" && <ArrowLeft className="w-3 h-3 text-purple-500" />}
            {state.direction === "equilibrium" && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
            {directionText}
          </span>
        </div>

        {/* Speed v */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">বর্তমান বেগ (v)</span>
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
            রশির গতিদ্রুতি
          </span>
        </div>
      </div>

      {/* Secondary Forces & State Summary */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center justify-between">
          <span>বলের বিশ্লেষণ ও ভারসম্য বিবরণী</span>
          <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
            মোট ভর = {(params.m1 + params.m + params.m2).toFixed(1)} kg | g = {params.gravity} m/s²
          </span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-600 dark:text-zinc-300">
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">m₁ এর ওজন (W₁)</div>
            <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
              {(params.m1 * params.gravity).toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">ডান পাশের নিম্নমুখী বল</div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">m₂ এর ওজন (W₂)</div>
            <div className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400">
              {(params.m2 * params.gravity).toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">বাম পাশের নিম্নমুখী বল</div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">লব্ধি চালক বল (ΔF)</div>
            <div className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
              {Math.abs((params.m1 - params.m2) * params.gravity).toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">|m₁ - m₂| · g</div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <div className="text-[11px] text-zinc-400 mb-0.5">ঘর্ষণ বল (f_table)</div>
            <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {state.frictionForce.toFixed(2)} N
            </div>
            <div className="text-[10px] text-zinc-400">μ · m · g</div>
          </div>
        </div>
      </div>
    </div>
  );
}

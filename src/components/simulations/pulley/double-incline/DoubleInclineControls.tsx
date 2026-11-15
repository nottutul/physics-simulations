"use client";

import { Play, Pause, RotateCcw, Eye, EyeOff, Sliders } from "lucide-react";
import { DoubleInclineParams } from "@/types/double-incline-pulley";

interface DoubleInclineControlsProps {
  params: DoubleInclineParams;
  onChangeParams: (newParams: DoubleInclineParams) => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  showVectors: boolean;
  onToggleVectors: () => void;
  className?: string;
}

export function DoubleInclineControls({
  params,
  onChangeParams,
  isRunning,
  onTogglePlay,
  onReset,
  showVectors,
  onToggleVectors,
  className = "",
}: DoubleInclineControlsProps) {
  const updateField = (key: keyof DoubleInclineParams, val: number) => {
    onChangeParams({
      ...params,
      [key]: val,
    });
  };

  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between ${className}`}
    >
      {/* Top Playback Controls */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
              isRunning
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                থামান (Pause)
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                চালান (Start)
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition-colors"
            title="পুনরায় শুরু করুন"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট
          </button>

          <button
            onClick={onToggleVectors}
            className={`inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl text-xs font-medium border transition-colors ${
              showVectors
                ? "bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
            title="বল ভেক্টর প্রদর্শন / লুকান"
          >
            {showVectors ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">ভেক্টর</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Sliders className="w-3.5 h-3.5" />
            প্যারামিটার কন্ট্রোল (Parameters)
          </div>
        </div>

        {/* Parameters Sliders List */}
        <div className="space-y-4">
          {/* Mass 1 Slider (Blue - 45° incline) */}
          <div className="space-y-2 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-blue-600 inline-block"></span>
                বাম নততলের ভর (m₁ - ৪৫°)
              </span>
              <span className="font-mono text-blue-700 dark:text-blue-300 font-bold text-base">
                {params.m1.toFixed(1)} kg
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={params.m1}
              onChange={(e) => updateField("m1", parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>0.5 kg</span>
              <span>15 kg</span>
            </div>
          </div>

          {/* Mass 2 Slider (Purple - 60° incline) */}
          <div className="space-y-2 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-purple-600 inline-block"></span>
                ডান নততলের ভর (m₂ - ৬০°)
              </span>
              <span className="font-mono text-purple-700 dark:text-purple-300 font-bold text-base">
                {params.m2.toFixed(1)} kg
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={params.m2}
              onChange={(e) => updateField("m2", parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>0.5 kg</span>
              <span>15 kg</span>
            </div>
          </div>

          {/* Friction Slider */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                ঘর্ষণ গুণাঙ্ক (Friction μ)
              </span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200 font-bold text-base">
                {params.friction.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={params.friction}
              onChange={(e) => updateField("friction", parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-600 dark:accent-zinc-400"
            />
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>0.00 (ঘর্ষণহীন)</span>
              <span>0.50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Angles Info Card */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              নির্দিষ্ট নতি কোণ (Fixed Angles)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50">
              θ₁ = 45°
            </span>
            <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50">
              θ₂ = 60°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

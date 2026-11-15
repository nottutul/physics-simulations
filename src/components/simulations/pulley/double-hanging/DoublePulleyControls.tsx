"use client";

import { Play, Pause, RotateCcw, Eye, EyeOff, Sliders } from "lucide-react";
import { DoublePulleyParams } from "@/types/double-pulley";

interface DoublePulleyControlsProps {
  params: DoublePulleyParams;
  onChangeParams: (newParams: DoublePulleyParams) => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  showVectors: boolean;
  onToggleVectors: () => void;
}

export function DoublePulleyControls({
  params,
  onChangeParams,
  isRunning,
  onTogglePlay,
  onReset,
  showVectors,
  onToggleVectors,
}: DoublePulleyControlsProps) {
  const updateField = (key: keyof DoublePulleyParams, val: number) => {
    onChangeParams({
      ...params,
      [key]: val,
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Playback Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition-colors"
          title="পুনরায় শুরু করুন"
        >
          <RotateCcw className="w-4 h-4" />
          রিসেট
        </button>

        <button
          onClick={onToggleVectors}
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
            showVectors
              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
          }`}
          title="অতিরিক্ত বল ভেক্টর প্রদর্শন"
        >
          {showVectors ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          ভেক্টর
        </button>
      </div>

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Sliders className="w-3.5 h-3.5" />
          ভর নিয়ন্ত্রণ স্লাইডারসমূহ (3-Mass Sliders)
        </div>

        {/* m2 Slider - Purple (Left Mass) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />
              বাম পাশের ঝুলন্ত ভর (m₂)
            </span>
            <span className="font-mono font-bold text-white bg-purple-600 dark:bg-purple-500 px-2 py-0.5 rounded shadow-xs">
              {params.m2} kg
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.5"
            value={params.m2}
            onChange={(e) => updateField("m2", parseFloat(e.target.value))}
            className="w-full accent-purple-600 h-2 bg-purple-200/60 dark:bg-purple-950 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-purple-600/70 dark:text-purple-400/70">
            <span>০.৫ kg</span>
            <span>৭.৫ kg</span>
            <span>১৫ kg</span>
          </div>
        </div>

        {/* m Slider - Amber (Middle Table Mass) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
              টেবিলের ওপর ভর (m)
            </span>
            <span className="font-mono font-bold text-white bg-amber-600 dark:bg-amber-500 px-2 py-0.5 rounded shadow-xs">
              {params.m} kg
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.5"
            value={params.m}
            onChange={(e) => updateField("m", parseFloat(e.target.value))}
            className="w-full accent-amber-600 h-2 bg-amber-200/60 dark:bg-amber-950 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-amber-600/70 dark:text-amber-400/70">
            <span>০.৫ kg</span>
            <span>৭.৫ kg</span>
            <span>১৫ kg</span>
          </div>
        </div>

        {/* m1 Slider - Blue (Right Mass) */}
        <div className="space-y-1.5 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              ডান পাশের ঝুলন্ত ভর (m₁)
            </span>
            <span className="font-mono font-bold text-white bg-blue-600 dark:bg-blue-500 px-2 py-0.5 rounded shadow-xs">
              {params.m1} kg
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.5"
            value={params.m1}
            onChange={(e) => updateField("m1", parseFloat(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-blue-200/60 dark:bg-blue-950 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-blue-600/70 dark:text-blue-400/70">
            <span>০.৫ kg</span>
            <span>৭.৫ kg</span>
            <span>১৫ kg</span>
          </div>
        </div>

        {/* Table Friction Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              টেবিলের ঘর্ষণ গুণাঙ্ক (Friction μ)
            </span>
            <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              {params.friction === 0 ? "মসৃণ (0.00)" : params.friction.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.02"
            value={params.friction}
            onChange={(e) => updateField("friction", parseFloat(e.target.value))}
            className="w-full accent-zinc-600 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Gravity Toggle */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              অভিকর্ষজ ত্বরণ (Gravity g)
            </span>
            <span className="font-mono font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              {params.gravity} m/s²
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateField("gravity", 9.8)}
              className={`py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                params.gravity === 9.8
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              g = 9.8 m/s² (আদর্শ)
            </button>
            <button
              type="button"
              onClick={() => updateField("gravity", 10)}
              className={`py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                params.gravity === 10
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              g = 10 m/s² (পরীক্ষা)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

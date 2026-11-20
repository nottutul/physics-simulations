"use client";

import {
  RelativeVelocityParams,
  ReferenceFrame,
  Direction,
} from "@/types/relative-velocity";
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Eye,
  Compass,
  ArrowRight,
  ArrowLeft,
  Zap,
} from "lucide-react";

interface RelativeVelocityControlsProps {
  params: RelativeVelocityParams;
  onChangeParams: (newParams: Partial<RelativeVelocityParams>) => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  className?: string;
}

export function RelativeVelocityControls({
  params,
  onChangeParams,
  isRunning,
  onTogglePlay,
  onReset,
  className = "",
}: RelativeVelocityControlsProps) {
  // Scenario presets
  const handleApplyPreset = (preset: {
    busSpeed: number;
    busDirection: Direction;
    windSpeed: number;
    windDirection: Direction;
    rainSpeed: number;
    frame: ReferenceFrame;
  }) => {
    onChangeParams(preset);
  };

  return (
    <div
      className={`bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-100 rounded-2xl p-5 shadow-lg space-y-6 flex flex-col justify-between ${className}`}
    >
      {/* Top Action Bar (Start/Pause, Reset) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
            isRunning
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>বিরতি (Pause)</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>চালান (Start)</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-all shadow-sm"
          title="রিসেট করুন"
        >
          <RotateCcw className="w-4 h-4" />
          <span>রিসেট</span>
        </button>
      </div>

      {/* Frame Selection (ফোঁটা কোন দৃষ্টিতে) */}
      <div className="space-y-2.5 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>ফোঁটা কোন দৃষ্টিতে (Reference Frame)</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChangeParams({ frame: "ground" })}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
              params.frame === "ground"
                ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-700/80 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            🌍 ভূমির সাপেক্ষে (Ground)
          </button>

          <button
            onClick={() => onChangeParams({ frame: "bus" })}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
              params.frame === "bus"
                ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-700/80 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            🚌 বাসের সাপেক্ষে (Bus)
          </button>
        </div>
      </div>

      {/* Sliders Section: বেগের মান */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            বেগের মান (Velocities)
          </h3>
        </div>

        {/* 1. Bus Speed (V_b) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>বাসের বেগ, V<sub>b</sub></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-zinc-100">
                {params.busSpeed.toFixed(2)} m/s
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                ({(params.busSpeed * 3.6).toFixed(1)} km/h)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="35"
            step="0.5"
            value={params.busSpeed}
            onChange={(e) =>
              onChangeParams({ busSpeed: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          {/* Bus Direction Toggle */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
            <span>দিক:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChangeParams({ busDirection: "right" })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                  params.busDirection === "right"
                    ? "bg-blue-950/80 border-blue-500 text-blue-300 font-bold"
                    : "border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400"
                }`}
              >
                <span>ডানে</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onChangeParams({ busDirection: "left" })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                  params.busDirection === "left"
                    ? "bg-blue-950/80 border-blue-500 text-blue-300 font-bold"
                    : "border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400"
                }`}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>বামে</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Wind Speed (V_w) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>বাতাসের বেগ, V<sub>w</sub></span>
            </div>
            <span className="font-mono font-bold text-sm text-zinc-100">
              {params.windSpeed.toFixed(2)} m/s
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={params.windSpeed}
            onChange={(e) =>
              onChangeParams({ windSpeed: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />

          {/* Wind Direction Toggle */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
            <span>প্রবাহ:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChangeParams({ windDirection: "right" })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                  params.windDirection === "right"
                    ? "bg-amber-950/80 border-amber-500 text-amber-300 font-bold"
                    : "border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400"
                }`}
              >
                <span>ডানে (→)</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeParams({ windDirection: "left" })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                  params.windDirection === "left"
                    ? "bg-amber-950/80 border-amber-500 text-amber-300 font-bold"
                    : "border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400"
                }`}
              >
                <span>বামে (←)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Rain Speed (V_r) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span>বৃষ্টির বেগ, V<sub>r</sub> (উল্লম্ব)</span>
            </div>
            <span className="font-mono font-bold text-sm text-zinc-100">
              {params.rainSpeed.toFixed(2)} m/s
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="25"
            step="0.5"
            value={params.rainSpeed}
            onChange={(e) =>
              onChangeParams({ rainSpeed: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
        </div>
      </div>

      {/* Display Options: দেখাও */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            দেখাও (Display)
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showRainDrops}
              onChange={(e) =>
                onChangeParams({ showRainDrops: e.target.checked })
              }
              className="rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-zinc-300">বৃষ্টির ফোঁটা</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showResultantVector}
              onChange={(e) =>
                onChangeParams({ showResultantVector: e.target.checked })
              }
              className="rounded bg-zinc-800 border-zinc-700 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-zinc-300">লব্ধি বেগ (বেগুনি তীর)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showVectorValues}
              onChange={(e) =>
                onChangeParams({ showVectorValues: e.target.checked })
              }
              className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-zinc-300">তীরের মান দেখাও</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showParallelogram}
              onChange={(e) =>
                onChangeParams({ showParallelogram: e.target.checked })
              }
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-zinc-300">নির্মাণ রেখা (সামান্তরিক)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showGrid}
              onChange={(e) => onChangeParams({ showGrid: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-zinc-500 focus:ring-zinc-400"
            />
            <span className="text-zinc-300">গ্রিড (Grid)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showCalculations}
              onChange={(e) =>
                onChangeParams({ showCalculations: e.target.checked })
              }
              className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-zinc-300">হিসাব দেখাও</span>
          </label>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>দ্রুত দৃশ্যপট (Quick Scenarios):</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <button
            onClick={() =>
              handleApplyPreset({
                busSpeed: 10,
                busDirection: "right",
                windSpeed: 0,
                windDirection: "right",
                rainSpeed: 7.1,
                frame: "bus",
              })
            }
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-left transition-colors truncate text-zinc-300"
          >
            🚗 বাতাসহীন (সামনের কাচ)
          </button>

          <button
            onClick={() =>
              handleApplyPreset({
                busSpeed: 10,
                busDirection: "right",
                windSpeed: 20,
                windDirection: "right",
                rainSpeed: 7.1,
                frame: "bus",
              })
            }
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-left transition-colors truncate text-zinc-300"
          >
            💨 প্রবল বাতাস (পিছনের কাচ)
          </button>

          <button
            onClick={() =>
              handleApplyPreset({
                busSpeed: 10,
                busDirection: "right",
                windSpeed: 10,
                windDirection: "right",
                rainSpeed: 7.1,
                frame: "bus",
              })
            }
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-left transition-colors truncate text-zinc-300"
          >
            ⚖️ সমবেগ (কেবল ছাদ)
          </button>

          <button
            onClick={() =>
              handleApplyPreset({
                busSpeed: 15,
                busDirection: "right",
                windSpeed: 10,
                windDirection: "left",
                rainSpeed: 7.1,
                frame: "bus",
              })
            }
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-left transition-colors truncate text-zinc-300"
          >
            🌪️ বিপরীতমুখী ঝড়
          </button>
        </div>
      </div>
    </div>
  );
}

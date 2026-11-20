"use client";

import { Gauge } from "lucide-react";
import {
  RelativeVelocityParams,
  RelativeVelocityCalculations,
} from "@/types/relative-velocity";

interface RelativeVelocityMetricsProps {
  params: RelativeVelocityParams;
  calcs: RelativeVelocityCalculations;
}

export function RelativeVelocityMetrics({
  params,
  calcs,
}: RelativeVelocityMetricsProps) {
  const isBusFrame = params.frame === "bus";

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-100 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base text-zinc-100">
            গতিবিদ্যা ও বেগের পরিমাপ (Live Velocity Metrics)
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/80">
          বর্তমান ফ্রেম: {isBusFrame ? "🚌 বাসের সাপেক্ষে" : "🌍 ভূমির সাপেক্ষে"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Bus Speed */}
        <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40">
          <span className="text-[11px] font-semibold text-blue-300 block">
            বাসের বেগ (V<sub>b</sub>)
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-blue-100">
              {params.busSpeed.toFixed(1)}
            </span>
            <span className="text-[11px] text-blue-400">
              m/s
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            ≈ {(params.busSpeed * 3.6).toFixed(1)} km/h ({params.busDirection === "right" ? "ডানে →" : "বামে ←"})
          </span>
        </div>

        {/* 2. Wind Speed */}
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40">
          <span className="text-[11px] font-semibold text-amber-300 block">
            বাতাসের বেগ (V<sub>w</sub>)
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-amber-100">
              {params.windSpeed.toFixed(1)}
            </span>
            <span className="text-[11px] text-amber-400">
              m/s
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            ≈ {(params.windSpeed * 3.6).toFixed(1)} km/h ({params.windDirection === "right" ? "ডানে →" : "বামে ←"})
          </span>
        </div>

        {/* 3. Rain Downward Speed */}
        <div className="p-3 rounded-xl bg-yellow-950/30 border border-yellow-900/40">
          <span className="text-[11px] font-semibold text-yellow-300 block">
            বৃষ্টির খাড়া বেগ (V<sub>r</sub>)
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-yellow-100">
              {params.rainSpeed.toFixed(1)}
            </span>
            <span className="text-[11px] text-yellow-400">
              m/s
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            উল্লম্বভাবে নিচে ↓
          </span>
        </div>

        {/* 4. Relative Horizontal Velocity */}
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
          <span className="text-[11px] font-semibold text-indigo-300 block">
            আপেক্ষিক অনুভূমিক (V<sub>rel,x</sub>)
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-indigo-100">
              {calcs.v_rel_x >= 0 ? `+${calcs.v_rel_x.toFixed(1)}` : calcs.v_rel_x.toFixed(1)}
            </span>
            <span className="text-[11px] text-indigo-400">
              m/s
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            = V<sub>w</sub> - V<sub>b</sub>
          </span>
        </div>

        {/* 5. Resultant Relative Speed */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40">
          <span className="text-[11px] font-semibold text-purple-300 block">
            লব্ধি আপেক্ষিক বেগ ({isBusFrame ? <>V<sub>rb</sub></> : <>V<sub>rg</sub></>})
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-purple-100">
              {(isBusFrame ? calcs.v_rel_mag : calcs.v_ground_mag).toFixed(2)}
            </span>
            <span className="text-[11px] text-purple-400">
              m/s
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            ≈ {((isBusFrame ? calcs.v_rel_mag : calcs.v_ground_mag) * 3.6).toFixed(1)} km/h
          </span>
        </div>

        {/* 6. Angle with Vertical */}
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40">
          <span className="text-[11px] font-semibold text-rose-300 block">
            উল্লম্বের সাথে কোণ (θ)
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-rose-100">
              {(isBusFrame ? calcs.v_rel_angle_deg : calcs.v_ground_angle_deg).toFixed(1)}°
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            অনুভূমিকের সাথে: {(90 - (isBusFrame ? calcs.v_rel_angle_deg : calcs.v_ground_angle_deg)).toFixed(1)}°
          </span>
        </div>
      </div>
    </div>
  );
}

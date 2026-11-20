"use client";

import { Droplets, Info } from "lucide-react";
import { RelativeVelocityCalculations } from "@/types/relative-velocity";

interface GlassWettingBadgeProps {
  calcs: RelativeVelocityCalculations;
}

export function GlassWettingBadge({ calcs }: GlassWettingBadgeProps) {
  const { wettingStatus, wettingTitle, wettingReason, frontGlassWet, rearGlassWet } =
    calcs;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 shadow-lg ${
        wettingStatus === "front"
          ? "bg-blue-950/40 border-blue-800 text-blue-100"
          : wettingStatus === "rear"
          ? "bg-amber-950/40 border-amber-800 text-amber-100"
          : "bg-emerald-950/40 border-emerald-800 text-emerald-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        {/* Main Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              wettingStatus === "front"
                ? "bg-blue-600 text-white shadow-blue-900/50"
                : wettingStatus === "rear"
                ? "bg-amber-600 text-white shadow-amber-900/50"
                : "bg-emerald-600 text-white shadow-emerald-900/50"
            }`}
          >
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block">
              কাচ ভেজার সিদ্ধান্ত (Glass Wetting Status)
            </span>
            <h3 className="text-lg font-bold tracking-tight text-white">{wettingTitle}</h3>
          </div>
        </div>

        {/* Visual Pills for Front & Rear Glass */}
        <div className="flex items-center gap-2">
          {/* Front Glass Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
              frontGlassWet
                ? "bg-blue-950/80 border-blue-500 text-blue-300 shadow-sm"
                : "bg-zinc-900 border-zinc-800 text-zinc-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                frontGlassWet ? "bg-blue-400 animate-ping" : "bg-zinc-600"
              }`}
            />
            <span>সামনের কাচ: {frontGlassWet ? "ভিজবে 💦" : "শুকনা থাকবে 🛡️"}</span>
          </div>

          {/* Rear Glass Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
              rearGlassWet
                ? "bg-amber-950/80 border-amber-500 text-amber-300 shadow-sm"
                : "bg-zinc-900 border-zinc-800 text-zinc-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                rearGlassWet ? "bg-amber-400 animate-ping" : "bg-zinc-600"
              }`}
            />
            <span>পিছনের কাচ: {rearGlassWet ? "ভিজবে 💦" : "শুকনা থাকবে 🛡️"}</span>
          </div>
        </div>
      </div>

      {/* Physics Condition & Explanation */}
      <div className="mt-3 flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-zinc-400" />
        <p className="font-medium text-zinc-300">
          <strong className="text-zinc-100">ব্যাখ্যা: </strong>
          {wettingReason}
        </p>
      </div>

      {/* Live Vector Condition Formula */}
      <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400">
        <div>
          <span>আপেক্ষিক অনুভূমিক বেগ: </span>
          <span className="font-bold text-zinc-200">
            V<sub>rel,x</sub> = V<sub>w</sub> ({calcs.v_Wx >= 0 ? `+${calcs.v_Wx}` : calcs.v_Wx}) - V<sub>b</sub> ({calcs.v_Bx >= 0 ? `+${calcs.v_Bx}` : calcs.v_Bx}) = {calcs.v_rel_x.toFixed(2)} m/s
          </span>
        </div>
        <div>
          <span>উল্লম্বের সাথে বৃষ্টির কোণ: </span>
          <span className="font-bold text-purple-400">
            θ = tan⁻¹(|{calcs.v_rel_x.toFixed(2)}| / {calcs.v_R.toFixed(2)}) = {calcs.v_rel_angle_deg.toFixed(1)}°
          </span>
        </div>
      </div>
    </div>
  );
}

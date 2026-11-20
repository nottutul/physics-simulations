"use client";

import React from "react";
import {
  RelativeVelocityParams,
  RelativeVelocityCalculations,
} from "@/types/relative-velocity";
import { Compass, ArrowRightLeft } from "lucide-react";

interface VectorDiagramProps {
  params: RelativeVelocityParams;
  calcs: RelativeVelocityCalculations;
  className?: string;
}

export function VectorDiagram({
  params,
  calcs,
  className = "",
}: VectorDiagramProps) {
  // SVG coordinate dimensions
  const width = 480;
  const height = 310;
  const originX = 240;
  const originY = 65;

  // Scaling factor: 5.8 pixels per m/s
  const scale = 5.8;

  const isBusFrame = params.frame === "bus";
  const horizVal = isBusFrame ? calcs.v_rel_x : calcs.v_ground_x;
  const vertVal = calcs.v_R;

  // Bus vector components
  const busSpeed = params.busSpeed;
  const isBusRight = params.busDirection === "right";
  const v_Bx_signed = isBusRight ? busSpeed : -busSpeed;
  const neg_v_Bx_signed = -v_Bx_signed; // -v_B (reversed)

  // Pixel coordinates
  // 1. Vertical rain vector (downwards)
  const vPixX = originX;
  const vPixY = originY + vertVal * scale;

  // 2. Original Bus vector (+v_B, forward)
  const busPixX = originX + v_Bx_signed * scale;
  const busPixY = originY;

  // 3. Subtracted / Reversed Bus vector (-v_B, backward)
  const negBusPixX = originX + neg_v_Bx_signed * scale;
  const negBusPixY = originY;

  // 4. Wind vector (from origin or along axis)
  const windPixX = originX + calcs.v_Wx * scale;
  const windPixY = originY;

  // 5. Total relative horizontal vector v_rel,x
  const hPixX = originX + horizVal * scale;
  const hPixY = originY;

  // 6. Resultant vector tip
  const resPixX = originX + horizVal * scale;
  const resPixY = originY + vertVal * scale;

  // Angle theta arc
  const angleDeg = isBusFrame
    ? calcs.v_rel_angle_deg
    : calcs.v_ground_angle_deg;
  const arcRadius = 40;
  const isRightTilt = horizVal >= 0;
  const rad = (angleDeg * Math.PI) / 180;
  const arcEndX = isRightTilt
    ? originX + arcRadius * Math.sin(rad)
    : originX - arcRadius * Math.sin(rad);
  const arcEndY = originY + arcRadius * Math.cos(rad);
  const arcSweep = isRightTilt ? 1 : 0;
  const arcPath =
    angleDeg > 1
      ? `M ${originX} ${originY + arcRadius} A ${arcRadius} ${arcRadius} 0 0 ${arcSweep} ${arcEndX} ${arcEndY}`
      : "";

  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md p-4 shadow-lg flex flex-col justify-between transition-all select-none text-zinc-100 ${className}`}
    >
      {/* Box Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            ভেক্টর ডায়াগ্রাম (Vector Diagram)
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span>ভেক্টর রেখাচিত্র (Vector Geometry)</span>
        </div>
      </div>

      {/* Frame Status Pill */}
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-zinc-400">প্রদর্শিত ভেক্টর ফ্রেম:</span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isBusFrame
              ? "bg-purple-950/80 text-purple-300 border-purple-700 shadow-sm shadow-purple-900/30"
              : "bg-blue-950/80 text-blue-300 border-blue-700 shadow-sm shadow-blue-900/30"
          }`}
        >
          {isBusFrame ? "🚌 বাসের সাপেক্ষে (বিয়োগ নীতি কার্যকর)" : "🌍 ভূমির সাপেক্ষে (স্বাভাবিক)"}
        </span>
      </div>

      {/* SVG Canvas for Vector Diagram */}
      <div className="relative w-full aspect-[480/310] bg-zinc-950 rounded-xl overflow-hidden shadow-inner border border-zinc-800/80 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          <defs>
            {/* Arrow markers */}
            {/* 1. Yellow for vertical rain Vr */}
            <marker
              id="arrow-vert"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#eab308" />
            </marker>

            {/* 2. Orange for wind Vw */}
            <marker
              id="arrow-wind"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f97316" />
            </marker>

            {/* 3. Cyan for subtracted bus velocity -Vb */}
            <marker
              id="arrow-neg-bus"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#06b6d4" />
            </marker>

            {/* 4. Faint blue for original bus velocity Vb */}
            <marker
              id="arrow-orig-bus"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#60a5fa" />
            </marker>

            {/* 5. Violet for resultant Vrb */}
            <marker
              id="arrow-res"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#c084fc" />
            </marker>

            {/* Subtle grid pattern */}
            {params.showGrid && (
              <pattern
                id="vec-dark-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              </pattern>
            )}
          </defs>

          {/* Grid background */}
          {params.showGrid && (
            <rect width={width} height={height} fill="url(#vec-dark-grid)" />
          )}

          {/* Coordinate Axes through origin */}
          <line
            x1="15"
            y1={originY}
            x2={width - 15}
            y2={originY}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1={originX}
            y1="15"
            x2={originX}
            y2={height - 15}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Origin Point */}
          <circle
            cx={originX}
            cy={originY}
            r="4.5"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <text
            x={originX - 12}
            y={originY - 8}
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            O
          </text>

          {/* Parallelogram Construction Helper Lines */}
          {params.showParallelogram && Math.abs(horizVal) > 0.1 && (
            <g
              stroke="rgba(192, 132, 252, 0.45)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            >
              <line x1={hPixX} y1={hPixY} x2={resPixX} y2={resPixY} />
              <line x1={vPixX} y1={vPixY} x2={resPixX} y2={resPixY} />
            </g>
          )}

          {/* Angle arc and text */}
          {arcPath && angleDeg > 1 && (
            <g>
              <path
                d={arcPath}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.5"
              />
              <text
                x={
                  isRightTilt
                    ? originX + (arcRadius + 14) * Math.sin(rad / 2)
                    : originX - (arcRadius + 14) * Math.sin(rad / 2)
                }
                y={originY + (arcRadius + 14) * Math.cos(rad / 2)}
                fill="#f3e8ff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {angleDeg.toFixed(1)}°
              </text>
            </g>
          )}

          {/* --- 1. Downward Vertical Vector: Vr (Yellow) --- */}
          <line
            x1={originX}
            y1={originY}
            x2={vPixX}
            y2={vPixY}
            stroke="#eab308"
            strokeWidth="3.2"
            markerEnd="url(#arrow-vert)"
          />
          <circle
            cx={vPixX}
            cy={vPixY}
            r="5"
            fill="#eab308"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text
            x={vPixX - 10}
            y={vPixY + 18}
            fill="#fef08a"
            fontSize="12"
            fontWeight="bold"
            textAnchor="end"
          >
            V<tspan dy="3" fontSize="9">r</tspan>
            <tspan dy="-3">{params.showVectorValues ? ` (${vertVal.toFixed(1)} m/s)` : ""}</tspan>
          </text>

          {/* --- 2. BUS FRAME: Show Vb (original, dashed) and -Vb (reversed, solid) --- */}
          {isBusFrame && busSpeed > 0.1 && (
            <g>
              {/* Original Bus Velocity Vector Vb (dashed faint arrow showing actual motion) */}
              <line
                x1={originX}
                y1={originY}
                x2={busPixX}
                y2={busPixY}
                stroke="#60a5fa"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.45"
                markerEnd="url(#arrow-orig-bus)"
              />
              <text
                x={busPixX > originX ? busPixX + 6 : busPixX - 6}
                y={busPixY - 14}
                fill="#93c5fd"
                fontSize="10"
                opacity="0.85"
                textAnchor={busPixX > originX ? "start" : "end"}
              >
                V<tspan dy="2.5" fontSize="8">b</tspan>
                <tspan dy="-2.5">
                  {params.showVectorValues ? ` (${busSpeed.toFixed(1)} m/s)` : ""}
                </tspan>
              </text>

              {/* Reversed Subtracted Bus Velocity Vector -Vb (solid cyan arrow) */}
              <line
                x1={originX}
                y1={originY}
                x2={negBusPixX}
                y2={negBusPixY}
                stroke="#06b6d4"
                strokeWidth="3.2"
                markerEnd="url(#arrow-neg-bus)"
              />
              <circle
                cx={negBusPixX}
                cy={negBusPixY}
                r="5"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={negBusPixX > originX ? negBusPixX + 8 : negBusPixX - 8}
                y={negBusPixY - 8}
                fill="#67e8f9"
                fontSize="12"
                fontWeight="bold"
                textAnchor={negBusPixX > originX ? "start" : "end"}
              >
                -V<tspan dy="3" fontSize="9">b</tspan>
                <tspan dy="-3">{params.showVectorValues ? ` (${busSpeed.toFixed(1)} m/s)` : ""}</tspan>
              </text>
            </g>
          )}

          {/* --- 3. Wind Vector Vw (Orange) --- */}
          {params.windSpeed > 0.1 && (
            <g>
              <line
                x1={originX}
                y1={originY}
                x2={windPixX}
                y2={windPixY}
                stroke="#f97316"
                strokeWidth="2.8"
                markerEnd="url(#arrow-wind)"
              />
              <circle
                cx={windPixX}
                cy={windPixY}
                r="5"
                fill="#f97316"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={windPixX > originX ? windPixX + 8 : windPixX - 8}
                y={windPixY + 16}
                fill="#fed7aa"
                fontSize="12"
                fontWeight="600"
                textAnchor={windPixX > originX ? "start" : "end"}
              >
                V<tspan dy="3" fontSize="9">w</tspan>
                <tspan dy="-3">
                  {params.showVectorValues ? ` (${params.windSpeed.toFixed(1)} m/s)` : ""}
                </tspan>
              </text>
            </g>
          )}

          {/* --- 4. Resultant Vector: Vrb (Violet) --- */}
          {params.showResultantVector && (
            <g>
              <line
                x1={originX}
                y1={originY}
                x2={resPixX}
                y2={resPixY}
                stroke="#c084fc"
                strokeWidth="3.6"
                markerEnd="url(#arrow-res)"
              />
              <text
                x={resPixX > originX ? resPixX + 8 : resPixX - 8}
                y={resPixY + 15}
                fill="#f3e8ff"
                fontSize="12"
                fontWeight="bold"
                textAnchor={resPixX > originX ? "start" : "end"}
              >
                {isBusFrame ? (
                  <>
                    V<tspan dy="3" fontSize="9">rb</tspan>
                    <tspan dy="-3"> (লব্ধি)</tspan>
                  </>
                ) : (
                  <>
                    V<tspan dy="3" fontSize="9">rg</tspan>
                    <tspan dy="-3"> (লব্ধি)</tspan>
                  </>
                )}
                {params.showVectorValues &&
                  ` = ${(isBusFrame
                    ? calcs.v_rel_mag
                    : calcs.v_ground_mag
                  ).toFixed(2)} m/s`}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* EDUCATIONAL BANNER: যার সাপেক্ষে বেগ বের করা হয়, তার বেগটি বিয়োগ হয় */}
      <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/80 text-cyan-200 text-xs leading-relaxed flex items-start gap-2.5">
        <ArrowRightLeft className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-100 block">
            💡 ভেক্টর বিয়োগ নীতি (Relative Velocity Subtraction Principle):
          </span>
          <p className="mt-0.5 text-zinc-300">
            {isBusFrame ? (
              <>
                <strong>যার সাপেক্ষে বেগ বের করা হয় (এখানে বাস)</strong>, তাকে
                স্থির ধরে তার বেগের অভিমুখ উল্টিয়ে বিয়োগ করতে হয়। অর্থাৎ বাসের
                গতির বিপরীত দিকে <strong>-V<sub>b</sub></strong> ভেক্টর তৈরি করে বৃষ্টির
                বেগের সাথে সামান্তরিক সূত্রানুসারে যুক্ত করা হয়েছে:{" "}
                <code className="font-mono font-bold bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded">
                  V<sub>rb</sub> = V<sub>r</sub> - V<sub>b</sub> = V<sub>r</sub> + (-V<sub>b</sub>)
                </code>
              </>
            ) : (
              <>
                ভূমির সাপেক্ষে পর্যবেক্ষক মাটিতে স্থির ($V_g = 0$), তাই কোনো বেগ
                উল্টাতে হয় না। সরাসরি বৃষ্টি ও বাতাসের ভেক্টর যোগফল কাজ করছে:{" "}
                <code className="font-mono font-bold bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">
                  V<sub>rg</sub> = V<sub>r</sub> + V<sub>w</sub>
                </code>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Vector Color Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-[11px] font-medium text-zinc-300">
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/60">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
          <span className="truncate">V<sub>r</sub> (বৃষ্টির খাড়া বেগ)</span>
        </div>
        {isBusFrame ? (
          <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/60">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="truncate">-V<sub>b</sub> (বাসের বেগ বিয়োগ)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/60">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
            <span className="truncate">V<sub>g</sub> (স্থির ভূমি)</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/60">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span className="truncate">V<sub>w</sub> (বাতাসের বেগ)</span>
        </div>
        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/60">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
          <span className="truncate">V<sub>rb</sub> (লব্ধি আপেক্ষিক)</span>
        </div>
      </div>
    </div>
  );
}

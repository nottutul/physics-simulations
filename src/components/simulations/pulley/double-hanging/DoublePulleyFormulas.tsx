"use client";

import { DoublePulleyParams, DoublePulleyState } from "@/types/double-pulley";
import { BookOpen } from "lucide-react";

interface DoublePulleyFormulasProps {
  params: DoublePulleyParams;
  state: DoublePulleyState;
}

export function DoublePulleyFormulas({
  params,
  state,
}: DoublePulleyFormulasProps) {
  const isSmooth = params.friction === 0;
  const isRight = params.m1 >= params.m2;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>পদার্থবিজ্ঞান সূত্র ও গাণিতিক বিশ্লেষণ (৩-ভর বিশিষ্ট দ্বৈত কপিকল)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Acceleration Formula */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ১. সার্বিক ত্বরণ নির্ণয় (Acceleration, a):
          </div>
          <div className="font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-amber-600 dark:text-amber-400">
            {isSmooth
              ? "a = [ |m₁ - m₂| · g ] / (m₁ + m + m₂)"
              : "a = [ |m₁ - m₂|·g - μ·m·g ] / (m₁ + m + m₂)"}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            বর্তমান মান বসিয়ে:
            <br />
            a = [ |{params.m1} - {params.m2}| × {params.gravity} {isSmooth ? "" : `- ${state.frictionForce.toFixed(2)}`} ] / ({params.m1} + {params.m} + {params.m2})
            <br />
            a = [ {Math.abs(params.m1 - params.m2)} × {params.gravity} {isSmooth ? "" : `- ${state.frictionForce.toFixed(2)}`} ] / {(params.m1 + params.m + params.m2).toFixed(1)} ={" "}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {state.acceleration.toFixed(2)} m/s²
            </span>
          </p>
        </div>

        {/* Tension Formulas */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ২. রশির টানদ্বয় নির্ণয় (Tension T₁ & T₂):
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div className="text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900 p-1.5 rounded border border-blue-200/60 dark:border-blue-800/60">
              {isRight ? "T₁ = m₁(g - a)" : "T₁ = m₁(g + a)"}
            </div>
            <div className="text-purple-600 dark:text-purple-400 bg-white dark:bg-zinc-900 p-1.5 rounded border border-purple-200/60 dark:border-purple-800/60">
              {isRight ? "T₂ = m₂(g + a)" : "T₂ = m₂(g - a)"}
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            T₁ = {params.m1} × ({params.gravity} {isRight ? "-" : "+"} {state.acceleration.toFixed(2)}) ={" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">{state.t1.toFixed(2)} N</span>
            <br />
            T₂ = {params.m2} × ({params.gravity} {isRight ? "+" : "-"} {state.acceleration.toFixed(2)}) ={" "}
            <span className="font-bold text-purple-600 dark:text-purple-400">{state.t2.toFixed(2)} N</span>
          </p>
        </div>

        {/* Free Body Diagram Equations */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ৩. তিনটি ভরের পৃথক গতি সমীকরণ (Equations of Motion):
          </div>
          <div className="space-y-1 font-mono text-zinc-700 dark:text-zinc-300">
            <div>ভর m₁ (ডান): m₁·g - T₁ = m₁·a</div>
            <div>ভর m (মাঝের): T₁ - T₂ - f = m·a</div>
            <div>ভর m₂ (বাম): T₂ - m₂·g = m₂·a</div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            মাঝের বস্তুতে নিট বল: T₁ - T₂ = {state.t1.toFixed(2)} - {state.t2.toFixed(2)} ={" "}
            {(state.t1 - state.t2).toFixed(2)} N, যা m-কে ত্বরাণ্বিত করে।
          </p>
        </div>

        {/* Speed & Displacement */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ৪. বেগ ও অতিক্রান্ত সরণ (Velocity & Displacement):
          </div>
          <div className="font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-emerald-600 dark:text-emerald-400">
            v = a·t &nbsp;|&nbsp; s = ½·a·t²
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            সময় t = {state.time.toFixed(2)}s এ:
            <br />
            বেগ v = <span className="font-bold text-emerald-600 dark:text-emerald-400">{state.velocity.toFixed(2)} m/s</span>
            <br />
            সরণ s = <span className="font-bold text-cyan-600 dark:text-cyan-400">{Math.abs(state.displacement).toFixed(2)} m</span>
          </p>
        </div>
      </div>
    </div>
  );
}

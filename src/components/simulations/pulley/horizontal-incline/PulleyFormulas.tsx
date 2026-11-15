"use client";

import { PulleySimulationParams, PulleyPhysicsState } from "@/types/pulley";
import { BookOpen } from "lucide-react";

interface PulleyFormulasProps {
  params: PulleySimulationParams;
  state: PulleyPhysicsState;
}

export function PulleyFormulas({ params, state }: PulleyFormulasProps) {
  const isSmooth = params.friction === 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>পদার্থবিজ্ঞান সূত্র ও গাণিতিক বিশ্লেষণ (৯০° টেবিল কপিকল সমীকরণ)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Acceleration Formula */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ১. ত্বরণ নির্ণয় (Acceleration, a):
          </div>
          <div className="font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-blue-600 dark:text-blue-400">
            {isSmooth ? "a = [ m₁ / (m₁ + m₂) ] · g" : "a = [ m₁·g - μ·m₂·g ] / (m₁ + m₂)"}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            বর্তমান মান বসিয়ে:
            <br />
            {isSmooth ? (
              <>
                a = [ {params.m1} / ({params.m1} + {params.m2}) ] × {params.gravity}
                <br />
                a = ({params.m1} / {(params.m1 + params.m2).toFixed(1)}) × {params.gravity} ={" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {state.acceleration.toFixed(2)} m/s²
                </span>
              </>
            ) : (
              <>
                a = [ {params.m1}×{params.gravity} - {state.friction2.toFixed(2)} ] / ({params.m1} + {params.m2})
                <br />
                a = [ {state.drivingForce.toFixed(2)} - {state.friction2.toFixed(2)} ] / {(params.m1 + params.m2).toFixed(1)} ={" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {state.acceleration.toFixed(2)} m/s²
                </span>
              </>
            )}
          </p>
        </div>

        {/* Tension Formula */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ২. সুতার টান নির্ণয় (Rope Tension, T):
          </div>
          <div className="font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-amber-600 dark:text-amber-400">
            {isSmooth ? "T = [ (m₁·m₂) / (m₁ + m₂) ] · g" : "T = m₂·a + μ·m₂·g"}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            ভর m₂ এর ওপর প্রযুক্ত টান বল:
            <br />
            {isSmooth ? (
              <>
                T = [ ({params.m1} × {params.m2}) / ({params.m1} + {params.m2}) ] × {params.gravity}
                <br />
                T = ({(params.m1 * params.m2).toFixed(1)} / {(params.m1 + params.m2).toFixed(1)}) × {params.gravity} ={" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {state.tension.toFixed(2)} N
                </span>
              </>
            ) : (
              <>
                T = {params.m2} × {state.acceleration.toFixed(2)} + {state.friction2.toFixed(2)}
                <br />
                T = <span className="font-bold text-amber-600 dark:text-amber-400">{state.tension.toFixed(2)} N</span>
              </>
            )}
          </p>
        </div>

        {/* Free-Body Diagram Equations */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ৩. ফ্রি বডি ডায়াগ্রাম সমীকরণ (Equations of Motion):
          </div>
          <div className="space-y-1 font-mono text-zinc-700 dark:text-zinc-300">
            <div>ভর m₁ (উল্লম্ব): m₁·g - T = m₁·a</div>
            <div>ভর m₂ (অনুভূমিক): T - f₂ = m₂·a</div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            দুটি সমীকরণ যোগ করলে টান বল T বাতিল হয়ে সার্বিক ত্বরণ a পাওয়া যায়।
          </p>
        </div>

        {/* Speed & Displacement */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="font-semibold text-zinc-800 dark:text-zinc-200">
            ৪. m₁ এর বেগ ও সরণ (Speed & Displacement):
          </div>
          <div className="font-mono bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 text-purple-600 dark:text-purple-400">
            v = a·t &nbsp;|&nbsp; s = ½·a·t²
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            সময় t = {state.time.toFixed(2)}s এ:
            <br />
            v = {state.acceleration.toFixed(2)} × {state.time.toFixed(2)} ={" "}
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {state.velocity.toFixed(2)} m/s
            </span>
            <br />
            s = ½ × {state.acceleration.toFixed(2)} × ({state.time.toFixed(2)})² ={" "}
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {state.displacement.toFixed(2)} m
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

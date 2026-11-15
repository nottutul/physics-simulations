"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { DoublePulleyParams, DoublePulleyState } from "@/types/double-pulley";
import { calculateStaticDoublePulley, computeDoublePulleyStep } from "./physics";
import { DoublePulleyCanvas } from "./DoublePulleyCanvas";
import { DoublePulleyControls } from "./DoublePulleyControls";
import { DoublePulleyMetrics } from "./DoublePulleyMetrics";
import { DoublePulleyFormulas } from "./DoublePulleyFormulas";

export function DoublePulleySim() {
  const [params, setParams] = useState<DoublePulleyParams>({
    m1: 5,
    m: 1,
    m2: 2,
    friction: 0,
    gravity: 9.8,
  });

  const [showVectors, setShowVectors] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const [physicsState, setPhysicsState] = useState<DoublePulleyState>(() => {
    const staticCalc = calculateStaticDoublePulley({
      m1: 5,
      m: 1,
      m2: 2,
      friction: 0,
      gravity: 9.8,
    });
    return {
      ...staticCalc,
      time: 0,
      displacement: 0,
      velocity: 0,
      isMoving: false,
      hasReachedLimit: false,
    };
  });

  const stateRef = useRef(physicsState);
  const paramsRef = useRef(params);
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    stateRef.current = physicsState;
    paramsRef.current = params;
    isRunningRef.current = isRunning;
  });

  const handleChangeParams = useCallback((newParams: DoublePulleyParams) => {
    setParams(newParams);
    const staticCalc = calculateStaticDoublePulley(newParams);
    setPhysicsState((prev) => ({
      ...prev,
      ...staticCalc,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    const staticCalc = calculateStaticDoublePulley(paramsRef.current);
    setPhysicsState({
      ...staticCalc,
      time: 0,
      displacement: 0,
      velocity: 0,
      isMoving: false,
      hasReachedLimit: false,
    });
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (physicsState.hasReachedLimit) {
      handleReset();
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  }, [physicsState.hasReachedLimit, handleReset]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    const loop = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsedSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const dt = Math.min(elapsedSeconds, 0.05);

      if (isRunningRef.current && dt > 0) {
        const nextState = computeDoublePulleyStep(
          stateRef.current,
          paramsRef.current,
          dt
        );
        setPhysicsState(nextState);

        if (nextState.hasReachedLimit) {
          setIsRunning(false);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Main Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Visualizer */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <DoublePulleyCanvas
            params={params}
            state={physicsState}
            showVectors={showVectors}
          />

          {/* Motion Limit Reached Alert Box outside simulation canvas */}
          {physicsState.hasReachedLimit && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-red-900 dark:text-red-200 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <span>গতিসীমা সমাপ্ত (Limit reached) - পুনরায় চালাতে Reset চাপুন</span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                রিসেট
              </button>
            </div>
          )}
        </div>

        {/* Sliders & Controls */}
        <div className="lg:col-span-5">
          <DoublePulleyControls
            params={params}
            onChangeParams={handleChangeParams}
            isRunning={isRunning}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            showVectors={showVectors}
            onToggleVectors={() => setShowVectors((prev) => !prev)}
          />
        </div>
      </div>

      {/* Metrics Dashboard */}
      <DoublePulleyMetrics state={physicsState} params={params} />

      {/* Mathematical Formulas & Derivations */}
      <DoublePulleyFormulas params={params} state={physicsState} />
    </div>
  );
}

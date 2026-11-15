"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { PulleySimulationParams, PulleyPhysicsState } from "@/types/pulley";
import { calculateStaticPhysics, computeStep } from "./physics";
import { PulleyCanvas } from "./PulleyCanvas";
import { PulleyControls } from "./PulleyControls";
import { PulleyMetrics } from "./PulleyMetrics";
import { PulleyFormulas } from "./PulleyFormulas";

export function HorizontalInclineSim() {
  const [params, setParams] = useState<PulleySimulationParams>({
    m1: 5,
    m2: 3,
    angle: 90,
    friction: 0,
    gravity: 9.8,
  });

  const [showVectors, setShowVectors] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize initial physics state
  const [physicsState, setPhysicsState] = useState<PulleyPhysicsState>(() => {
    const staticCalc = calculateStaticPhysics({
      m1: 5,
      m2: 3,
      angle: 90,
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

  // Keep ref to avoid stale closures in requestAnimationFrame loop
  const stateRef = useRef(physicsState);
  const paramsRef = useRef(params);
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    stateRef.current = physicsState;
    paramsRef.current = params;
    isRunningRef.current = isRunning;
  });

  // Handle parameters update
  const handleChangeParams = useCallback((newParams: PulleySimulationParams) => {
    setParams(newParams);
    const staticCalc = calculateStaticPhysics(newParams);
    setPhysicsState((prev) => ({
      ...prev,
      ...staticCalc,
      // If reset or at start, keep time 0, otherwise adapt acceleration
    }));
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    const staticCalc = calculateStaticPhysics(paramsRef.current);
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
      // If at limit, reset before running
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

      // Cap delta time to avoid large jumps if tab was backgrounded
      const dt = Math.min(elapsedSeconds, 0.05);

      if (isRunningRef.current && dt > 0) {
        const nextState = computeStep(stateRef.current, paramsRef.current, dt);
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
      {/* Top Main Simulation Workspace: Canvas on Left/Center, Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Visualizer */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <PulleyCanvas
            params={params}
            state={physicsState}
            showVectors={showVectors}
          />

          {/* Motion Limit Reached Alert Box (outside simulation canvas) */}
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
          <PulleyControls
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
      <PulleyMetrics state={physicsState} params={params} />

      {/* Mathematical Formulas & Derivations */}
      <PulleyFormulas params={params} state={physicsState} />
    </div>
  );
}

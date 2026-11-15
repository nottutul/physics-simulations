"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  DoubleInclineParams,
  DoubleInclineState,
} from "@/types/double-incline-pulley";
import {
  calculateStaticDoubleIncline,
  computeDoubleInclineStep,
} from "./physics";
import { DoubleInclineCanvas } from "./DoubleInclineCanvas";
import { DoubleInclineControls } from "./DoubleInclineControls";
import { DoubleInclineMetrics } from "./DoubleInclineMetrics";
import { DoubleInclineFormulas } from "./DoubleInclineFormulas";
import { AlertCircle, RotateCcw } from "lucide-react";

export function DoubleInclineSim() {
  const [params, setParams] = useState<DoubleInclineParams>({
    m1: 5.0, // 5 kg on left incline (45°)
    m2: 5.0, // 5 kg on right incline (60°)
    friction: 0.0, // frictionless
    gravity: 9.8,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [showVectors, setShowVectors] = useState(true);

  const [physicsState, setPhysicsState] = useState<DoubleInclineState>(() => {
    const staticCalc = calculateStaticDoubleIncline({
      m1: 5.0,
      m2: 5.0,
      friction: 0.0,
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

  // Keep refs updated inside useEffect to avoid stale closures in requestAnimationFrame
  const stateRef = useRef(physicsState);
  const paramsRef = useRef(params);
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    stateRef.current = physicsState;
    paramsRef.current = params;
    isRunningRef.current = isRunning;
  });

  // Handle parameters update
  const handleChangeParams = useCallback((newParams: DoubleInclineParams) => {
    setParams(newParams);
    const staticCalc = calculateStaticDoubleIncline(newParams);
    setPhysicsState((prev) => ({
      ...prev,
      ...staticCalc,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    const staticCalc = calculateStaticDoubleIncline(paramsRef.current);
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

  const handleToggleVectors = useCallback(() => {
    setShowVectors((prev) => !prev);
  }, []);

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
        const nextState = computeDoubleInclineStep(
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

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Simulation Workspace Grid (Matching Height) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Canvas & Limit Alert Column (Left / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <DoubleInclineCanvas
            state={physicsState}
            params={params}
            showVectors={showVectors}
          />

          {/* Dedicated Limit Reached Box outside canvas */}
          {physicsState.hasReachedLimit && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-sm font-semibold">
                  গতিসীমা সমাপ্ত (Limit reached) - পুনরায় চালাতে Reset চাপুন
                </span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                রিসেট (Reset)
              </button>
            </div>
          )}
        </div>

        {/* Controls Column (Right / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <DoubleInclineControls
            params={params}
            onChangeParams={handleChangeParams}
            isRunning={isRunning}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            showVectors={showVectors}
            onToggleVectors={handleToggleVectors}
            className="h-full"
          />
        </div>
      </div>

      {/* Metrics Dashboard */}
      <DoubleInclineMetrics state={physicsState} />

      {/* Mathematical Formulas & Derivations (at the bottom) */}
      <DoubleInclineFormulas />
    </div>
  );
}

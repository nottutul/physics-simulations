"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  InclineHangingParams,
  InclineHangingState,
} from "@/types/incline-hanging-pulley";
import {
  calculateStaticInclineHanging,
  computeInclineHangingStep,
} from "./physics";
import { InclineHangingCanvas } from "./InclineHangingCanvas";
import { InclineHangingControls } from "./InclineHangingControls";
import { InclineHangingMetrics } from "./InclineHangingMetrics";
import { InclineHangingFormulas } from "./InclineHangingFormulas";
import { AlertCircle, RotateCcw } from "lucide-react";

export function InclineHangingSim() {
  const [params, setParams] = useState<InclineHangingParams>({
    m1: 5.0, // 5 kg on incline (as in user's diagram)
    m2: 4.0, // 4 kg hanging vertically (as in user's diagram)
    angle: 38, // 38 degrees (as in user's diagram)
    friction: 0.0, // frictionless
    gravity: 9.8,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [showVectors, setShowVectors] = useState(true);

  const [physicsState, setPhysicsState] = useState<InclineHangingState>(() => {
    const staticCalc = calculateStaticInclineHanging({
      m1: 5.0,
      m2: 4.0,
      angle: 38,
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

  // Keep refs to avoid stale closures in requestAnimationFrame loop
  const stateRef = useRef(physicsState);
  const paramsRef = useRef(params);
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    stateRef.current = physicsState;
    paramsRef.current = params;
    isRunningRef.current = isRunning;
  });

  // Handle parameters update (keeping angle fixed at 38°)
  const handleChangeParams = useCallback((newParams: InclineHangingParams) => {
    const updated = { ...newParams, angle: 38 };
    setParams(updated);
    const staticCalc = calculateStaticInclineHanging(updated);
    setPhysicsState((prev) => ({
      ...prev,
      ...staticCalc,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    const staticCalc = calculateStaticInclineHanging({
      ...paramsRef.current,
      angle: 38,
    });
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
        const nextState = computeInclineHangingStep(
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
      {/* Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Canvas & Limit Alert Column (Left / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <InclineHangingCanvas
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
          <InclineHangingControls
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
      <InclineHangingMetrics state={physicsState} />

      {/* Mathematical Formulas & Derivations (at the bottom) */}
      <InclineHangingFormulas />
    </div>
  );
}

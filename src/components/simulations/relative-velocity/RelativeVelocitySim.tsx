"use client";

import { useState, useMemo, useCallback } from "react";
import {
  RelativeVelocityParams,
  RelativeVelocityCalculations,
} from "@/types/relative-velocity";
import { calculateRelativeVelocity } from "./physics";
import { RelativeVelocityCanvas } from "./RelativeVelocityCanvas";
import { RelativeVelocityControls } from "./RelativeVelocityControls";
import { VectorDiagram } from "./VectorDiagram";
import { GlassWettingBadge } from "./GlassWettingBadge";
import { RelativeVelocityMetrics } from "./RelativeVelocityMetrics";
import { RelativeVelocityFormulas } from "./RelativeVelocityFormulas";

export function RelativeVelocitySim() {
  const [params, setParams] = useState<RelativeVelocityParams>({
    busSpeed: 10.0,
    busDirection: "right",
    windSpeed: 10.0,
    windDirection: "right",
    rainSpeed: 10.0,
    windshieldAngle: 30, // Constant aerodynamic windshield tilt
    frame: "bus", // Default to bus frame to immediately show relative velocity effect
    showRainDrops: true,
    showResultantVector: true,
    showVectorValues: false,
    showParallelogram: true,
    showGrid: true,
    showCalculations: true,
  });

  const [isRunning, setIsRunning] = useState(true);

  // Derive physics calculations reactively
  const calcs: RelativeVelocityCalculations = useMemo(() => {
    return calculateRelativeVelocity(params);
  }, [params]);

  const handleChangeParams = useCallback(
    (newParams: Partial<RelativeVelocityParams>) => {
      setParams((prev) => ({ ...prev, ...newParams, windshieldAngle: 30 }));
    },
    []
  );

  const handleTogglePlay = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setParams({
      busSpeed: 10.0,
      busDirection: "right",
      windSpeed: 10.0,
      windDirection: "right",
      rainSpeed: 10.0,
      windshieldAngle: 30,
      frame: "bus",
      showRainDrops: true,
      showResultantVector: true,
      showVectorValues: false,
      showParallelogram: true,
      showGrid: true,
      showCalculations: true,
    });
    setIsRunning(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Main Canvas, then Vector Diagram, then Glass Wetting Status (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Main Visual Simulation Canvas */}
          <RelativeVelocityCanvas
            params={params}
            calcs={calcs}
            isRunning={isRunning}
          />

          {/* 2. Vector Diagram Box (main canvas এর নিচেই) */}
          <VectorDiagram
            params={params}
            calcs={calcs}
          />

          {/* 3. Glass Wetting Status (then Glass Wetting Status) */}
          <GlassWettingBadge calcs={calcs} />
        </div>

        {/* Right Column: Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <RelativeVelocityControls
            params={params}
            onChangeParams={handleChangeParams}
            isRunning={isRunning}
            onTogglePlay={handleTogglePlay}
            onReset={handleReset}
            className="h-full"
          />
        </div>
      </div>

      {/* Live Metrics Dashboard */}
      <RelativeVelocityMetrics params={params} calcs={calcs} />

      {/* Complete Physics & Mathematical Derivations */}
      {params.showCalculations && <RelativeVelocityFormulas />}
    </div>
  );
}

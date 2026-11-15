"use client";

import { useEffect, useRef } from "react";
import { AtwoodParams, AtwoodState } from "@/types/atwood-machine";

interface AtwoodCanvasProps {
  state: AtwoodState;
  params: AtwoodParams;
  showVectors?: boolean;
  isDark?: boolean;
}

export function AtwoodCanvas({
  state,
  params,
  showVectors = true,
  isDark = false,
}: AtwoodCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = 720;
    const height = 500;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Color definitions
    const bgColor = isDark ? "#0f172a" : "#ffffff";
    const groundLine = isDark ? "#475569" : "#334155";
    const stringColor = isDark ? "#38bdf8" : "#0284c7";
    const pulleyBorder = isDark ? "#cbd5e1" : "#1e293b";
    const pulleyInner = isDark ? "#1e293b" : "#f8fafc";
    const dimTextColor = isDark ? "#94a3b8" : "#64748b";

    // Mass colors
    const m1Color = isDark ? "#2563eb" : "#3b82f6"; // Blue
    const m1Border = isDark ? "#60a5fa" : "#1d4ed8";
    const m2Color = isDark ? "#9333ea" : "#a855f7"; // Purple
    const m2Border = isDark ? "#c084fc" : "#7e22ce";

    // Vector colors
    const tensionColor = "#f59e0b"; // Amber
    const gravityColor = "#ef4444"; // Red

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Layout coordinates
    const pulleyCenterX = 360;
    const pulleyCenterY = 115;
    const pulleyRadius = 46;
    const groundY = 430;

    // Width is constant; height scales with mass
    const m1Width = 84;
    const m1Height = Math.min(110, Math.max(38, 32 + params.m1 * 5.0));
    const m2Width = 84;
    const m2Height = Math.min(110, Math.max(38, 32 + params.m2 * 5.0));
    const cornerRadius = 6;

    // Visual scale: initial height h corresponds to ~150 pixels above ground
    const maxVisualHeightPx = 150;
    const pxPerMeter = maxVisualHeightPx / params.initialHeight;

    // Initial positions:
    // m1 initial bottom is at groundY - maxVisualHeightPx
    const m1InitialY = groundY - maxVisualHeightPx - m1Height / 2;
    // In diagram, m2 starts higher than m1
    const m2InitialY = pulleyCenterY + 120;

    // Current positions:
    // displacement is positive when m1 moves down
    const dPx = state.displacement * pxPerMeter;
    const m1Y = m1InitialY + dPx;
    const m2Y = m2InitialY - dPx;

    const leftRopeX = pulleyCenterX - pulleyRadius;
    const rightRopeX = pulleyCenterX + pulleyRadius;

    // --- 1. Draw Ceiling Mount for Pulley ---
    ctx.save();
    ctx.strokeStyle = pulleyBorder;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";

    // Top ceiling bracket line
    ctx.beginPath();
    ctx.moveTo(pulleyCenterX - 30, 25);
    ctx.lineTo(pulleyCenterX + 30, 25);
    ctx.stroke();

    // Ceiling hatch marks
    ctx.lineWidth = 1.5;
    for (let x = pulleyCenterX - 25; x <= pulleyCenterX + 25; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 25);
      ctx.lineTo(x + 8, 15);
      ctx.stroke();
    }

    // Bracket hanger down to pulley center
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(pulleyCenterX, 25);
    ctx.lineTo(pulleyCenterX, pulleyCenterY);
    ctx.stroke();
    ctx.restore();

    // --- 2. Draw Ground at Bottom (with hatch marks) ---
    ctx.save();
    ctx.strokeStyle = groundLine;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Ground surface
    ctx.beginPath();
    ctx.moveTo(120, groundY);
    ctx.lineTo(600, groundY);
    ctx.stroke();

    // Hatch marks
    ctx.lineWidth = 1.5;
    for (let x = 130; x <= 590; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x - 12, groundY + 12);
      ctx.stroke();
    }
    ctx.restore();

    // --- 3. Draw Strings (Ropes) ---
    ctx.save();
    ctx.strokeStyle = stringColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Left rope: straight down to top center of m2
    ctx.beginPath();
    ctx.moveTo(leftRopeX, pulleyCenterY);
    ctx.lineTo(leftRopeX, m2Y - m2Height / 2);
    ctx.stroke();

    // Right rope: straight down to top center of m1
    ctx.beginPath();
    ctx.moveTo(rightRopeX, pulleyCenterY);
    ctx.lineTo(rightRopeX, m1Y - m1Height / 2);
    ctx.stroke();

    // Wrap arc over top of pulley (from left PI to right 0 / 2*PI)
    ctx.beginPath();
    ctx.arc(pulleyCenterX, pulleyCenterY, pulleyRadius, Math.PI, 0, false);
    ctx.stroke();
    ctx.restore();

    // --- 4. Draw Pulley Wheel (with Hatched Rim like diagram) ---
    ctx.save();
    ctx.translate(pulleyCenterX, pulleyCenterY);

    const rimWidth = 10;
    const innerRadius = pulleyRadius - rimWidth;

    // Outer rim
    ctx.fillStyle = isDark ? "#1e293b" : "#f1f5f9";
    ctx.strokeStyle = pulleyBorder;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, pulleyRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cross-hatched pattern on outer rim (like user diagram)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, pulleyRadius, 0, Math.PI * 2);
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true);
    ctx.clip();

    ctx.strokeStyle = isDark ? "#475569" : "#94a3b8";
    ctx.lineWidth = 1.5;
    for (let d = -pulleyRadius * 2; d <= pulleyRadius * 2; d += 8) {
      ctx.beginPath();
      ctx.moveTo(d, -pulleyRadius);
      ctx.lineTo(d + pulleyRadius, pulleyRadius);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(d, pulleyRadius);
      ctx.lineTo(d + pulleyRadius, -pulleyRadius);
      ctx.stroke();
    }
    ctx.restore();

    // Inner wheel circle
    ctx.fillStyle = pulleyInner;
    ctx.strokeStyle = pulleyBorder;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rotating spokes
    const rotationAngle = (state.displacement * pxPerMeter) / pulleyRadius;
    ctx.rotate(rotationAngle);
    ctx.strokeStyle = pulleyBorder;
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const spkAngle = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(spkAngle) * (innerRadius - 2),
        Math.sin(spkAngle) * (innerRadius - 2)
      );
      ctx.stroke();
    }

    // Axle dot
    ctx.fillStyle = pulleyBorder;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- 5. Draw Block m2 (Left - Purple) ---
    ctx.save();
    ctx.fillStyle = m2Color;
    ctx.strokeStyle = m2Border;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(
      leftRopeX - m2Width / 2,
      m2Y - m2Height / 2,
      m2Width,
      m2Height,
      cornerRadius
    );
    ctx.fill();
    ctx.stroke();

    // Text inside block m2: "m₂ = X kg"
    ctx.font = "bold 13px 'Google Sans', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`m₂ = ${params.m2} kg`, leftRopeX, m2Y);
    ctx.restore();

    // --- 6. Draw Block m1 (Right - Blue) ---
    ctx.save();
    ctx.fillStyle = m1Color;
    ctx.strokeStyle = m1Border;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(
      rightRopeX - m1Width / 2,
      m1Y - m1Height / 2,
      m1Width,
      m1Height,
      cornerRadius
    );
    ctx.fill();
    ctx.stroke();

    // Text inside block m1: "m₁ = X kg"
    ctx.font = "bold 13px 'Google Sans', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`m₁ = ${params.m1} kg`, rightRopeX, m1Y);
    ctx.restore();

    // --- 7. Force Vectors (when showVectors is true) ---
    if (showVectors) {
      const drawArrow = (
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        color: string,
        label?: string,
        labelPos: "tip" | "side" = "side",
        sideOffset = 14
      ) => {
        const headLen = 9;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headLen * Math.cos(angle - Math.PI / 6),
          toY - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - headLen * Math.cos(angle + Math.PI / 6),
          toY - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        if (label) {
          ctx.font = "bold 13px 'Google Sans', sans-serif";
          if (labelPos === "tip") {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(label, toX, toY + 6);
          } else {
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            const normAngle = angle + Math.PI / 2;
            const textX = midX + Math.cos(normAngle) * sideOffset;
            const textY = midY + Math.sin(normAngle) * sideOffset;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, textX, textY);
          }
        }
        ctx.restore();
      };

      // Tension T on left rope (upwards)
      const tLen = 38;
      drawArrow(
        leftRopeX,
        m2Y - m2Height / 2,
        leftRopeX,
        m2Y - m2Height / 2 - tLen,
        tensionColor,
        "T",
        "side",
        -14
      );

      // Gravity m2g (downwards)
      const g2Len = 42;
      drawArrow(
        leftRopeX,
        m2Y + m2Height / 2,
        leftRopeX,
        m2Y + m2Height / 2 + g2Len,
        gravityColor,
        "m₂g",
        "tip"
      );

      // Tension T on right rope (upwards)
      drawArrow(
        rightRopeX,
        m1Y - m1Height / 2,
        rightRopeX,
        m1Y - m1Height / 2 - tLen,
        tensionColor,
        "T",
        "side",
        14
      );

      // Gravity m1g (downwards)
      const g1Len = 42;
      drawArrow(
        rightRopeX,
        m1Y + m1Height / 2,
        rightRopeX,
        m1Y + m1Height / 2 + g1Len,
        gravityColor,
        "m₁g",
        "tip"
      );
    }

    // Motion indicator
    if (state.isMoving) {
      ctx.save();
      const motionText =
        state.velocity > 0
          ? "গতি: m₁ নিচে নামছে (m₁ ↓, m₂ ↑)"
          : "গতি: m₂ নিচে নামছে (m₂ ↓, m₁ ↑)";
      ctx.font = "13px 'Hind Siliguri', sans-serif";
      ctx.fillStyle = dimTextColor;
      ctx.textAlign = "center";
      ctx.fillText(motionText, width / 2, 40);
      ctx.restore();
    }
  }, [state, params, showVectors, isDark]);

  return (
    <div className="relative w-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", maxWidth: "720px", height: "auto", aspectRatio: "720/500" }}
        className="block"
      />
    </div>
  );
}

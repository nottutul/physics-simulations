"use client";

import { useEffect, useRef } from "react";
import { DoubleInclineParams, DoubleInclineState } from "@/types/double-incline-pulley";
import { calculateDoubleInclineLimits, RAD_1, RAD_2, SIN_1, COS_1, SIN_2, COS_2 } from "./physics";

interface DoubleInclineCanvasProps {
  state: DoubleInclineState;
  params: DoubleInclineParams;
  showVectors?: boolean;
  isDark?: boolean;
}

export function DoubleInclineCanvas({
  state,
  params,
  showVectors = true,
  isDark = false,
}: DoubleInclineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // HiDPI support
    const dpr = window.devicePixelRatio || 1;
    const width = 720;
    const height = 500;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Styling colors
    const bgColor = isDark ? "#0f172a" : "#ffffff";
    const wedgeStroke = isDark ? "#f1f5f9" : "#0f172a";
    const wedgeFill = isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(241, 245, 249, 0.5)";
    const dashedLine = isDark ? "#475569" : "#94a3b8";
    const stringColor = isDark ? "#38bdf8" : "#0284c7";
    const pulleyBorder = isDark ? "#cbd5e1" : "#1e293b";
    const pulleyInner = isDark ? "#1e293b" : "#f8fafc";
    const textColor = isDark ? "#f8fafc" : "#0f172a";
    const dimTextColor = isDark ? "#94a3b8" : "#64748b";

    // Mass colors
    const m1Color = isDark ? "#2563eb" : "#3b82f6"; // Blue
    const m1Border = isDark ? "#60a5fa" : "#1d4ed8";
    const m2Color = isDark ? "#9333ea" : "#a855f7"; // Purple
    const m2Border = isDark ? "#c084fc" : "#7e22ce";

    // Vector colors
    const tensionColor = "#f59e0b"; // Amber
    const normalColor = "#10b981"; // Emerald
    const gravityColor = "#ef4444"; // Red

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Limits & Dimensions from physics engine
    const limits = calculateDoubleInclineLimits(params);
    const {
      leftX,
      apexX,
      rightX,
      baseY,
      apexY,
      pulleyRadius,
      pulleyCenterX,
      pulleyCenterY,
      m1Width,
      m1Height,
      m2Width,
      m2Height,
      s1_0,
      s2_0,
      pxPerMeter,
    } = limits;

    const m1Length = m1Width;
    const m2Length = m2Width;
    const cornerRadius = 6;

    // Unit vectors for left slope (45°: downwards to the left):
    const uPar1X = -COS_1;
    const uPar1Y = SIN_1;
    const uPerp1X = -SIN_1;
    const uPerp1Y = -COS_1;

    // Unit vectors for right slope (60°: downwards to the right):
    const uPar2X = COS_2;
    const uPar2Y = SIN_2;
    const uPerp2X = SIN_2;
    const uPerp2Y = -COS_2;

    // --- 1. Draw Double Incline Wedge ---
    ctx.save();
    ctx.fillStyle = wedgeFill;
    ctx.strokeStyle = wedgeStroke;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "miter";

    ctx.beginPath();
    ctx.moveTo(leftX, baseY);
    ctx.lineTo(apexX, apexY);
    ctx.lineTo(rightX, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center vertical dashed altitude line (from apex to base)
    ctx.save();
    ctx.strokeStyle = dashedLine;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(apexX, baseY);
    ctx.stroke();
    ctx.restore();

    // Left Angle Arc (45°)
    const arc1R = 44;
    ctx.lineWidth = 2;
    ctx.strokeStyle = wedgeStroke;
    ctx.beginPath();
    ctx.arc(leftX, baseY, arc1R, -RAD_1, 0, false);
    ctx.stroke();

    ctx.font = "bold 15px 'Google Sans', sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("45°", leftX + arc1R + 8, baseY - 4);

    // Right Angle Arc (60°)
    const arc2R = 40;
    ctx.beginPath();
    ctx.arc(rightX, baseY, arc2R, Math.PI, Math.PI + RAD_2, false);
    ctx.stroke();

    ctx.textAlign = "right";
    ctx.fillText("60°", rightX - arc2R - 8, baseY - 4);
    ctx.restore();

    // --- 2. Pulley Mount Bracket ---
    ctx.save();
    ctx.strokeStyle = pulleyBorder;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(pulleyCenterX, pulleyCenterY);
    ctx.stroke();
    ctx.restore();

    // --- 3. Compute Synchronized Block Positions ---
    const dPx = state.displacement * pxPerMeter;

    // m1 position along left slope:
    const m1Dist = s1_0 - dPx;
    const m1CenterX = apexX + m1Dist * uPar1X + (m1Height / 2) * uPerp1X;
    const m1CenterY = apexY + m1Dist * uPar1Y + (m1Height / 2) * uPerp1Y;

    // TOP CORNER of m1 facing apex (uphill):
    const m1TopCornerX =
      apexX + (m1Dist - m1Length / 2) * uPar1X + m1Height * uPerp1X;
    const m1TopCornerY =
      apexY + (m1Dist - m1Length / 2) * uPar1Y + m1Height * uPerp1Y;

    // m2 position along right slope:
    const m2Dist = s2_0 + dPx;
    const m2CenterX = apexX + m2Dist * uPar2X + (m2Height / 2) * uPerp2X;
    const m2CenterY = apexY + m2Dist * uPar2Y + (m2Height / 2) * uPerp2Y;

    // TOP CORNER of m2 facing apex (uphill):
    const m2TopCornerX =
      apexX + (m2Dist - m2Length / 2) * uPar2X + m2Height * uPerp2X;
    const m2TopCornerY =
      apexY + (m2Dist - m2Length / 2) * uPar2Y + m2Height * uPerp2Y;

    // Pulley tangent points for each slope:
    const leftTangentX = pulleyCenterX + pulleyRadius * uPerp1X;
    const leftTangentY = pulleyCenterY + pulleyRadius * uPerp1Y;
    const rightTangentX = pulleyCenterX + pulleyRadius * uPerp2X;
    const rightTangentY = pulleyCenterY + pulleyRadius * uPerp2Y;

    // --- 4. Draw Strings (Ropes) ---
    ctx.save();
    ctx.strokeStyle = stringColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Left rope: straight line from leftTangent to TOP CORNER of m1 (strictly parallel to 45° slope)
    ctx.beginPath();
    ctx.moveTo(leftTangentX, leftTangentY);
    ctx.lineTo(m1TopCornerX, m1TopCornerY);
    ctx.stroke();

    // Right rope: straight line from rightTangent to TOP CORNER of m2 (strictly parallel to 60° slope)
    ctx.beginPath();
    ctx.moveTo(rightTangentX, rightTangentY);
    ctx.lineTo(m2TopCornerX, m2TopCornerY);
    ctx.stroke();

    // Wrap arc over pulley wheel
    const leftAngle = Math.atan2(leftTangentY - pulleyCenterY, leftTangentX - pulleyCenterX);
    const rightAngle = Math.atan2(rightTangentY - pulleyCenterY, rightTangentX - pulleyCenterX);
    ctx.beginPath();
    ctx.arc(pulleyCenterX, pulleyCenterY, pulleyRadius, leftAngle, rightAngle, false);
    ctx.stroke();
    ctx.restore();

    // --- 5. Draw Pulley Wheel ---
    ctx.save();
    ctx.translate(pulleyCenterX, pulleyCenterY);

    ctx.fillStyle = pulleyInner;
    ctx.strokeStyle = pulleyBorder;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, pulleyRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rotate spokes
    const rotationAngle = (state.displacement * pxPerMeter) / pulleyRadius;
    ctx.rotate(rotationAngle);
    ctx.strokeStyle = pulleyBorder;
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const spkAngle = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(spkAngle) * (pulleyRadius - 2),
        Math.sin(spkAngle) * (pulleyRadius - 2)
      );
      ctx.stroke();
    }

    // Axle dot
    ctx.fillStyle = pulleyBorder;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- 6. Draw Block m1 (Left 45° Incline) ---
    ctx.save();
    ctx.translate(m1CenterX, m1CenterY);
    ctx.rotate(Math.PI - RAD_1); // Align with 45° downward left slope

    ctx.fillStyle = m1Color;
    ctx.strokeStyle = m1Border;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(
      -m1Length / 2,
      -m1Height / 2,
      m1Length,
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
    ctx.fillText(`m₁ = ${params.m1} kg`, 0, 0);
    ctx.restore();

    // --- 7. Draw Block m2 (Right 60° Incline) ---
    ctx.save();
    ctx.translate(m2CenterX, m2CenterY);
    ctx.rotate(RAD_2); // Align with 60° downward right slope

    ctx.fillStyle = m2Color;
    ctx.strokeStyle = m2Border;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(
      -m2Length / 2,
      -m2Height / 2,
      m2Length,
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
    ctx.fillText(`m₂ = ${params.m2} kg`, 0, 0);
    ctx.restore();

    // Helper for vector arrows
    const drawArrow = (
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      color: string,
      label?: string,
      labelPos: "tip" | "above-tip" | "side" = "side",
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
        if (labelPos === "above-tip") {
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(label, toX, toY - 6);
        } else if (labelPos === "tip") {
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

    // --- 8. Force Vectors (when showVectors is true) ---
    if (showVectors) {
      // Left Block m1 Vectors:
      // Tension T pointing UP the left incline from top corner
      const t1Len = 38;
      drawArrow(
        m1TopCornerX,
        m1TopCornerY,
        m1TopCornerX - t1Len * uPar1X,
        m1TopCornerY - t1Len * uPar1Y,
        tensionColor,
        "T",
        "side",
        -14
      );

      // Normal Force N1 perpendicular to 45° slope from top surface
      const n1Len = 42;
      const n1FromX = m1CenterX + (m1Height / 2) * uPerp1X;
      const n1FromY = m1CenterY + (m1Height / 2) * uPerp1Y;
      const n1ToX = n1FromX + n1Len * uPerp1X;
      const n1ToY = n1FromY + n1Len * uPerp1Y;
      drawArrow(n1FromX, n1FromY, n1ToX, n1ToY, normalColor, "N₁", "above-tip");

      // Gravity m1g pointing straight down from center
      const g1Len = 46;
      drawArrow(
        m1CenterX,
        m1CenterY,
        m1CenterX,
        m1CenterY + g1Len,
        gravityColor,
        "m₁g",
        "tip"
      );

      // Right Block m2 Vectors:
      // Tension T pointing UP the right incline from top corner
      const t2Len = 38;
      drawArrow(
        m2TopCornerX,
        m2TopCornerY,
        m2TopCornerX - t2Len * uPar2X,
        m2TopCornerY - t2Len * uPar2Y,
        tensionColor,
        "T",
        "side",
        14
      );

      // Normal Force N2 perpendicular to 60° slope from top surface
      const n2Len = 42;
      const n2FromX = m2CenterX + (m2Height / 2) * uPerp2X;
      const n2FromY = m2CenterY + (m2Height / 2) * uPerp2Y;
      const n2ToX = n2FromX + n2Len * uPerp2X;
      const n2ToY = n2FromY + n2Len * uPerp2Y;
      drawArrow(n2FromX, n2FromY, n2ToX, n2ToY, normalColor, "N₂", "above-tip");

      // Gravity m2g pointing straight down from center
      const g2Len = 46;
      drawArrow(
        m2CenterX,
        m2CenterY,
        m2CenterX,
        m2CenterY + g2Len,
        gravityColor,
        "m₂g",
        "tip"
      );
    }

    // Motion direction label if moving
    if (state.isMoving) {
      ctx.save();
      const motionText =
        state.velocity > 0
          ? "গতি: ৬০° নততল বরাবর নিচে ↘"
          : "গতি: ৪৫° নততল বরাবর নিচে ↙";
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

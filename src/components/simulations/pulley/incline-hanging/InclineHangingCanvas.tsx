"use client";

import { useEffect, useRef } from "react";
import { InclineHangingParams, InclineHangingState } from "@/types/incline-hanging-pulley";
import { calculateInclineHangingLimits } from "./physics";

interface InclineHangingCanvasProps {
  state: InclineHangingState;
  params: InclineHangingParams;
  showVectors?: boolean;
  isDark?: boolean;
}

export function InclineHangingCanvas({
  state,
  params,
  showVectors = true,
  isDark = false,
}: InclineHangingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = 720;
    const height = 500;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Color definitions
    const bgColor = isDark ? "#0f172a" : "#ffffff";
    const wedgeStroke = isDark ? "#f1f5f9" : "#0f172a";
    const wedgeFill = isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(241, 245, 249, 0.5)";
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

    // Dynamic Geometry & Limits from Physics Engine
    const limits = calculateInclineHangingLimits(params);
    const apexX = 280;
    const apexY = 130;
    const baseY = limits.baseY;
    const cornerRightX = limits.cornerRightX;
    const slopeAngle = limits.slopeAngle;

    const uParX = limits.uParX;
    const uParY = limits.uParY;
    const uPerpX = limits.uPerpX;
    const uPerpY = limits.uPerpY;

    // Block Dimensions: length scales with mass, height is constant
    const m1Length = limits.m1Width;
    const m1Height = limits.m1Height;
    const m2Width = limits.m2Width;
    const m2Height = limits.m2Height;
    const cornerRadius = 6;

    // Pulley coordinates
    const pulleyRadius = limits.pulleyRadius;
    const m2HangingX = limits.m2HangingX;
    const pulleyCenterX = limits.pulleyCenterX;
    const pulleyCenterY = limits.pulleyCenterY;

    // Tangent point on pulley: exactly m1Height above incline plane
    const rightTangentX = pulleyCenterX + pulleyRadius * uPerpX;
    const rightTangentY = pulleyCenterY + pulleyRadius * uPerpY;

    // --- 1. Draw Incline Wedge (Right Triangle) ---
    ctx.save();
    ctx.fillStyle = wedgeFill;
    ctx.strokeStyle = wedgeStroke;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "miter";

    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(cornerRightX, baseY);
    ctx.lineTo(apexX, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right angle mark at bottom-left corner
    const raSize = 16;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(apexX, baseY - raSize);
    ctx.lineTo(apexX + raSize, baseY - raSize);
    ctx.lineTo(apexX + raSize, baseY);
    ctx.stroke();

    // Angle arc at bottom-right corner
    const arcRadius = 45;
    ctx.lineWidth = 2;
    ctx.strokeStyle = wedgeStroke;
    ctx.beginPath();
    ctx.arc(cornerRightX, baseY, arcRadius, Math.PI, Math.PI + slopeAngle, false);
    ctx.stroke();

    // Angle text: "38°" (Google Sans font)
    ctx.font = "bold 15px 'Google Sans', sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(`${Math.round(params.angle)}°`, cornerRightX - arcRadius - 8, baseY - 6);
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

    // --- 3. Compute Block Positions ---
    const m1Dist = limits.s1_0 + state.displacement * limits.pxPerMeter;

    // Center of block m1 in world coordinates:
    const m1CenterX = apexX + m1Dist * uParX + (m1Height / 2) * uPerpX;
    const m1CenterY = apexY + m1Dist * uParY + (m1Height / 2) * uPerpY;

    // TOP CORNER of m1 facing the pulley (where rope connects):
    const m1TopCornerX =
      apexX + (m1Dist - m1Length / 2) * uParX + m1Height * uPerpX;
    const m1TopCornerY =
      apexY + (m1Dist - m1Length / 2) * uParY + m1Height * uPerpY;

    // m2 vertical hanging position:
    const m2Y = limits.Y_m2_0 - state.displacement * limits.pxPerMeter;
    const m2Top = m2Y - m2Height / 2;

    // --- 4. Draw Strings (Ropes) ---
    ctx.save();
    ctx.strokeStyle = stringColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Left vertical rope: from pulley left tangent to top center of m2
    ctx.beginPath();
    ctx.moveTo(m2HangingX, pulleyCenterY);
    ctx.lineTo(m2HangingX, m2Top);
    ctx.stroke();

    // Pulley rope wrap arc
    ctx.beginPath();
    ctx.arc(
      pulleyCenterX,
      pulleyCenterY,
      pulleyRadius,
      Math.PI,
      1.5 * Math.PI + slopeAngle,
      false
    );
    ctx.stroke();

    // Incline rope: straight line from rightTangent to the TOP CORNER of m1
    // (100% strictly parallel to the incline plane at all times)
    ctx.beginPath();
    ctx.moveTo(rightTangentX, rightTangentY);
    ctx.lineTo(m1TopCornerX, m1TopCornerY);
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

    // Rotate spokes with displacement
    const rotationAngle = (state.displacement * limits.pxPerMeter) / pulleyRadius;
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

    // --- 6. Draw Block m2 (Vertical Hanging) ---
    ctx.save();
    ctx.fillStyle = m2Color;
    ctx.strokeStyle = m2Border;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(
      m2HangingX - m2Width / 2,
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
    ctx.fillText(`m₂ = ${params.m2} kg`, m2HangingX, m2Y);
    ctx.restore();

    // --- 7. Draw Block m1 (On Incline) ---
    ctx.save();
    ctx.translate(m1CenterX, m1CenterY);
    ctx.rotate(slopeAngle);

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

    // --- 8. Force Vectors (when showVectors is true) ---
    if (showVectors) {
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

      // m2 Vectors:
      // Tension T pointing UP
      const m2TArrowLen = 38;
      drawArrow(
        m2HangingX,
        m2Top,
        m2HangingX,
        m2Top - m2TArrowLen,
        tensionColor,
        "T",
        "side",
        -14
      );

      // Gravity m2g pointing DOWN
      const m2GArrowLen = 42;
      drawArrow(
        m2HangingX,
        m2Y + m2Height / 2,
        m2HangingX,
        m2Y + m2Height / 2 + m2GArrowLen,
        gravityColor,
        "m₂g",
        "tip"
      );

      // m1 Vectors:
      // Tension T pointing UP the incline from the top corner along the rope
      const m1TArrowLen = 38;
      drawArrow(
        m1TopCornerX,
        m1TopCornerY,
        m1TopCornerX - m1TArrowLen * uParX,
        m1TopCornerY - m1TArrowLen * uParY,
        tensionColor,
        "T",
        "side",
        -14
      );

      // Normal force N: perpendicular to incline from top surface
      const m1NArrowLen = 42;
      const nFromX = m1CenterX + (m1Height / 2) * uPerpX;
      const nFromY = m1CenterY + (m1Height / 2) * uPerpY;
      const nToX = nFromX + m1NArrowLen * uPerpX;
      const nToY = nFromY + m1NArrowLen * uPerpY;
      drawArrow(nFromX, nFromY, nToX, nToY, normalColor, "N", "above-tip");

      // Gravity m1g pointing straight down from center
      const m1GArrowLen = 46;
      drawArrow(
        m1CenterX,
        m1CenterY,
        m1CenterX,
        m1CenterY + m1GArrowLen,
        gravityColor,
        "m₁g",
        "tip"
      );
    }

    // Direction indicator text if moving
    if (state.isMoving) {
      ctx.save();
      const motionText =
        state.velocity > 0 ? "গতি: নততল বেয়ে নিচে ↘" : "গতি: নততল বেয়ে উপরে ↖";
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

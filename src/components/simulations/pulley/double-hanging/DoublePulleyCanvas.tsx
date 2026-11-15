"use client";

import { useEffect, useRef } from "react";
import { DoublePulleyParams, DoublePulleyState } from "@/types/double-pulley";
import { MAX_TRAVEL } from "./physics";

interface DoublePulleyCanvasProps {
  params: DoublePulleyParams;
  state: DoublePulleyState;
  showVectors: boolean;
}

export function DoublePulleyCanvas({
  params,
  state,
  showVectors,
}: DoublePulleyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const width = 760;
    const height = 440;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Theme & colors
    const isDark = document.documentElement.classList.contains("dark");
    const strokeColor = isDark ? "#e4e4e7" : "#18181b";
    const tableLine = isDark ? "#52525b" : "#71717a";
    // Sidelines are black/dark zinc, exactly matching the top table line
    const ropeColor = isDark ? "#38bdf8" : "#0284c7";
    const vectorColor = "#f59e0b"; // Amber tension arrows
    const vectorGravity = "#ef4444";

    // Geometry
    const pulleyRadius = 22;
    const tableY = 140;
    const leftPulleyX = 170;
    const rightPulleyX = 590;
    const pulleyCenterY = tableY - pulleyRadius;

    // Sidelines (black as the top line, extending down from table ends)
    const legLength = 250;
    ctx.lineWidth = 3;
    ctx.strokeStyle = tableLine;
    ctx.lineCap = "round";
    ctx.lineJoin = "miter";

    // Horizontal table top
    ctx.beginPath();
    ctx.moveTo(leftPulleyX, tableY);
    ctx.lineTo(rightPulleyX, tableY);
    ctx.stroke();

    // Left sideline (black as top line)
    ctx.beginPath();
    ctx.moveTo(leftPulleyX, tableY);
    ctx.lineTo(leftPulleyX, tableY + legLength);
    ctx.stroke();

    // Right sideline (black as top line)
    ctx.beginPath();
    ctx.moveTo(rightPulleyX, tableY);
    ctx.lineTo(rightPulleyX, tableY + legLength);
    ctx.stroke();

    // Table hatching / texture under table top
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isDark ? "#3f3f46" : "#d4d4d8";
    for (let x = leftPulleyX + 25; x < rightPulleyX - 20; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, tableY);
      ctx.lineTo(x - 12, tableY + 12);
      ctx.stroke();
    }

    // Displacement mapping: positive = rightward motion
    const maxPixelTravel = 110;
    const travelPixels = (state.displacement / MAX_TRAVEL) * maxPixelTravel;

    // Middle mass m on table
    const mWidth = Math.min(94, Math.max(78, 70 + params.m * 2));
    const mHeight = 44;
    const mInitialX = (leftPulleyX + rightPulleyX) / 2 - mWidth / 2;
    const mX = mInitialX + travelPixels;
    const mY = tableY - mHeight;

    // Left mass m2 (hangs off left pulley)
    const m2Width = Math.min(104, Math.max(84, 76 + params.m2 * 2));
    const m2Height = 48;
    const m2InitialY = tableY + 100;
    // When travelPixels is positive (rightwards), m2 moves UP (-travelPixels)
    const m2Y = m2InitialY - travelPixels;
    const m2X = leftPulleyX - pulleyRadius - m2Width / 2;

    // Right mass m1 (hangs off right pulley)
    const m1Width = Math.min(104, Math.max(84, 76 + params.m1 * 2));
    const m1Height = 48;
    const m1InitialY = tableY + 100;
    // When travelPixels is positive (rightwards), m1 moves DOWN (+travelPixels)
    const m1Y = m1InitialY + travelPixels;
    const m1X = rightPulleyX + pulleyRadius - m1Width / 2;

    // --- Ropes ---
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = ropeColor;

    // 1. Left rope: from m left edge to left pulley top, around quadrant, and down to m2
    const ropeTopY = pulleyCenterY - pulleyRadius;

    // Horizontal segment left
    ctx.beginPath();
    ctx.moveTo(mX, ropeTopY);
    ctx.lineTo(leftPulleyX, ropeTopY);
    ctx.stroke();

    // Left pulley arc (from top 3*PI/2 down to left PI)
    ctx.beginPath();
    ctx.arc(leftPulleyX, pulleyCenterY, pulleyRadius, -Math.PI / 2, Math.PI, true);
    ctx.stroke();

    // Vertical segment left to m2
    const leftDropX = leftPulleyX - pulleyRadius;
    ctx.beginPath();
    ctx.moveTo(leftDropX, pulleyCenterY);
    ctx.lineTo(leftDropX, m2Y);
    ctx.stroke();

    // 2. Right rope: from m right edge to right pulley top, around quadrant, and down to m1
    // Horizontal segment right
    ctx.beginPath();
    ctx.moveTo(mX + mWidth, ropeTopY);
    ctx.lineTo(rightPulleyX, ropeTopY);
    ctx.stroke();

    // Right pulley arc (from top -PI/2 down to right 0)
    ctx.beginPath();
    ctx.arc(rightPulleyX, pulleyCenterY, pulleyRadius, -Math.PI / 2, 0, false);
    ctx.stroke();

    // Vertical segment right to m1
    const rightDropX = rightPulleyX + pulleyRadius;
    ctx.beginPath();
    ctx.moveTo(rightDropX, pulleyCenterY);
    ctx.lineTo(rightDropX, m1Y);
    ctx.stroke();

    // --- Draw Pulleys ---
    const drawPulleyWheel = (px: number, py: number, rot: number) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);

      ctx.fillStyle = isDark ? "#18181b" : "#ffffff";
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, pulleyRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, pulleyRadius - 3, 0, 2 * Math.PI);
      ctx.strokeStyle = isDark ? "#3f3f46" : "#e4e4e7";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Spokes (+)
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-pulleyRadius + 3, 0);
      ctx.lineTo(pulleyRadius - 3, 0);
      ctx.moveTo(0, -pulleyRadius + 3);
      ctx.lineTo(0, pulleyRadius - 3);
      ctx.stroke();

      // Axle center
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();

      // Bracket mount to table
      ctx.beginPath();
      ctx.strokeStyle = tableLine;
      ctx.lineWidth = 2.5;
      ctx.moveTo(px, py);
      ctx.lineTo(px, tableY);
      ctx.stroke();
    };

    const pulleyRotation = (state.displacement * 4) % (2 * Math.PI);
    drawPulleyWheel(leftPulleyX, pulleyCenterY, -pulleyRotation);
    drawPulleyWheel(rightPulleyX, pulleyCenterY, pulleyRotation);

    // --- Blocks (Colorful & Crisp with Text Inside) ---
    // Colors
    // m (Middle on table): Amber / Orange
    const mFill = isDark ? "#d97706" : "#f59e0b";
    const mStroke = isDark ? "#f59e0b" : "#b45309";

    // m2 (Left): Purple
    const m2Fill = isDark ? "#9333ea" : "#a855f7";
    const m2Stroke = isDark ? "#c084fc" : "#7e22ce";

    // m1 (Right): Blue
    const m1Fill = isDark ? "#2563eb" : "#3b82f6";
    const m1Stroke = isDark ? "#60a5fa" : "#1d4ed8";

    const cornerRadius = 6;

    // 1. Draw Middle Block m (Label inside block to avoid vector overlap)
    ctx.save();
    ctx.fillStyle = mFill;
    ctx.strokeStyle = mStroke;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(mX, mY, mWidth, mHeight, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // Text inside block: "m = X kg" exactly as shown in user diagram
    ctx.font = "bold 14px 'Google Sans', 'Hind Siliguri', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`m = ${params.m} kg`, mX + mWidth / 2, mY + mHeight / 2);
    ctx.restore();

    // 2. Draw Left Block m2 (Label inside block to avoid vector overlap)
    ctx.save();
    ctx.fillStyle = m2Fill;
    ctx.strokeStyle = m2Stroke;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(m2X, m2Y, m2Width, m2Height, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // Text inside block: "m₂ = X kg" exactly as shown in user diagram
    ctx.font = "bold 14px 'Google Sans', 'Hind Siliguri', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`m₂ = ${params.m2} kg`, m2X + m2Width / 2, m2Y + m2Height / 2);
    ctx.restore();

    // 3. Draw Right Block m1 (Label inside block to avoid vector overlap)
    ctx.save();
    ctx.fillStyle = m1Fill;
    ctx.strokeStyle = m1Stroke;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(m1X, m1Y, m1Width, m1Height, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // Text inside block: "m₁ = X kg" exactly as shown in user diagram
    ctx.font = "bold 14px 'Google Sans', 'Hind Siliguri', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`m₁ = ${params.m1} kg`, m1X + m1Width / 2, m1Y + m1Height / 2);
    ctx.restore();

    // --- Force Vectors (T1, T2 with cleanly spaced positions) ---
    const drawArrow = (
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      color: string,
      label: string,
      labelPos: "above-tip" | "below-tip" | "left" | "right" | "top" = "top"
    ) => {
      const headLength = 8;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const angle = Math.atan2(dy, dx);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      ctx.font = "bold 13px 'Google Sans', 'Hind Siliguri', sans-serif";

      if (labelPos === "above-tip") {
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(label, toX, toY - 6);
      } else if (labelPos === "below-tip") {
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(label, toX, toY + 6);
      } else if (labelPos === "left") {
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(label, fromX - 9, (fromY + toY) / 2);
      } else if (labelPos === "right") {
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, fromX + 9, (fromY + toY) / 2);
      } else {
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(label, (fromX + toX) / 2, Math.min(fromY, toY) - 6);
      }
    };

    // T2 arrow on horizontal rope (pointing left towards left pulley)
    const t2MidX = (leftPulleyX + mX) / 2;
    drawArrow(t2MidX + 22, ropeTopY, t2MidX - 22, ropeTopY, vectorColor, "T₂", "top");

    // T1 arrow on horizontal rope (pointing right towards right pulley)
    const t1MidX = (mX + mWidth + rightPulleyX) / 2;
    drawArrow(t1MidX - 22, ropeTopY, t1MidX + 22, ropeTopY, vectorColor, "T₁", "top");

    // T2 arrow pointing upwards on left hanging rope
    const t2VertMidY = Math.max(pulleyCenterY + 28, (pulleyCenterY + m2Y) / 2);
    drawArrow(leftDropX, t2VertMidY + 20, leftDropX, t2VertMidY - 20, vectorColor, "T₂", "left");

    // T1 arrow pointing upwards on right hanging rope
    const t1VertMidY = Math.max(pulleyCenterY + 28, (pulleyCenterY + m1Y) / 2);
    drawArrow(rightDropX, t1VertMidY + 20, rightDropX, t1VertMidY - 20, vectorColor, "T₁", "right");

    // Optional additional force vectors (gravity, normal)
    if (showVectors) {
      // Normal force on m (pointing straight UP from top edge of m, label cleanly above tip)
      drawArrow(mX + mWidth / 2, mY, mX + mWidth / 2, mY - 34, "#10b981", "N", "above-tip");

      // Gravity on m (pointing straight DOWN from bottom edge of m, label below tip)
      drawArrow(mX + mWidth / 2, mY + mHeight, mX + mWidth / 2, mY + mHeight + 34, vectorGravity, "mg", "below-tip");

      // Gravity on m2 (pointing straight DOWN from bottom edge of m2, label below tip)
      drawArrow(m2X + m2Width / 2, m2Y + m2Height, m2X + m2Width / 2, m2Y + m2Height + 36, vectorGravity, "m₂g", "below-tip");

      // Gravity on m1 (pointing straight DOWN from bottom edge of m1, label below tip)
      drawArrow(m1X + m1Width / 2, m1Y + m1Height, m1X + m1Width / 2, m1Y + m1Height + 36, vectorGravity, "m₁g", "below-tip");
    }
  }, [params, state, showVectors]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-inner flex flex-col items-center justify-center p-3">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "760px",
          height: "auto",
          aspectRatio: "760 / 440",
        }}
        className="block select-none"
      />
    </div>
  );
}

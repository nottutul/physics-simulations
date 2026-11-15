"use client";

import { useEffect, useRef } from "react";
import { PulleySimulationParams, PulleyPhysicsState } from "@/types/pulley";
import { MAX_DISPLACEMENT } from "./physics";

interface PulleyCanvasProps {
  params: PulleySimulationParams;
  state: PulleyPhysicsState;
  showVectors: boolean;
}

export function PulleyCanvas({ params, state, showVectors }: PulleyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = 680;
    const height = 440;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Colors
    const isDark = document.documentElement.classList.contains("dark");
    const strokeColor = isDark ? "#e4e4e7" : "#18181b";
    const tableLine = isDark ? "#52525b" : "#71717a";
    const ropeColor = isDark ? "#38bdf8" : "#0284c7";
    const vectorTension = "#f59e0b";
    const vectorGravity = "#ef4444";
    const vectorNormal = "#10b981";

    // Geometry definition for 90° Corner
    const pulleyRadius = 24;
    const cornerX = 420;
    const cornerY = 130;

    // Pulley sits at the 90° corner
    const pulleyX = cornerX;
    const pulleyY = cornerY;

    // Table line: horizontal along top
    const tableLeftX = 70;
    const tableTopY = cornerY + pulleyRadius; // Bottom tangent of pulley or corner level

    // Vertical wall / edge going straight down at 90 degrees
    const verticalWallX = cornerX;
    const verticalWallEndY = tableTopY + 230;

    // --- 1. Draw Table and 90° Vertical Edge ---
    ctx.lineWidth = 3;
    ctx.strokeStyle = tableLine;
    ctx.lineCap = "round";
    ctx.lineJoin = "miter";

    // Horizontal table top
    ctx.beginPath();
    ctx.moveTo(tableLeftX, tableTopY);
    ctx.lineTo(cornerX, tableTopY);
    // 90° Vertical edge straight down
    ctx.lineTo(verticalWallX, verticalWallEndY);
    ctx.stroke();

    // Table support hatchings
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isDark ? "#3f3f46" : "#d4d4d8";
    for (let x = tableLeftX + 20; x < cornerX - 15; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, tableTopY);
      ctx.lineTo(x - 10, tableTopY + 12);
      ctx.stroke();
    }
    // Vertical wall inside hatchings
    for (let y = tableTopY + 20; y < verticalWallEndY - 15; y += 30) {
      ctx.beginPath();
      ctx.moveTo(verticalWallX, y);
      ctx.lineTo(verticalWallX - 12, y + 10);
      ctx.stroke();
    }

    // --- Draw the 90° angle mark exactly like user's drawing ---
    ctx.save();
    const markSize = 22;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ef4444"; // red accent like user's annotation
    ctx.beginPath();
    // Square corner mark inside the 90° angle
    ctx.moveTo(cornerX - markSize, tableTopY);
    ctx.lineTo(cornerX - markSize, tableTopY + markSize);
    ctx.lineTo(cornerX, tableTopY + markSize);
    ctx.stroke();

    // Label 90° in red
    ctx.font = "bold 13px 'Google Sans', 'Hind Siliguri', sans-serif";
    ctx.fillStyle = "#ef4444";
    ctx.fillText("90°", cornerX - 52, tableTopY + 26);
    ctx.restore();

    // --- 2. Motion and Position calculations ---
    const maxPixelTravel = 170;
    const travelPixels = (state.displacement / MAX_DISPLACEMENT) * maxPixelTravel;

    // Block m2 size and position (horizontal)
    const m2Width = Math.min(104, Math.max(84, 76 + params.m2 * 2));
    const m2Height = 48;
    const m2InitialX = 130;
    const m2X = m2InitialX + travelPixels;
    const m2Y = tableTopY - m2Height;

    // Block m1 size and position (hanging vertically)
    const m1Width = Math.min(104, Math.max(84, 76 + params.m1 * 2));
    const m1Height = 48;
    const m1InitialY = tableTopY + 55;
    const m1Y = m1InitialY + travelPixels;
    // Hanging at the outer tangent of the pulley
    const m1X = cornerX + pulleyRadius - m1Width / 2;

    // --- 3. Draw Ropes ---
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = ropeColor;

    // Horizontal rope from m2 to top tangent of pulley
    const rope2StartX = m2X + m2Width;
    const ropeTopY = pulleyY - pulleyRadius;
    ctx.beginPath();
    ctx.moveTo(rope2StartX, ropeTopY);
    ctx.lineTo(pulleyX, ropeTopY);
    ctx.stroke();

    // Rope arc around top-right quadrant of pulley (from top to right side)
    // Top is -PI/2, Right is 0
    ctx.beginPath();
    ctx.arc(pulleyX, pulleyY, pulleyRadius, -Math.PI / 2, 0, false);
    ctx.stroke();

    // Vertical rope dropping straight down from right tangent of pulley to m1
    const ropeRightX = pulleyX + pulleyRadius;
    ctx.beginPath();
    ctx.moveTo(ropeRightX, pulleyY);
    ctx.lineTo(ropeRightX, m1Y);
    ctx.stroke();

    // --- 4. Draw Pulley Wheel (with axle + spokes like image) ---
    ctx.save();
    ctx.translate(pulleyX, pulleyY);
    // Rotate with displacement
    const rotationAngle = (state.displacement * 4) % (2 * Math.PI);
    ctx.rotate(rotationAngle);

    // Pulley outer rim
    ctx.fillStyle = isDark ? "#18181b" : "#ffffff";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, pulleyRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Pulley inner groove
    ctx.beginPath();
    ctx.arc(0, 0, pulleyRadius - 3, 0, 2 * Math.PI);
    ctx.strokeStyle = isDark ? "#3f3f46" : "#e4e4e7";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cross spokes (+) matching the drawing
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-pulleyRadius + 3, 0);
    ctx.lineTo(pulleyRadius - 3, 0);
    ctx.moveTo(0, -pulleyRadius + 3);
    ctx.lineTo(0, pulleyRadius - 3);
    ctx.stroke();

    // Center pivot circle
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    // Pulley axle bracket support to table corner
    ctx.beginPath();
    ctx.strokeStyle = tableLine;
    ctx.lineWidth = 2.5;
    ctx.moveTo(pulleyX, pulleyY);
    ctx.lineTo(cornerX, tableTopY);
    ctx.stroke();

    // Colors for m1 (Blue) and m2 (Purple)
    const m1Fill = isDark ? "#2563eb" : "#3b82f6";
    const m1Stroke = isDark ? "#60a5fa" : "#1d4ed8";

    const m2Fill = isDark ? "#9333ea" : "#a855f7";
    const m2Stroke = isDark ? "#c084fc" : "#7e22ce";

    // --- 5. Draw Block m2 (Colorful Purple, Label inside) ---
    ctx.save();
    const m2CornerRadius = 6;
    ctx.fillStyle = m2Fill;
    ctx.strokeStyle = m2Stroke;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(m2X, m2Y, m2Width, m2Height, m2CornerRadius);
    ctx.fill();
    ctx.stroke();

    // Text inside block: "m₂ = X kg" (no outside text to avoid N2 vector collision)
    ctx.font = "bold 14px 'Google Sans', 'Hind Siliguri', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`m₂ = ${params.m2} kg`, m2X + m2Width / 2, m2Y + m2Height / 2);
    ctx.restore();

    // --- 6. Draw Block m1 (Colorful Blue, Hanging vertically, Label inside) ---
    ctx.save();
    const m1CornerRadius = 6;
    ctx.fillStyle = m1Fill;
    ctx.strokeStyle = m1Stroke;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(m1X, m1Y, m1Width, m1Height, m1CornerRadius);
    ctx.fill();
    ctx.stroke();

    // Text inside block: "m₁ = X kg" (clean, no outside collision)
    ctx.font = "bold 14px 'Google Sans', 'Hind Siliguri', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`m₁ = ${params.m1} kg`, m1X + m1Width / 2, m1Y + m1Height / 2);
    ctx.restore();

    // --- 7. Force Vectors (if enabled, spaced with zero overlap) ---
    if (showVectors) {
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

      // Vectors on m2
      // Tension T pointing right along rope
      const tMidX = Math.min(pulleyX - 25, (m2X + m2Width + pulleyX) / 2);
      drawArrow(
        tMidX - 20,
        ropeTopY,
        tMidX + 20,
        ropeTopY,
        vectorTension,
        "T",
        "top"
      );

      // Normal force N2 pointing straight up from top edge (label cleanly above tip)
      drawArrow(
        m2X + m2Width / 2,
        m2Y,
        m2X + m2Width / 2,
        m2Y - 34,
        vectorNormal,
        "N₂",
        "above-tip"
      );

      // Gravity m2g pointing straight down from bottom edge (label below tip)
      drawArrow(
        m2X + m2Width / 2,
        m2Y + m2Height,
        m2X + m2Width / 2,
        m2Y + m2Height + 34,
        vectorGravity,
        "m₂g",
        "below-tip"
      );

      // Vectors on m1
      const m1CenterX = m1X + m1Width / 2;
      // Tension T pointing straight up on rope above m1
      const tVertMidY = Math.max(pulleyY + 28, (pulleyY + m1Y) / 2);
      drawArrow(
        ropeRightX,
        tVertMidY + 20,
        ropeRightX,
        tVertMidY - 20,
        vectorTension,
        "T",
        "right"
      );

      // Gravity m1g pointing straight down from bottom edge (label below tip)
      drawArrow(
        m1CenterX,
        m1Y + m1Height,
        m1CenterX,
        m1Y + m1Height + 36,
        vectorGravity,
        "m₁g",
        "below-tip"
      );
    }
  }, [params, state, showVectors]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-inner flex flex-col items-center justify-center p-3">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "680px",
          height: "auto",
          aspectRatio: "680 / 440",
        }}
        className="block select-none"
      />
    </div>
  );
}

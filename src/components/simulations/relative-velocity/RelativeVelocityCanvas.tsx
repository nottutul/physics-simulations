"use client";

import { useEffect, useRef } from "react";
import {
  RelativeVelocityParams,
  RelativeVelocityCalculations,
} from "@/types/relative-velocity";

interface RelativeVelocityCanvasProps {
  params: RelativeVelocityParams;
  calcs: RelativeVelocityCalculations;
  isRunning: boolean;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speedMultiplier: number;
  opacity: number;
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export function RelativeVelocityCanvas({
  params,
  calcs,
  isRunning,
}: RelativeVelocityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Persistent animation state refs to prevent re-instantiation on every render
  const animStateRef = useRef({
    busX: 180, // Bus x position (in ground frame)
    wheelAngle: 0,
    roadOffset: 0,
    rainDrops: [] as RainDrop[],
    splashes: [] as SplashParticle[],
  });

  // Keep latest props in ref for animation frame loop
  const propsRef = useRef({ params, calcs, isRunning });
  useEffect(() => {
    propsRef.current = { params, calcs, isRunning };
  }, [params, calcs, isRunning]);

  // Initialize rain particles
  useEffect(() => {
    const drops: RainDrop[] = [];
    const count = 220;
    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        length: 12 + Math.random() * 14,
        speedMultiplier: 0.85 + Math.random() * 0.35,
        opacity: 0.35 + Math.random() * 0.55,
      });
    }
    animStateRef.current.rainDrops = drops;
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime: number | null = null;

    const render = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const { params: currentParams, calcs: currentCalcs, isRunning: running } =
        propsRef.current;
      const anim = animStateRef.current;

      // Handle HiDPI
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Coordinates setup
      const roadY = height - 70;
      const busWidth = 190;
      const busHeight = 74;
      const wheelRadius = 16;
      const busY = roadY - busHeight - wheelRadius + 8;

      const isBusFrame = currentParams.frame === "bus";
      const busSpeed = currentParams.busSpeed;
      const isBusMovingRight = currentParams.busDirection === "right";
      const busSignedSpeed = isBusMovingRight ? busSpeed : -busSpeed;

      // Update positions if running
      if (running && dt > 0) {
        // Wheel rotation
        const wheelOmega = (busSignedSpeed * 4) / wheelRadius;
        anim.wheelAngle += wheelOmega * dt;

        if (isBusFrame) {
          // Bus is centered, road moves backward
          anim.busX = width / 2 - busWidth / 2;
          anim.roadOffset -= busSignedSpeed * 28 * dt;
        } else {
          // Ground frame: bus moves across screen
          anim.busX += busSignedSpeed * 28 * dt;
          // Wrap around with smooth buffer
          if (anim.busX > width + 50) anim.busX = -busWidth - 30;
          if (anim.busX < -busWidth - 50) anim.busX = width + 30;
        }
      } else if (isBusFrame) {
        anim.busX = width / 2 - busWidth / 2;
      }

      // Rain velocity components in pixels/sec
      // In bus frame: horizontal = v_rel_x, vertical = v_R
      // In ground frame: horizontal = v_ground_x, vertical = v_R
      // Smooth, gentle velocity scale preserving exact physical angle θ:
      const rainScale = 14;
      const rainVx =
        (isBusFrame ? currentCalcs.v_rel_x : currentCalcs.v_ground_x) * rainScale;
      const rainVy = currentCalcs.v_R * rainScale;

      // --- 1. Background Sky & Atmosphere ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#090d16");
      skyGrad.addColorStop(0.65, "#0f172a");
      skyGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Background Grid if enabled
      if (currentParams.showGrid) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        const gridStep = 40;
        for (let x = 0; x < width; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // --- 2. Road Surface & Markings ---
      ctx.fillStyle = "#18181b"; // dark asphalt
      ctx.fillRect(0, roadY, width, height - roadY);

      // Road curb edge
      ctx.fillStyle = "#3f3f46";
      ctx.fillRect(0, roadY - 3, width, 3);

      // Moving Dashed Center Line
      ctx.save();
      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 4;
      ctx.setLineDash([32, 28]);
      ctx.lineDashOffset = -anim.roadOffset;
      ctx.beginPath();
      ctx.moveTo(0, roadY + 34);
      ctx.lineTo(width, roadY + 34);
      ctx.stroke();
      ctx.restore();

      // Road boundary ticks
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      const tickStep = 60;
      const tickOffset = (anim.roadOffset % tickStep + tickStep) % tickStep;
      for (let tx = -tickStep + tickOffset; tx < width + tickStep; tx += tickStep) {
        ctx.beginPath();
        ctx.moveTo(tx, roadY + 54);
        ctx.lineTo(tx + 12, roadY + 54);
        ctx.stroke();
      }

      // --- 3. Bus Dimensions & Coordinates ---
      const curBusX = anim.busX;
      const curBusY = busY;

      // Windshield slant setup
      // If moving right: front is on right, rear is on left
      // If moving left: front is on left, rear is on right
      const frontIsRight = isBusMovingRight;
      const slantPx = Math.tan((currentParams.windshieldAngle * Math.PI) / 180) * (busHeight - 20);
      const clampedSlant = Math.min(slantPx, 45);

      // Bus Headlight Beam
      ctx.save();
      const headlightGrad = ctx.createRadialGradient(
        frontIsRight ? curBusX + busWidth : curBusX,
        curBusY + busHeight - 22,
        5,
        frontIsRight ? curBusX + busWidth + 140 : curBusX - 140,
        curBusY + busHeight - 15,
        150
      );
      headlightGrad.addColorStop(0, "rgba(254, 240, 138, 0.35)");
      headlightGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
      ctx.fillStyle = headlightGrad;
      ctx.beginPath();
      if (frontIsRight) {
        ctx.moveTo(curBusX + busWidth, curBusY + busHeight - 25);
        ctx.lineTo(curBusX + busWidth + 160, curBusY + busHeight - 45);
        ctx.lineTo(curBusX + busWidth + 170, curBusY + busHeight + 15);
      } else {
        ctx.moveTo(curBusX, curBusY + busHeight - 25);
        ctx.lineTo(curBusX - 160, curBusY + busHeight - 45);
        ctx.lineTo(curBusX - 170, curBusY + busHeight + 15);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // --- 4. Draw Yellow Bus Body ---
      ctx.save();
      ctx.fillStyle = "#eab308"; // Primary yellow
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 2;

      ctx.beginPath();
      if (frontIsRight) {
        // Rear is left (nearly vertical), Roof is top, Front is right (slanted)
        ctx.moveTo(curBusX + 8, curBusY + busHeight); // rear bottom
        ctx.lineTo(curBusX, curBusY + 12); // rear vertical to top
        ctx.quadraticCurveTo(curBusX, curBusY, curBusX + 14, curBusY); // rear top curve
        ctx.lineTo(curBusX + busWidth - clampedSlant, curBusY); // roof
        ctx.quadraticCurveTo(
          curBusX + busWidth - clampedSlant + 10,
          curBusY,
          curBusX + busWidth - clampedSlant + 15,
          curBusY + 8
        ); // front top curve
        ctx.lineTo(curBusX + busWidth, curBusY + busHeight - 16); // front slanted windshield
        ctx.quadraticCurveTo(
          curBusX + busWidth,
          curBusY + busHeight,
          curBusX + busWidth - 10,
          curBusY + busHeight
        ); // front bottom bumper
      } else {
        // Front is left (slanted), Rear is right (vertical)
        ctx.moveTo(curBusX + 10, curBusY + busHeight);
        ctx.lineTo(curBusX, curBusY + busHeight - 16);
        ctx.lineTo(curBusX + clampedSlant - 15, curBusY + 8);
        ctx.quadraticCurveTo(
          curBusX + clampedSlant - 10,
          curBusY,
          curBusX + clampedSlant,
          curBusY
        );
        ctx.lineTo(curBusX + busWidth - 14, curBusY);
        ctx.quadraticCurveTo(
          curBusX + busWidth,
          curBusY,
          curBusX + busWidth,
          curBusY + 12
        );
        ctx.lineTo(curBusX + busWidth - 8, curBusY + busHeight);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bus Lower Trim / Stripe
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(curBusX + 4, curBusY + busHeight - 12, busWidth - 8, 5);

      // Bus Windows
      ctx.fillStyle = "#38bdf8"; // Light sky tint
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 1.5;

      if (frontIsRight) {
        // Front Windshield (slanted)
        ctx.beginPath();
        ctx.moveTo(curBusX + busWidth - clampedSlant + 5, curBusY + 10);
        ctx.lineTo(curBusX + busWidth - 4, curBusY + busHeight - 26);
        ctx.lineTo(curBusX + busWidth - 30, curBusY + busHeight - 26);
        ctx.lineTo(curBusX + busWidth - clampedSlant - 16, curBusY + 10);
        ctx.closePath();
        ctx.fillStyle = currentCalcs.frontGlassWet ? "#0284c7" : "#7dd3fc";
        ctx.fill();
        ctx.stroke();

        // Passenger Windows (3 side windows)
        const winW = 28;
        const winH = 24;
        const winY = curBusY + 12;
        for (let i = 0; i < 3; i++) {
          const wx = curBusX + 22 + i * 36;
          ctx.fillStyle = "#bae6fd";
          ctx.fillRect(wx, winY, winW, winH);
          ctx.strokeRect(wx, winY, winW, winH);
        }

        // Rear Windshield (left vertical window)
        ctx.fillStyle = currentCalcs.rearGlassWet ? "#0284c7" : "#7dd3fc";
        ctx.fillRect(curBusX + 6, winY, 10, winH);
        ctx.strokeRect(curBusX + 6, winY, 10, winH);

        // Driver silhouette in front window
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.arc(curBusX + busWidth - clampedSlant - 2, winY + 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(curBusX + busWidth - clampedSlant - 6, winY + 14, 10, 10);
      } else {
        // Front is on left (slanted), Rear is on right
        ctx.beginPath();
        ctx.moveTo(curBusX + clampedSlant - 5, curBusY + 10);
        ctx.lineTo(curBusX + 4, curBusY + busHeight - 26);
        ctx.lineTo(curBusX + 30, curBusY + busHeight - 26);
        ctx.lineTo(curBusX + clampedSlant + 16, curBusY + 10);
        ctx.closePath();
        ctx.fillStyle = currentCalcs.frontGlassWet ? "#0284c7" : "#7dd3fc";
        ctx.fill();
        ctx.stroke();

        const winW = 28;
        const winH = 24;
        const winY = curBusY + 12;
        for (let i = 0; i < 3; i++) {
          const wx = curBusX + busWidth - 50 - i * 36;
          ctx.fillStyle = "#bae6fd";
          ctx.fillRect(wx, winY, winW, winH);
          ctx.strokeRect(wx, winY, winW, winH);
        }

        ctx.fillStyle = currentCalcs.rearGlassWet ? "#0284c7" : "#7dd3fc";
        ctx.fillRect(curBusX + busWidth - 16, winY, 10, winH);
        ctx.strokeRect(curBusX + busWidth - 16, winY, 10, winH);

        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.arc(curBusX + clampedSlant + 2, winY + 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(curBusX + clampedSlant - 4, winY + 14, 10, 10);
      }

      // Wheels
      const drawWheel = (wx: number, wy: number) => {
        ctx.save();
        ctx.translate(wx, wy);

        // Tire
        ctx.fillStyle = "#18181b";
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#52525b";
        ctx.stroke();

        // Rim
        ctx.fillStyle = "#d4d4d8";
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius - 6, 0, Math.PI * 2);
        ctx.fill();

        // Rotating Spokes
        ctx.rotate(anim.wheelAngle);
        ctx.strokeStyle = "#71717a";
        ctx.lineWidth = 2;
        for (let s = 0; s < 4; s++) {
          ctx.beginPath();
          ctx.moveTo(-wheelRadius + 7, 0);
          ctx.lineTo(wheelRadius - 7, 0);
          ctx.stroke();
          ctx.rotate(Math.PI / 4);
        }

        ctx.restore();
      };

      const wheelY = roadY;
      drawWheel(curBusX + 38, wheelY);
      drawWheel(curBusX + busWidth - 38, wheelY);

      // Headlight & Taillight bulbs
      if (frontIsRight) {
        // Headlight on right
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(curBusX + busWidth - 3, curBusY + busHeight - 22, 4, 10);
        // Taillight on left
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(curBusX, curBusY + busHeight - 22, 4, 8);
      } else {
        // Headlight on left
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(curBusX - 1, curBusY + busHeight - 22, 4, 10);
        // Taillight on right
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(curBusX + busWidth - 3, curBusY + busHeight - 22, 4, 8);
      }

      ctx.restore(); // end bus drawing

      // --- 5. Rain Drops Update & Rendering ---
      if (currentParams.showRainDrops) {
        ctx.save();
        ctx.strokeStyle = "rgba(186, 230, 253, 0.75)";
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";

        const drops = anim.rainDrops;
        for (let i = 0; i < drops.length; i++) {
          const drop = drops[i];

          // Advance raindrop by velocity * dt
          if (running && dt > 0) {
            drop.x += rainVx * drop.speedMultiplier * dt;
            drop.y += rainVy * drop.speedMultiplier * dt;

            // Wrap around horizontal
            if (drop.x > width + 60) drop.x = -50;
            if (drop.x < -60) drop.x = width + 50;

            // Wrap around vertical
            if (drop.y > roadY) {
              // Road splash
              if (Math.random() < 0.25) {
                anim.splashes.push({
                  x: drop.x,
                  y: roadY,
                  vx: (Math.random() - 0.5) * 40,
                  vy: -Math.random() * 30 - 10,
                  life: 0,
                  maxLife: 0.2,
                  color: "rgba(186, 230, 253, 0.6)",
                });
              }
              drop.y = -20 - Math.random() * 30;
              drop.x = Math.random() * (width + 100) - 50;
            }

            // Check collision with bus
            // 1) Roof collision
            if (
              drop.x >= curBusX + 5 &&
              drop.x <= curBusX + busWidth - 5 &&
              drop.y >= curBusY &&
              drop.y <= curBusY + 8
            ) {
              if (Math.random() < 0.35) {
                anim.splashes.push({
                  x: drop.x,
                  y: curBusY,
                  vx: (Math.random() - 0.5) * 35,
                  vy: -Math.random() * 25 - 8,
                  life: 0,
                  maxLife: 0.22,
                  color: "rgba(186, 230, 253, 0.7)",
                });
              }
              drop.y = -20;
            }

            // 2) Front Windshield collision (if front glass is wet)
            if (currentCalcs.frontGlassWet) {
              const frontWindshieldX = frontIsRight
                ? curBusX + busWidth - clampedSlant / 2
                : curBusX + clampedSlant / 2;
              if (
                Math.abs(drop.x - frontWindshieldX) < 18 &&
                drop.y >= curBusY + 8 &&
                drop.y <= curBusY + busHeight - 18
              ) {
                anim.splashes.push({
                  x: drop.x,
                  y: drop.y,
                  vx: frontIsRight ? 20 + Math.random() * 30 : -20 - Math.random() * 30,
                  vy: -Math.random() * 20 - 5,
                  life: 0,
                  maxLife: 0.25,
                  color: "rgba(56, 189, 248, 0.9)",
                });
                drop.y = -20;
              }
            }

            // 3) Rear Windshield collision (if rear glass is wet)
            if (currentCalcs.rearGlassWet) {
              const rearWindshieldX = frontIsRight
                ? curBusX + 6
                : curBusX + busWidth - 6;
              if (
                Math.abs(drop.x - rearWindshieldX) < 18 &&
                drop.y >= curBusY + 8 &&
                drop.y <= curBusY + busHeight - 18
              ) {
                anim.splashes.push({
                  x: drop.x,
                  y: drop.y,
                  vx: frontIsRight ? -20 - Math.random() * 30 : 20 + Math.random() * 30,
                  vy: -Math.random() * 20 - 5,
                  life: 0,
                  maxLife: 0.25,
                  color: "rgba(249, 115, 22, 0.9)",
                });
                drop.y = -20;
              }
            }
          }

          // Draw the slanted rain streak
          const len = drop.length;
          // Rain velocity vector angle
          const rainAngle = Math.atan2(rainVy, rainVx);
          const tailX = drop.x - Math.cos(rainAngle) * len;
          const tailY = drop.y - Math.sin(rainAngle) * len;

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(drop.x, drop.y);
          ctx.stroke();
        }

        ctx.restore();
      }

      // --- 6. Splash Particles ---
      if (anim.splashes.length > 0) {
        ctx.save();
        for (let s = anim.splashes.length - 1; s >= 0; s--) {
          const sp = anim.splashes[s];
          sp.life += dt;
          if (sp.life >= sp.maxLife) {
            anim.splashes.splice(s, 1);
            continue;
          }
          sp.x += sp.vx * dt;
          sp.y += sp.vy * dt;
          sp.vy += 120 * dt; // gravity

          const alpha = 1 - sp.life / sp.maxLife;
          ctx.fillStyle = sp.color.replace("0.9", alpha.toFixed(2)).replace("0.7", (alpha * 0.7).toFixed(2));
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // --- 7. Overlays on Canvas ---
      // Top-Left Simulation Title & Frame Badge
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px 'Google Sans', 'Hind Siliguri', sans-serif";
      ctx.fillText("চলমান বাস, বাতাস ও বৃষ্টি", 20, 28);

      ctx.font = "12px 'Google Sans', 'Hind Siliguri', sans-serif";
      ctx.fillStyle = isBusFrame ? "#c084fc" : "#60a5fa";
      ctx.fillText(
        `দৃষ্টিভঙ্গি: ${isBusFrame ? "বাসের সাপেক্ষে (Bus Frame)" : "ভূমির সাপেক্ষে (Ground Frame)"}`,
        20,
        48
      );

      // Wind Arrow at Top
      if (currentParams.windSpeed > 0) {
        const windX = width - 180;
        const windY = 32;
        const windLen = 65;
        const isWindRight = currentParams.windDirection === "right";

        ctx.strokeStyle = "#f97316";
        ctx.fillStyle = "#f97316";
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(windX, windY);
        ctx.lineTo(isWindRight ? windX + windLen : windX - windLen, windY);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        if (isWindRight) {
          ctx.moveTo(windX + windLen, windY);
          ctx.lineTo(windX + windLen - 8, windY - 5);
          ctx.lineTo(windX + windLen - 8, windY + 5);
        } else {
          ctx.moveTo(windX - windLen, windY);
          ctx.lineTo(windX - windLen + 8, windY - 5);
          ctx.lineTo(windX - windLen + 8, windY + 5);
        }
        ctx.closePath();
        ctx.fill();

        // Draw Vw label on canvas
        ctx.font = "bold 13px 'Google Sans', sans-serif";
        ctx.fillText("V", windX - 10, windY - 10);
        const vW = ctx.measureText("V").width;
        ctx.font = "bold 10px 'Google Sans', sans-serif";
        ctx.fillText("w", windX - 10 + vW, windY - 7);
        const subW = ctx.measureText("w").width;
        ctx.font = "bold 12px 'Google Sans', sans-serif";
        ctx.fillText(
          ` = ${currentParams.windSpeed.toFixed(1)} m/s`,
          windX - 10 + vW + subW,
          windY - 10
        );
      }

      // Front and Rear windshield labels on bus
      ctx.font = "bold 10px 'Google Sans', 'Hind Siliguri', sans-serif";
      if (frontIsRight) {
        // Front glass indicator
        ctx.fillStyle = currentCalcs.frontGlassWet ? "#38bdf8" : "#94a3b8";
        ctx.fillText("সামনে", curBusX + busWidth - 28, curBusY + busHeight + 14);
        // Rear glass indicator
        ctx.fillStyle = currentCalcs.rearGlassWet ? "#f97316" : "#94a3b8";
        ctx.fillText("পিছনে", curBusX + 6, curBusY + busHeight + 14);
      } else {
        ctx.fillStyle = currentCalcs.frontGlassWet ? "#38bdf8" : "#94a3b8";
        ctx.fillText("সামনে", curBusX + 6, curBusY + busHeight + 14);
        ctx.fillStyle = currentCalcs.rearGlassWet ? "#f97316" : "#94a3b8";
        ctx.fillText("পিছনে", curBusX + busWidth - 28, curBusY + busHeight + 14);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}

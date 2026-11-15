import {
  InclineHangingParams,
  InclineHangingState,
  MotionDirection,
} from "@/types/incline-hanging-pulley";

export function calculateInclineHangingLimits(params: InclineHangingParams) {
  const rad = (params.angle * Math.PI) / 180;
  const triangleH = 310;
  const triangleW = triangleH / Math.tan(rad);
  const cornerRightX = Math.min(280 + triangleW, 720 - 40);
  const hypotenuseLength = Math.hypot(cornerRightX - 280, triangleH);

  // Dynamic block sizes based on mass (changes with slider)
  const m1Width = Math.min(108, Math.max(76, 70 + params.m1 * 2.5));
  const m1Height = Math.min(56, Math.max(38, 34 + params.m1 * 1.5));
  const m2Width = Math.min(108, Math.max(76, 70 + params.m2 * 2.5));
  const m2Height = Math.min(56, Math.max(38, 34 + params.m2 * 1.5));

  const pxPerMeter = 60;
  const s1_0 = hypotenuseLength * 0.5;
  const Y_m2_0 = 275;
  const baseY = 440;
  const pulleyRadius = 24;
  const apexY = 130;

  // Pulley Center Y formula for collinear rope tangent:
  const slopeAngle = Math.atan2(triangleH, cornerRightX - 280);
  const uPerpX = Math.sin(slopeAngle);
  const uPerpY = -Math.cos(slopeAngle);
  const targetPerpDist = m1Height / 2 - pulleyRadius;
  const pulleyCenterY =
    apexY +
    ((244 + pulleyRadius - 280) * uPerpX - targetPerpDist) / -uPerpY;

  // Limit 1: m1 moves down incline, m2 moves up towards pulley
  const maxDown_m1 = hypotenuseLength - m1Width / 2 - 20 - s1_0;
  const maxDown_m2 = Y_m2_0 - m2Height / 2 - (pulleyCenterY + pulleyRadius + 16);
  const maxTravelDownPx = Math.max(20, Math.min(maxDown_m1, maxDown_m2));

  // Limit 2: m2 moves down towards floor, m1 moves up towards apex pulley
  const maxUp_m1 = s1_0 - (pulleyRadius + m1Width / 2 + 25);
  const maxUp_m2 = baseY - (Y_m2_0 + m2Height / 2);
  const maxTravelUpPx = Math.max(20, Math.min(maxUp_m1, maxUp_m2));

  return {
    maxDisplacementDown: maxTravelDownPx / pxPerMeter,
    maxDisplacementUp: maxTravelUpPx / pxPerMeter,
    m1Width,
    m1Height,
    m2Width,
    m2Height,
    hypotenuseLength,
    s1_0,
    Y_m2_0,
    pulleyCenterY,
    pxPerMeter,
    baseY,
    cornerRightX,
    slopeAngle,
    uPerpX,
    uPerpY,
    pulleyRadius,
  };
}

export function calculateStaticInclineHanging(
  params: InclineHangingParams
): Omit<InclineHangingState, "time" | "displacement" | "velocity" | "isMoving" | "hasReachedLimit"> {
  const { m1, m2, angle, friction, gravity } = params;
  const rad = (angle * Math.PI) / 180;

  const normal1 = m1 * gravity * Math.cos(rad);
  const gravity1Parallel = m1 * gravity * Math.sin(rad);
  const gravity2 = m2 * gravity;
  const maxFriction = friction * normal1;

  // Drive force along incline (positive = down incline)
  const driveForce = gravity1Parallel - gravity2;

  let netForce = 0;
  let acceleration = 0;
  let frictionForce = 0;
  let motionDirection: MotionDirection = "equilibrium";

  if (Math.abs(driveForce) > maxFriction) {
    if (driveForce > 0) {
      frictionForce = maxFriction;
      netForce = driveForce - frictionForce;
      acceleration = netForce / (m1 + m2);
      motionDirection = "down_incline";
    } else {
      frictionForce = maxFriction;
      netForce = driveForce + frictionForce;
      acceleration = netForce / (m1 + m2);
      motionDirection = "up_incline";
    }
  } else {
    // In static equilibrium
    frictionForce = Math.abs(driveForce);
    netForce = 0;
    acceleration = 0;
    motionDirection = "equilibrium";
  }

  // Tension on rope: T = m2 * (g + a)
  const tension = Math.max(0, m2 * (gravity + acceleration));

  return {
    acceleration,
    tension,
    normal1,
    gravity1Parallel,
    gravity2,
    frictionForce,
    netForce,
    motionDirection,
  };
}

export function computeInclineHangingStep(
  currentState: InclineHangingState,
  params: InclineHangingParams,
  deltaTimeSeconds: number
): InclineHangingState {
  if (currentState.hasReachedLimit) {
    return currentState;
  }

  const staticCalc = calculateStaticInclineHanging(params);
  const { acceleration, motionDirection } = staticCalc;

  // If in equilibrium and at rest, no motion occurs
  if (motionDirection === "equilibrium" && Math.abs(currentState.velocity) < 1e-4) {
    return {
      ...currentState,
      ...staticCalc,
      velocity: 0,
      isMoving: false,
    };
  }

  const limits = calculateInclineHangingLimits(params);
  const newTime = currentState.time + deltaTimeSeconds;
  const newVelocity = currentState.velocity + acceleration * deltaTimeSeconds;
  const newDisplacement =
    currentState.displacement + newVelocity * deltaTimeSeconds;

  let reachedLimit = false;
  let clampedDisplacement = newDisplacement;
  let clampedVelocity = newVelocity;

  // Check physical collision limits
  if (newDisplacement >= limits.maxDisplacementDown) {
    reachedLimit = true;
    clampedDisplacement = limits.maxDisplacementDown;
    clampedVelocity = 0;
  } else if (newDisplacement <= -limits.maxDisplacementUp) {
    reachedLimit = true;
    clampedDisplacement = -limits.maxDisplacementUp;
    clampedVelocity = 0;
  }

  return {
    ...currentState,
    ...staticCalc,
    time: newTime,
    displacement: clampedDisplacement,
    velocity: clampedVelocity,
    isMoving: !reachedLimit && Math.abs(clampedVelocity) > 0.001,
    hasReachedLimit: reachedLimit,
  };
}

import {
  DoubleInclineParams,
  DoubleInclineState,
  DoubleInclineMotionDirection,
} from "@/types/double-incline-pulley";

export const ANGLE_1_DEG = 45; // Left incline angle
export const ANGLE_2_DEG = 60; // Right incline angle

export const RAD_1 = (ANGLE_1_DEG * Math.PI) / 180;
export const RAD_2 = (ANGLE_2_DEG * Math.PI) / 180;

export const SIN_1 = Math.sin(RAD_1); // sin(45°) ≈ 0.7071
export const COS_1 = Math.cos(RAD_1); // cos(45°) ≈ 0.7071

export const SIN_2 = Math.sin(RAD_2); // sin(60°) ≈ 0.8660
export const COS_2 = Math.cos(RAD_2); // cos(60°) = 0.5000

export const FIXED_DOUBLE_INCLINE_HEIGHT = 40; // Constant thickness perpendicular to incline

export function calculateDoubleInclineLimits(params: DoubleInclineParams) {
  const triangleH = 290;
  const W1 = triangleH / Math.tan(RAD_1); // 290 px
  const W2 = triangleH / Math.tan(RAD_2); // 167.43 px
  const totalBaseW = W1 + W2;

  const canvasW = 720;
  const leftX = (canvasW - totalBaseW) / 2; // ~131 px
  const apexX = leftX + W1; // ~421 px
  const rightX = apexX + W2; // ~588.4 px
  const baseY = 430;
  const apexY = baseY - triangleH; // 140 px

  const L1 = triangleH / SIN_1; // ~410.1 px
  const L2 = triangleH / SIN_2; // ~334.8 px

  // Only length along the incline increases with mass; height is strictly fixed
  const m1Width = Math.min(116, Math.max(74, 70 + params.m1 * 3.0));
  const m1Height = FIXED_DOUBLE_INCLINE_HEIGHT;
  const m2Width = Math.min(116, Math.max(74, 70 + params.m2 * 3.0));
  const m2Height = FIXED_DOUBLE_INCLINE_HEIGHT;

  const pxPerMeter = 60;
  const s1_0 = L1 * 0.48; // initial position on left slope
  const s2_0 = L2 * 0.48; // initial position on right slope
  const pulleyRadius = 22;

  // Exact pulley center for parallel ropes attached to top corners of blocks on both 45° & 60° slopes:
  // D = mHeight - pulleyRadius = 40 - 22 = 18
  // deltaX = (36 - 18 * sqrt(2)) / (1 + sqrt(3))
  // deltaY = -18 * sqrt(2) - deltaX
  const D = FIXED_DOUBLE_INCLINE_HEIGHT - pulleyRadius; // 18
  const deltaX = (2 * D - D * Math.SQRT2) / (1 + Math.sqrt(3));
  const deltaY = -(D * Math.SQRT2) - deltaX;
  const pulleyCenterX = apexX + deltaX;
  const pulleyCenterY = apexY + deltaY;

  // Travel limits:
  // 1. Right slope down (m2 moves down, m1 moves up):
  const maxDown_m2 = L2 - m2Width / 2 - 20 - s2_0;
  const maxUp_m1 = s1_0 - (pulleyRadius + m1Width / 2 + 25);
  const maxTravelRightPx = Math.max(20, Math.min(maxDown_m2, maxUp_m1));

  // 2. Left slope down (m1 moves down, m2 moves up):
  const maxDown_m1 = L1 - m1Width / 2 - 20 - s1_0;
  const maxUp_m2 = s2_0 - (pulleyRadius + m2Width / 2 + 25);
  const maxTravelLeftPx = Math.max(20, Math.min(maxDown_m1, maxUp_m2));

  return {
    maxDisplacementRight: maxTravelRightPx / pxPerMeter,
    maxDisplacementLeft: maxTravelLeftPx / pxPerMeter,
    m1Width,
    m1Height,
    m2Width,
    m2Height,
    pxPerMeter,
    L1,
    L2,
    s1_0,
    s2_0,
    leftX,
    apexX,
    rightX,
    baseY,
    apexY,
    triangleH,
    pulleyRadius,
    pulleyCenterX,
    pulleyCenterY,
  };
}

export function calculateStaticDoubleIncline(
  params: DoubleInclineParams
): Omit<DoubleInclineState, "time" | "displacement" | "velocity" | "isMoving" | "hasReachedLimit"> {
  const { m1, m2, friction, gravity } = params;

  const normal1 = m1 * gravity * COS_1;
  const normal2 = m2 * gravity * COS_2;
  const gravity1Parallel = m1 * gravity * SIN_1;
  const gravity2Parallel = m2 * gravity * SIN_2;

  // Driving force towards right (positive = right slope moves down)
  const driveForce = gravity2Parallel - gravity1Parallel;
  const maxFriction = friction * (normal1 + normal2);

  let netForce = 0;
  let acceleration = 0;
  let frictionForce = 0;
  let motionDirection: DoubleInclineMotionDirection = "equilibrium";

  if (Math.abs(driveForce) > maxFriction) {
    if (driveForce > 0) {
      frictionForce = maxFriction;
      netForce = driveForce - frictionForce;
      acceleration = netForce / (m1 + m2);
      motionDirection = "right_down";
    } else {
      frictionForce = maxFriction;
      netForce = driveForce + frictionForce;
      acceleration = netForce / (m1 + m2);
      motionDirection = "left_down";
    }
  } else {
    frictionForce = Math.abs(driveForce);
    netForce = 0;
    acceleration = 0;
    motionDirection = "equilibrium";
  }

  // Tension on the rope
  let tension = 0;
  if (motionDirection === "right_down") {
    tension = m1 * (gravity * SIN_1 + acceleration) + friction * normal1;
  } else if (motionDirection === "left_down") {
    tension = m2 * (gravity * SIN_2 - acceleration) + friction * normal2;
  } else {
    // Frictionless static equilibrium formula:
    tension = (m1 * m2 * gravity * (SIN_1 + SIN_2)) / (m1 + m2);
  }
  tension = Math.max(0, tension);

  return {
    acceleration,
    tension,
    normal1,
    normal2,
    gravity1Parallel,
    gravity2Parallel,
    frictionForce,
    netForce,
    motionDirection,
  };
}

export function computeDoubleInclineStep(
  currentState: DoubleInclineState,
  params: DoubleInclineParams,
  deltaTimeSeconds: number
): DoubleInclineState {
  if (currentState.hasReachedLimit) {
    return currentState;
  }

  const staticCalc = calculateStaticDoubleIncline(params);
  const { acceleration, motionDirection } = staticCalc;

  if (motionDirection === "equilibrium" && Math.abs(currentState.velocity) < 1e-4) {
    return {
      ...currentState,
      ...staticCalc,
      velocity: 0,
      isMoving: false,
    };
  }

  const limits = calculateDoubleInclineLimits(params);
  const newTime = currentState.time + deltaTimeSeconds;
  const newVelocity = currentState.velocity + acceleration * deltaTimeSeconds;
  const newDisplacement =
    currentState.displacement + newVelocity * deltaTimeSeconds;

  let reachedLimit = false;
  let clampedDisplacement = newDisplacement;
  let clampedVelocity = newVelocity;

  if (newDisplacement >= limits.maxDisplacementRight) {
    reachedLimit = true;
    clampedDisplacement = limits.maxDisplacementRight;
    clampedVelocity = 0;
  } else if (newDisplacement <= -limits.maxDisplacementLeft) {
    reachedLimit = true;
    clampedDisplacement = -limits.maxDisplacementLeft;
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

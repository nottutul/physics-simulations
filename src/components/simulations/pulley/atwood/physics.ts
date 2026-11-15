import {
  AtwoodParams,
  AtwoodState,
  AtwoodMotionDirection,
} from "@/types/atwood-machine";

export function calculateStaticAtwood(
  params: AtwoodParams
): Omit<AtwoodState, "time" | "displacement" | "velocity" | "isMoving" | "hasReachedLimit"> {
  const { m1, m2, initialHeight, gravity } = params;

  const totalMass = m1 + m2;
  const netForce = (m1 - m2) * gravity;
  const acceleration = netForce / totalMass;
  const tension = (2 * m1 * m2 * gravity) / totalMass;

  let motionDirection: AtwoodMotionDirection = "equilibrium";
  if (acceleration > 0.001) {
    motionDirection = "m1_down";
  } else if (acceleration < -0.001) {
    motionDirection = "m2_down";
  } else {
    motionDirection = "equilibrium";
  }

  let timeToGround = 0;
  let impactVelocity = 0;
  const absAcc = Math.abs(acceleration);

  if (absAcc > 1e-4) {
    timeToGround = Math.sqrt((2 * initialHeight) / absAcc);
    impactVelocity = Math.sqrt(2 * absAcc * initialHeight);
  }

  return {
    acceleration,
    tension,
    timeToGround,
    impactVelocity,
    motionDirection,
  };
}

export function computeAtwoodStep(
  currentState: AtwoodState,
  params: AtwoodParams,
  deltaTimeSeconds: number
): AtwoodState {
  if (currentState.hasReachedLimit) {
    return currentState;
  }

  const staticCalc = calculateStaticAtwood(params);
  const { acceleration, motionDirection } = staticCalc;

  if (motionDirection === "equilibrium" && Math.abs(currentState.velocity) < 1e-4) {
    return {
      ...currentState,
      ...staticCalc,
      velocity: 0,
      isMoving: false,
    };
  }

  const newTime = currentState.time + deltaTimeSeconds;
  const newVelocity = currentState.velocity + acceleration * deltaTimeSeconds;
  const newDisplacement =
    currentState.displacement + newVelocity * deltaTimeSeconds;

  let reachedLimit = false;
  let clampedDisplacement = newDisplacement;
  let clampedVelocity = newVelocity;

  // Collision limits:
  // If m1 is falling (positive displacement): reaches ground when displacement = initialHeight
  // If m2 is falling (negative displacement): reaches ground when -displacement = initialHeight
  if (newDisplacement >= params.initialHeight) {
    reachedLimit = true;
    clampedDisplacement = params.initialHeight;
    clampedVelocity = 0;
  } else if (newDisplacement <= -params.initialHeight) {
    reachedLimit = true;
    clampedDisplacement = -params.initialHeight;
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

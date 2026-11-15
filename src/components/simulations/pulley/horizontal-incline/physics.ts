import { PulleySimulationParams, PulleyPhysicsState } from "@/types/pulley";

export const MAX_DISPLACEMENT = 3.0; // Maximum travel distance in meters

export function calculateStaticPhysics(
  params: PulleySimulationParams
): Omit<PulleyPhysicsState, "time" | "displacement" | "velocity" | "isMoving" | "hasReachedLimit"> {
  const { m1, m2, friction, gravity } = params;

  // At 90 degrees vertical:
  // Normal force on m1 is 0 (hanging vertically)
  const normal1 = 0;
  // Normal force on m2 is m2 * g
  const normal2 = m2 * gravity;

  // Driving force is entirely m1 * g
  const drivingForce = m1 * gravity;

  // Friction on table surface
  const friction1 = 0; // frictionless vertical drop
  const maxFriction2 = friction * normal2;

  let acceleration = 0;
  let friction2 = 0;
  let tension = 0;
  let netForce = 0;

  if (drivingForce > maxFriction2) {
    netForce = drivingForce - maxFriction2;
    acceleration = netForce / (m1 + m2);
    friction2 = maxFriction2;
    tension = m2 * acceleration + friction2;
  } else {
    // Static equilibrium: friction balances driving force
    acceleration = 0;
    netForce = 0;
    friction2 = drivingForce;
    tension = drivingForce;
  }

  return {
    acceleration,
    tension,
    normal1,
    normal2,
    friction1,
    friction2,
    drivingForce,
    netForce,
  };
}

export function computeStep(
  currentState: PulleyPhysicsState,
  params: PulleySimulationParams,
  dt: number
): PulleyPhysicsState {
  if (currentState.hasReachedLimit) {
    return currentState;
  }

  const staticCalc = calculateStaticPhysics(params);
  const { acceleration } = staticCalc;

  if (acceleration <= 0) {
    return {
      ...currentState,
      ...staticCalc,
      velocity: 0,
      isMoving: false,
    };
  }

  const newTime = currentState.time + dt;
  const newVelocity = currentState.velocity + acceleration * dt;
  const newDisplacement =
    currentState.displacement +
    currentState.velocity * dt +
    0.5 * acceleration * dt * dt;

  const reached = newDisplacement >= MAX_DISPLACEMENT;
  const clampedDisplacement = Math.min(newDisplacement, MAX_DISPLACEMENT);
  const clampedVelocity = reached ? 0 : newVelocity;

  return {
    ...staticCalc,
    time: newTime,
    displacement: clampedDisplacement,
    velocity: clampedVelocity,
    isMoving: !reached,
    hasReachedLimit: reached,
  };
}

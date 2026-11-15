import { DoublePulleyParams, DoublePulleyState } from "@/types/double-pulley";

export const MAX_TRAVEL = 2.4; // Max travel in meters before hitting pulley/floor

export function calculateStaticDoublePulley(
  params: DoublePulleyParams
): Omit<DoublePulleyState, "time" | "displacement" | "velocity" | "isMoving" | "hasReachedLimit"> {
  const { m1, m, m2, friction, gravity } = params;

  const normalForce = m * gravity;
  const maxFriction = friction * normalForce;
  const diffForce = (m1 - m2) * gravity;
  const absDiff = Math.abs(diffForce);

  const totalMass = m1 + m + m2;

  let acceleration = 0;
  let direction: "right" | "left" | "equilibrium" = "equilibrium";
  let t1 = 0;
  let t2 = 0;
  let netForce = 0;
  let frictionForce = 0;

  if (absDiff > maxFriction) {
    netForce = absDiff - maxFriction;
    acceleration = netForce / totalMass;
    frictionForce = maxFriction;

    if (m1 > m2) {
      direction = "right";
      t1 = m1 * (gravity - acceleration);
      t2 = m2 * (gravity + acceleration);
    } else {
      direction = "left";
      t1 = m1 * (gravity + acceleration);
      t2 = m2 * (gravity - acceleration);
    }
  } else {
    // Static equilibrium
    direction = "equilibrium";
    acceleration = 0;
    netForce = 0;
    frictionForce = absDiff;
    t1 = m1 * gravity;
    t2 = m2 * gravity;
  }

  return {
    acceleration,
    direction,
    t1,
    t2,
    netForce,
    frictionForce,
    normalForce,
  };
}

export function computeDoublePulleyStep(
  currentState: DoublePulleyState,
  params: DoublePulleyParams,
  dt: number
): DoublePulleyState {
  if (currentState.hasReachedLimit) {
    return currentState;
  }

  const staticCalc = calculateStaticDoublePulley(params);
  const { acceleration, direction } = staticCalc;

  if (acceleration <= 0 || direction === "equilibrium") {
    return {
      ...currentState,
      ...staticCalc,
      velocity: 0,
      isMoving: false,
    };
  }

  const newTime = currentState.time + dt;
  const newVelocity = currentState.velocity + acceleration * dt;
  const deltaDisp = currentState.velocity * dt + 0.5 * acceleration * dt * dt;
  const signedDelta = direction === "right" ? deltaDisp : -deltaDisp;
  const newDisplacement = currentState.displacement + signedDelta;

  const reached = Math.abs(newDisplacement) >= MAX_TRAVEL;
  const clampedDisplacement = Math.sign(newDisplacement) * Math.min(Math.abs(newDisplacement), MAX_TRAVEL);
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

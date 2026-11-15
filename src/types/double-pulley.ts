export interface DoublePulleyParams {
  m1: number; // right hanging mass (kg)
  m: number;  // middle mass on table (kg)
  m2: number; // left hanging mass (kg)
  friction: number; // table friction coefficient mu (0 to 0.5)
  gravity: number; // gravity acceleration (m/s^2)
}

export interface DoublePulleyState {
  time: number;
  displacement: number; // displacement along string in meters (+ = rightwards, - = leftwards)
  velocity: number; // speed in m/s
  acceleration: number; // acceleration in m/s^2
  direction: "right" | "left" | "equilibrium";
  t1: number; // tension in right rope (N)
  t2: number; // tension in left rope (N)
  netForce: number; // net accelerating force (N)
  frictionForce: number; // friction force on table (N)
  normalForce: number; // normal force on middle block m * g (N)
  isMoving: boolean;
  hasReachedLimit: boolean;
}

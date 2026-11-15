export interface AtwoodParams {
  m1: number; // Mass 1 (right) in kg (default 5 kg)
  m2: number; // Mass 2 (left) in kg (default 3 kg)
  initialHeight: number; // Initial height h above ground in meters (default 40 m)
  gravity: number; // Acceleration due to gravity (default 9.8 m/s²)
}

export type AtwoodMotionDirection = "m1_down" | "m2_down" | "equilibrium";

export interface AtwoodState {
  time: number; // Elapsed time in seconds
  displacement: number; // Displacement of m1 downwards in meters
  velocity: number; // Current velocity in m/s (positive = m1 downwards)
  acceleration: number; // Net acceleration in m/s²
  tension: number; // Rope tension in Newtons
  timeToGround: number; // Theoretical time to reach ground in seconds
  impactVelocity: number; // Theoretical impact velocity at ground in m/s
  motionDirection: AtwoodMotionDirection;
  isMoving: boolean;
  hasReachedLimit: boolean;
}

export interface InclineHangingParams {
  m1: number; // Mass on inclined plane in kg (default 5 kg)
  m2: number; // Mass hanging vertically in kg (default 4 kg)
  angle: number; // Incline angle in degrees (default 38°)
  friction: number; // Coefficient of kinetic friction μ (0 to 0.6, default 0)
  gravity: number; // Acceleration due to gravity (default 9.8 m/s²)
}

export type MotionDirection = "down_incline" | "up_incline" | "equilibrium";

export interface InclineHangingState {
  time: number; // Elapsed time in seconds
  displacement: number; // Position displacement along incline in meters
  velocity: number; // Current velocity in m/s (positive = down incline)
  acceleration: number; // Current acceleration in m/s²
  tension: number; // Rope tension T in Newtons
  normal1: number; // Normal force on m1 in Newtons (m1 * g * cos(theta))
  gravity1Parallel: number; // Parallel gravity component on m1 (m1 * g * sin(theta))
  gravity2: number; // Gravity on m2 (m2 * g)
  frictionForce: number; // Friction force on m1 in Newtons
  netForce: number; // Net accelerating force in Newtons
  motionDirection: MotionDirection;
  isMoving: boolean;
  hasReachedLimit: boolean;
}

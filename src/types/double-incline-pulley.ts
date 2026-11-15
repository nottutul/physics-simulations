export interface DoubleInclineParams {
  m1: number; // Mass on left incline (45°), in kg (default 5 kg)
  m2: number; // Mass on right incline (60°), in kg (default 5 kg)
  friction: number; // Kinetic friction coefficient μ (default 0)
  gravity: number; // Acceleration due to gravity (default 9.8 m/s²)
}

export type DoubleInclineMotionDirection = "right_down" | "left_down" | "equilibrium";

export interface DoubleInclineState {
  time: number; // Elapsed time in seconds
  displacement: number; // Positive = m2 moves down 60° slope, m1 moves up 45° slope (meters)
  velocity: number; // Current speed in m/s
  acceleration: number; // Current acceleration in m/s²
  tension: number; // Rope tension T in Newtons
  normal1: number; // Normal force on m1 in Newtons (m1 * g * cos 45°)
  normal2: number; // Normal force on m2 in Newtons (m2 * g * cos 60°)
  gravity1Parallel: number; // Gravity component along left incline (m1 * g * sin 45°)
  gravity2Parallel: number; // Gravity component along right incline (m2 * g * sin 60°)
  frictionForce: number; // Combined friction force in Newtons
  netForce: number; // Net driving accelerating force in Newtons
  motionDirection: DoubleInclineMotionDirection;
  isMoving: boolean;
  hasReachedLimit: boolean;
}

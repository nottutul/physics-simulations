export interface PulleySimulationParams {
  m1: number; // mass 1 on incline (kg)
  m2: number; // mass 2 on horizontal table (kg)
  angle: number; // incline angle in degrees (e.g. 70)
  friction: number; // friction coefficient mu (0 to 1)
  gravity: number; // gravity acceleration (m/s^2, default 9.8)
}

export interface PulleyPhysicsState {
  time: number; // elapsed simulation time in seconds
  displacement: number; // displacement along string/ramp in meters
  velocity: number; // current speed in m/s
  acceleration: number; // current acceleration in m/s^2
  tension: number; // rope tension in Newtons
  normal1: number; // normal force on m1 (N)
  normal2: number; // normal force on m2 (N)
  friction1: number; // friction force on m1 (N)
  friction2: number; // friction force on m2 (N)
  drivingForce: number; // m1 * g * sin(theta) (N)
  netForce: number; // total accelerating force (N)
  isMoving: boolean;
  hasReachedLimit: boolean;
}

export interface PulleyModelInfo {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  status: "active" | "coming_soon";
}

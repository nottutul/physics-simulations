export type ReferenceFrame = "ground" | "bus";
export type Direction = "right" | "left";

export type WettingStatus = "front" | "rear" | "roof_only" | "none";

export interface RelativeVelocityParams {
  busSpeed: number; // m/s (>= 0)
  busDirection: Direction; // "right" | "left"
  windSpeed: number; // m/s (>= 0)
  windDirection: Direction; // "right" | "left"
  rainSpeed: number; // m/s (downward vertical >= 1)
  windshieldAngle: number; // degrees from vertical (0 to 60)
  frame: ReferenceFrame; // "ground" | "bus"
  showRainDrops: boolean;
  showResultantVector: boolean;
  showVectorValues: boolean;
  showParallelogram: boolean;
  showGrid: boolean;
  showCalculations: boolean;
}

export interface RelativeVelocityCalculations {
  // Coordinate velocities (m/s)
  v_Bx: number; // signed: + right, - left
  v_Wx: number; // signed: + right, - left
  v_R: number; // vertical downwards (positive)

  // In Bus Frame (বাসের সাপেক্ষে)
  v_rel_x: number; // v_Wx - v_Bx (signed)
  v_rel_y: number; // v_R (downward)
  v_rel_mag: number; // magnitude sqrt(v_rel_x^2 + v_rel_y^2)
  v_rel_angle_deg: number; // angle with vertical in degrees (0 to 90)
  v_rel_angle_signed: number; // signed: + tilts right, - tilts left

  // In Ground Frame (ভূমির সাপেক্ষে)
  v_ground_x: number; // v_Wx (signed)
  v_ground_y: number; // v_R
  v_ground_mag: number; // sqrt(v_Wx^2 + v_R^2)
  v_ground_angle_deg: number; // angle with vertical in degrees

  // Glass wetting determination
  wettingStatus: WettingStatus;
  wettingTitle: string;
  wettingReason: string;
  frontGlassWet: boolean;
  rearGlassWet: boolean;
  roofWet: boolean;
}

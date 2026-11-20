import {
  RelativeVelocityParams,
  RelativeVelocityCalculations,
  WettingStatus,
} from "@/types/relative-velocity";

/**
 * Pure physics calculation function for relative velocity of rain with respect to a moving bus and wind.
 */
export function calculateRelativeVelocity(
  params: RelativeVelocityParams
): RelativeVelocityCalculations {
  // Coordinate velocities (m/s)
  // +x is defined as moving rightwards, -x is leftwards
  // +y is downwards
  const v_Bx =
    params.busDirection === "right" ? params.busSpeed : -params.busSpeed;
  const v_Wx =
    params.windDirection === "right" ? params.windSpeed : -params.windSpeed;
  const v_R = Math.max(0.1, params.rainSpeed); // downward vertical speed

  // In Bus Reference Frame (বাসের সাপেক্ষে বৃষ্টির বেগ):
  // v_{R/B} = v_{R,G} - v_B = (v_Wx - v_Bx, v_R)
  const v_rel_x = v_Wx - v_Bx;
  const v_rel_y = v_R;
  const v_rel_mag = Math.sqrt(v_rel_x * v_rel_x + v_rel_y * v_rel_y);

  // Angle with vertical in bus frame: tan(theta) = |v_rel_x| / v_rel_y
  const v_rel_angle_rad = Math.atan2(Math.abs(v_rel_x), v_rel_y);
  const v_rel_angle_deg = (v_rel_angle_rad * 180) / Math.PI;
  const v_rel_angle_signed = (Math.atan2(v_rel_x, v_rel_y) * 180) / Math.PI;

  // In Ground Reference Frame (ভূমির সাপেক্ষে বৃষ্টির বেগ):
  // v_{R,G} = (v_Wx, v_R)
  const v_ground_x = v_Wx;
  const v_ground_y = v_R;
  const v_ground_mag = Math.sqrt(v_ground_x * v_ground_x + v_ground_y * v_ground_y);
  const v_ground_angle_rad = Math.atan2(Math.abs(v_ground_x), v_ground_y);
  const v_ground_angle_deg = (v_ground_angle_rad * 180) / Math.PI;

  // Glass wetting logic
  // Determine relative horizontal velocity from the perspective of the front of the bus
  // If bus moves right, front is on the right (+x). If rain has v_rel_x < 0, it travels towards -x (into front glass).
  // If bus moves left, front is on the left (-x). If rain has v_rel_x > 0, it travels towards +x (into front glass).
  const isFacingRight = params.busDirection === "right";
  
  // relative forward speed into the front of the bus:
  // If moving right: positive if rain is coming from ahead (i.e. v_rel_x < 0)
  const relHeadwind = isFacingRight ? -v_rel_x : v_rel_x;

  let wettingStatus: WettingStatus = "none";
  let wettingTitle = "";
  let wettingReason = "";
  let frontGlassWet = false;
  let rearGlassWet = false;
  let roofWet = true;

  const EPSILON = 0.08; // threshold for considering strictly vertical

  if (Math.abs(relHeadwind) <= EPSILON) {
    // Rain is falling straight down in the bus frame
    wettingStatus = "roof_only";
    wettingTitle = "কেবল ছাদ ও সামনের হেলানো কাচ ভিজবে";
    wettingReason =
      "যেহেতু বাসের বেগ এবং বাতাসের অনুভূমিক বেগ সমান (v_W = v_B), তাই বাসের সাপেক্ষে বৃষ্টির অনুভূমিক বেগ শূন্য (v_rel_x ≈ 0 m/s)। ফলে বৃষ্টি সম্পূর্ণ খাড়াভাবে নিচে পড়ছে; পিছনের খাড়া কাচ সম্পূর্ণ শুকনা থাকবে।";
    frontGlassWet = params.windshieldAngle > 5; // slanted front windshield gets rain from above
    rearGlassWet = false;
    roofWet = true;
  } else if (relHeadwind > EPSILON) {
    // Rain is coming from the front relative to the bus
    wettingStatus = "front";
    wettingTitle = "সামনের কাচ ভিজবে (Front Glass Wet)";
    frontGlassWet = true;
    rearGlassWet = false;
    roofWet = true;

    if (params.busSpeed === 0) {
      wettingReason =
        "বাস স্থির থাকায় বাতাসের কারণে বৃষ্টি সামনে থেকে হেলে পড়ছে এবং সরাসরি সামনের কাচে আঘাত করছে।";
    } else if (params.windSpeed === 0) {
      wettingReason =
        "কোনো বাতাস নেই (v_W = 0)। কিন্তু বাস গতিশীল হওয়ায় বাসের সাপেক্ষে বৃষ্টি সম্মুখ দিক থেকে এসে পিছনের দিকে কোণ করে পড়ছে (v_rel_x = -v_B)। তাই সামনের কাচ ভিজবে।";
    } else if (
      (isFacingRight && v_Wx < 0) ||
      (!isFacingRight && v_Wx > 0)
    ) {
      wettingReason =
        "বাসের গতির বিপরীত দিক থেকে বাতাস বইছে (বিপরীতমুখী বাতাস)। ফলে বৃষ্টি তীব্র বেগে সম্মুখ কাচে এসে আঘাত করছে।";
    } else {
      wettingReason =
        "যদিও বাতাস বাসের দিকেই বইছে, কিন্তু বাসের বেগ বাতাসের বেগের চেয়ে বেশি (v_B > v_W)। ফলে বাসের সাপেক্ষে বৃষ্টি সামনের দিক থেকে এসেই কাচে আঘাত করছে।";
    }
  } else {
    // Rain is catching up from the rear relative to the bus (relHeadwind < -EPSILON)
    wettingStatus = "rear";
    wettingTitle = "পিছনের কাচ ভিজবে (Rear Glass Wet)";
    frontGlassWet = false;
    rearGlassWet = true;
    roofWet = true;

    wettingReason =
      "বাতাসের বেগ বাসের বেগের চেয়ে বেশি (v_W > v_B) এবং বাতাস বাসের গতির দিকে বইছে। ফলে বাতাস বৃষ্টিকে বাসের চেয়ে দ্রুত সামনে ঠেলে নিয়ে আসছে এবং বাসের সাপেক্ষে বৃষ্টি পিছন দিক থেকে এসে পিছনের কাচে আঘাত করছে।";
  }

  return {
    v_Bx,
    v_Wx,
    v_R,
    v_rel_x,
    v_rel_y,
    v_rel_mag,
    v_rel_angle_deg,
    v_rel_angle_signed,
    v_ground_x,
    v_ground_y,
    v_ground_mag,
    v_ground_angle_deg,
    wettingStatus,
    wettingTitle,
    wettingReason,
    frontGlassWet,
    rearGlassWet,
    roofWet,
  };
}

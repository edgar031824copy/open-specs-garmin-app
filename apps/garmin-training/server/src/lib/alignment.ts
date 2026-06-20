import { GarminActivity, speedToPace } from './garmin';

export type AlignmentStatus = 'aligned' | 'not_aligned' | 'missed';

export interface AlignmentResult {
  status: AlignmentStatus;
  actualDistanceKm: number | null;
  actualPace: string | null;
  deviationReason: string | null;
}

// Extract planned distance in km from training description e.g. "6 km easy", "12 km long run"
function parsePlannedDistance(training: string): number | null {
  const match = training.match(/(\d+(?:\.\d+)?)\s*km/i);
  return match ? parseFloat(match[1]) : null;
}

// Extract pace range in seconds/km from training e.g. "5:40–5:50/km", "5:40-5:50/km"
function parsePaceRange(training: string): { minSecs: number; maxSecs: number } | null {
  const match = training.match(/(\d+):(\d+)\s*[–-]\s*(\d+):(\d+)\s*\/km/);
  if (!match) return null;
  const minSecs = parseInt(match[1]) * 60 + parseInt(match[2]);
  const maxSecs = parseInt(match[3]) * 60 + parseInt(match[4]);
  return { minSecs, maxSecs };
}

function paceStringToSecs(pace: string): number {
  const [mins, secs] = pace.split(':').map(Number);
  return mins * 60 + secs;
}

export function computeAlignment(training: string, activities: GarminActivity[]): AlignmentResult {
  if (activities.length === 0) {
    return { status: 'missed', actualDistanceKm: null, actualPace: null, deviationReason: null };
  }

  // Use the longest running activity for the day
  const activity = activities.reduce((a, b) => (a.distance > b.distance ? a : b));
  const actualKm = activity.distance / 1000;
  const actualPace = speedToPace(activity.averageSpeed);

  const plannedKm = parsePlannedDistance(training);
  const paceRange = parsePaceRange(training);

  // Distance check
  if (plannedKm !== null) {
    const deviation = Math.abs(actualKm - plannedKm) / plannedKm;
    if (deviation > 0.1) {
      return {
        status: 'not_aligned',
        actualDistanceKm: actualKm,
        actualPace,
        deviationReason: `distance_deviation: planned ${plannedKm}km, actual ${actualKm.toFixed(2)}km`,
      };
    }
  }

  // Pace check
  if (paceRange !== null) {
    const actualSecs = paceStringToSecs(actualPace);
    const tolerance = 10; // seconds
    if (actualSecs < paceRange.minSecs - tolerance || actualSecs > paceRange.maxSecs + tolerance) {
      return {
        status: 'not_aligned',
        actualDistanceKm: actualKm,
        actualPace,
        deviationReason: `pace_deviation: target ${paceRange.minSecs / 60}:${paceRange.minSecs % 60}–${paceRange.maxSecs / 60}:${paceRange.maxSecs % 60}/km, actual ${actualPace}/km`,
      };
    }
  }

  return { status: 'aligned', actualDistanceKm: actualKm, actualPace, deviationReason: null };
}

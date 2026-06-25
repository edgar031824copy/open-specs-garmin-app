import { GarminActivity, speedToPace } from './garmin';

export type AlignmentStatus = 'aligned' | 'not_aligned' | 'missed';

export interface AlignmentResult {
  status: AlignmentStatus;
  actualDistanceKm: number | null;
  actualPace: string | null;
  deviationReason: string | null;
}

// Extract planned distance range from training description.
// Handles "5–6 km" or "5-6 km" → { min: 5, max: 6 }; "6 km" → { min: 6, max: 6 }
function parseDistanceRange(training: string): { min: number; max: number } | null {
  const rangeMatch = training.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*km/i);
  if (rangeMatch) return { min: parseFloat(rangeMatch[1]), max: parseFloat(rangeMatch[2]) };
  const singleMatch = training.match(/(\d+(?:\.\d+)?)\s*km/i);
  if (singleMatch) { const n = parseFloat(singleMatch[1]); return { min: n, max: n }; }
  return null;
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

  const distanceRange = parseDistanceRange(training);
  const paceRange = parsePaceRange(training);

  // Distance check
  if (distanceRange !== null) {
    const { min, max } = distanceRange;
    const isRange = min !== max;
    const outOfRange = isRange
      ? (actualKm < min && (min - actualKm) / min > 0.1) || (actualKm > max && (actualKm - max) / max > 0.1)
      : Math.abs(actualKm - min) / min > 0.1;
    if (outOfRange) {
      const plannedLabel = isRange ? `${min}–${max}km` : `${min}km`;
      return {
        status: 'not_aligned',
        actualDistanceKm: actualKm,
        actualPace,
        deviationReason: `distance_deviation: planned ${plannedLabel}, actual ${actualKm.toFixed(2)}km`,
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

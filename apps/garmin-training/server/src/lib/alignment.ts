import { GarminActivity, speedToPace, getHrTimeInZones } from './garmin';

export type AlignmentStatus = 'aligned' | 'not_aligned' | 'missed';

export interface AlignmentResult {
  status: AlignmentStatus;
  actualDistanceKm: number | null;
  actualPace: string | null;
  deviationReason: string | null;
}

export interface ZoneDeviation {
  targetZone: number;
  actualZonePercent: number;
  message: string;
}

const ZONE_DEVIATION_THRESHOLD_PERCENT = 50;

// Extract a single named heart-rate zone from training description, e.g. "Z2" or "Zone 2".
export function parseTargetZone(training: string): number | null {
  const match = training.match(/\bZ(?:one)?\s*([1-5])\b/i);
  return match ? parseInt(match[1]) : null;
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
        deviationReason: `pace_deviation: target ${Math.floor(paceRange.minSecs / 60)}:${String(paceRange.minSecs % 60).padStart(2, '0')}–${Math.floor(paceRange.maxSecs / 60)}:${String(paceRange.maxSecs % 60).padStart(2, '0')}/km, actual ${actualPace}/km`,
      };
    }
  }

  return { status: 'aligned', actualDistanceKm: actualKm, actualPace, deviationReason: null };
}

// Non-blocking zone deviation annotation. Never affects AlignmentResult/alignment_status.
export async function computeZoneDeviation(
  training: string,
  activity: GarminActivity | null
): Promise<ZoneDeviation | null> {
  const targetZone = parseTargetZone(training);
  if (targetZone === null || !activity) return null;

  // The activities-list summary's `hasHrTimeInZones` flag isn't reliably
  // populated by the search endpoint, so always attempt the fetch and let
  // getHrTimeInZones' own null-on-failure handle absence of data.
  const zones = await getHrTimeInZones(activity.activityId);
  if (!zones || zones.length === 0) {
    console.log(`computeZoneDeviation: no zone data returned for activity ${activity.activityId}`);
    return null;
  }

  const totalSecs = zones.reduce((sum, z) => sum + z.secsInZone, 0);
  if (totalSecs === 0) return null;

  const targetSecs = zones.find(z => z.zoneNumber === targetZone)?.secsInZone ?? 0;
  const actualZonePercent = Math.round((targetSecs / totalSecs) * 100);

  if (actualZonePercent >= ZONE_DEVIATION_THRESHOLD_PERCENT) return null;

  const dominant = zones.reduce((a, b) => (a.secsInZone > b.secsInZone ? a : b));
  const dominantPercent = Math.round((dominant.secsInZone / totalSecs) * 100);

  return {
    targetZone,
    actualZonePercent,
    message: `Mostly Z${dominant.zoneNumber} instead of Z${targetZone} (${dominantPercent}% vs ${actualZonePercent}%)`,
  };
}

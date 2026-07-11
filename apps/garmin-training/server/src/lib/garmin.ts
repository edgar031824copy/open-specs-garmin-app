import { GarminConnect } from 'garmin-connect';

export interface GarminActivity {
  activityId: number;
  activityName: string;
  startTimeLocal: string;
  distance: number; // meters
  duration: number; // seconds
  averageSpeed: number; // m/s
  activityType: { typeKey: string };
  hasHrTimeInZones: boolean;
}

export interface HrZoneTime {
  zoneNumber: number;
  secsInZone: number;
}

let client: GarminConnect | null = null;

async function getClient(): Promise<GarminConnect> {
  if (client) return client;

  const email = process.env.GARMIN_EMAIL;
  const password = process.env.GARMIN_PASSWORD;
  if (!email || !password) throw new Error('GARMIN_EMAIL and GARMIN_PASSWORD env vars are required');

  const gc = new GarminConnect({ username: email, password });
  await gc.login();
  client = gc;
  return client;
}

export async function getActivitiesForDate(dateStr: string): Promise<GarminActivity[]> {
  const gc = await getClient();

  // Fetch activities and filter by date and running type
  const activities = (await gc.getActivities(0, 20)) as unknown as GarminActivity[];
  return activities
    .filter(a => {
      const actDate = a.startTimeLocal?.split(' ')[0];
      return actDate === dateStr && a.activityType?.typeKey === 'running';
    })
    .map(a => ({ ...a, hasHrTimeInZones: a.hasHrTimeInZones ?? false }));
}

// Time-in-zone breakdown for an activity. garmin-connect doesn't wrap this
// endpoint, so hit it via the client's own authenticated get<T>().
export async function getHrTimeInZones(activityId: number): Promise<HrZoneTime[] | null> {
  try {
    const gc = await getClient();
    const url = `https://connectapi.garmin.com/activity-service/activity/${activityId}/hrTimeInZones`;
    const data = await gc.get<Array<{ zoneNumber: number; secsInZone: number }>>(url);
    if (!Array.isArray(data)) return null;
    return data.map(z => ({ zoneNumber: z.zoneNumber, secsInZone: z.secsInZone }));
  } catch (err) {
    console.error('getHrTimeInZones failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

// meters/second → min/km string (e.g. "5:30")
export function speedToPace(metersPerSecond: number): string {
  if (!metersPerSecond || metersPerSecond === 0) return '0:00';
  const secsPerKm = 1000 / metersPerSecond;
  const mins = Math.floor(secsPerKm / 60);
  const secs = Math.round(secsPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

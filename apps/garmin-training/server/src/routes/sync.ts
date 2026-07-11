import { Router, Request, Response } from 'express';
import { getActivitiesForDate, GarminActivity } from '../lib/garmin';
import { computeAlignment, computeZoneDeviation } from '../lib/alignment';
import { getAlternateDateStrings } from '../lib/dateResolver';
import pool from '../db';

const router = Router();

router.post('/sync', async (_req: Request, res: Response) => {
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  try {
    const { rows: sessions } = await pool.query(
      `SELECT * FROM plan_sessions WHERE session_date <= $1 ORDER BY session_date ASC`,
      [todayStr]
    );

    const results = [];

    for (const session of sessions) {
      let activities: GarminActivity[];
      const primaryDate = new Date(session.session_date).toISOString().slice(0, 10);
      try {
        activities = await getActivitiesForDate(primaryDate);

        if (activities.length === 0 && session.is_flexible) {
          const alternateDates = getAlternateDateStrings(primaryDate, session.week_day);
          for (const altDate of alternateDates) {
            const altActivities = await getActivitiesForDate(altDate);
            if (altActivities.length > 0) {
              activities = altActivities;
              break;
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        if (msg.includes('auth') || msg.includes('login') || msg.includes('401')) {
          return res.status(503).json({ error: 'Garmin authentication failed' });
        }
        activities = [];
      }

      const alreadySynced = ['aligned', 'not_aligned'].includes(session.alignment_status);
      if (activities.length === 0 && alreadySynced) {
        results.push({ sessionDate: session.session_date, status: session.alignment_status });
        continue;
      }

      const alignment = computeAlignment(session.training, activities);
      const longestActivity =
        activities.length > 0 ? activities.reduce((a, b) => (a.distance > b.distance ? a : b)) : null;
      const zoneDeviation = await computeZoneDeviation(session.training, longestActivity);

      await pool.query(
        `UPDATE plan_sessions
         SET alignment_status = $1, actual_distance = $2, actual_pace = $3, deviation_reason = $4, zone_deviation = $5
         WHERE id = $6`,
        [
          alignment.status,
          alignment.actualDistanceKm,
          alignment.actualPace,
          alignment.deviationReason,
          zoneDeviation ? JSON.stringify(zoneDeviation) : null,
          session.id,
        ]
      );

      results.push({ sessionDate: session.session_date, status: alignment.status, zoneDeviation });
    }

    await pool.query(`DELETE FROM suggestions WHERE status IN ('pending', 'rejected')`);

    res.json({ synced: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default router;

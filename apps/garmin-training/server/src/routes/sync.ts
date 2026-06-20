import { Router, Request, Response } from 'express';
import { getActivitiesForDate, GarminActivity } from '../lib/garmin';
import { computeAlignment } from '../lib/alignment';
import { getAlternateDateStrings } from '../lib/dateResolver';
import pool from '../db';

const router = Router();

router.post('/sync', async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  try {
    const { rows: sessions } = await pool.query(
      `SELECT * FROM plan_sessions WHERE session_date <= $1 ORDER BY session_date ASC`,
      [today.toISOString().split('T')[0]]
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

      const alignment = computeAlignment(session.training, activities);

      await pool.query(
        `UPDATE plan_sessions
         SET alignment_status = $1, actual_distance = $2, actual_pace = $3, deviation_reason = $4
         WHERE id = $5`,
        [
          alignment.status,
          alignment.actualDistanceKm,
          alignment.actualPace,
          alignment.deviationReason,
          session.id,
        ]
      );

      results.push({ sessionDate: session.session_date, status: alignment.status });
    }

    res.json({ synced: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

export default router;

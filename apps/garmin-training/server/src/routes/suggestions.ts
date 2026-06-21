import { Router, Request, Response } from 'express';
import { generateSuggestions } from '../lib/claude';
import pool from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { rows: deviatedSessions } = await pool.query(
      `SELECT session_date, training, alignment_status, deviation_reason
       FROM plan_sessions
       WHERE alignment_status IN ('not_aligned', 'missed')
         AND session_date NOT IN (SELECT session_date FROM plan_modifications)
       ORDER BY session_date ASC`
    );

    const { rows: upcomingSessions } = await pool.query(
      `SELECT session_date, training
       FROM plan_sessions
       WHERE session_date > $1
         AND alignment_status = 'upcoming'
         AND session_date NOT IN (SELECT session_date FROM plan_modifications)
       ORDER BY session_date ASC`,
      [today]
    );

    if (deviatedSessions.length === 0) {
      return res.json([]);
    }

    const toDateStr = (d: unknown) => new Date(d as string).toISOString().slice(0, 10);

    const suggestions = await generateSuggestions(
      deviatedSessions.map(s => ({
        sessionDate: toDateStr(s.session_date),
        training: s.training,
        alignmentStatus: s.alignment_status,
        deviationReason: s.deviation_reason,
      })),
      upcomingSessions.map(s => ({
        sessionDate: toDateStr(s.session_date),
        training: s.training,
      }))
    );

    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

router.post('/accept', async (req: Request, res: Response) => {
  const { sessionDate, originalTraining, suggestedTraining, reason } = req.body;
  if (!sessionDate || !originalTraining || !suggestedTraining) {
    return res.status(400).json({ error: 'sessionDate, originalTraining, and suggestedTraining are required' });
  }

  try {
    await pool.query(
      `INSERT INTO plan_modifications (session_date, original_training, suggested_training, reason)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (session_date) DO UPDATE
       SET suggested_training = EXCLUDED.suggested_training, reason = EXCLUDED.reason, accepted_at = now()`,
      [sessionDate, originalTraining, suggestedTraining, reason ?? null]
    );
    res.json({ accepted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save modification' });
  }
});

router.post('/reject', (_req: Request, res: Response) => {
  res.json({ rejected: true });
});

export default router;

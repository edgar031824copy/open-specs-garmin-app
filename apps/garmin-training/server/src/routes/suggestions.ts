import { Router, Request, Response } from 'express';
import { generateSuggestions } from '../lib/claude';
import pool from '../db';

const router = Router();

const toDateStr = (d: unknown) => new Date(d as string).toISOString().slice(0, 10);

// Read cached pending suggestions from DB — no Claude call
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT session_date, original_training, suggested_training, reason
       FROM suggestions
       WHERE status = 'pending'
       ORDER BY session_date ASC`
    );
    res.json(rows.map(r => ({
      sessionDate: toDateStr(r.session_date),
      originalTraining: r.original_training,
      suggestedTraining: r.suggested_training,
      reason: r.reason,
    })));
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

// Call Claude, persist results, skip only accepted rows
// Rejected rows are cleared by sync so they restart the suggestion flow
router.post('/generate', async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { rows: decidedRows } = await pool.query(
      `SELECT session_date FROM suggestions WHERE status = 'accepted'`
    );
    const decidedDates = new Set(decidedRows.map(r => toDateStr(r.session_date)));

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

    const eligibleDeviated = deviatedSessions.filter(
      s => !decidedDates.has(toDateStr(s.session_date))
    );

    if (eligibleDeviated.length === 0) {
      return res.json([]);
    }

    const suggestions = await generateSuggestions(
      eligibleDeviated.map(s => ({
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

    for (const s of suggestions) {
      await pool.query(
        `INSERT INTO suggestions (session_date, original_training, suggested_training, reason, status, generated_at)
         VALUES ($1, $2, $3, $4, 'pending', now())
         ON CONFLICT (session_date) DO UPDATE
           SET original_training = EXCLUDED.original_training,
               suggested_training = EXCLUDED.suggested_training,
               reason = EXCLUDED.reason,
               status = 'pending',
               generated_at = now()
         WHERE suggestions.status = 'pending'`,
        [s.sessionDate, s.originalTraining, s.suggestedTraining, s.reason ?? null]
      );
    }

    const { rows: result } = await pool.query(
      `SELECT session_date, original_training, suggested_training, reason FROM suggestions WHERE status = 'pending' ORDER BY session_date ASC`
    );
    res.json(result.map(r => ({
      sessionDate: toDateStr(r.session_date),
      originalTraining: r.original_training,
      suggestedTraining: r.suggested_training,
      reason: r.reason,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
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
    await pool.query(
      `UPDATE suggestions SET status = 'accepted' WHERE session_date = $1`,
      [sessionDate]
    );
    res.json({ accepted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save modification' });
  }
});

router.post('/reject', async (req: Request, res: Response) => {
  const { sessionDate } = req.body;
  if (!sessionDate) {
    return res.status(400).json({ error: 'sessionDate is required' });
  }
  try {
    await pool.query(
      `UPDATE suggestions SET status = 'rejected' WHERE session_date = $1`,
      [sessionDate]
    );
    res.json({ rejected: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject suggestion' });
  }
});

export default router;

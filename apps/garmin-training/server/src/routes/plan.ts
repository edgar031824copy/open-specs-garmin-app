import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseCSV, parseXLS } from '../lib/parser';
import { resolveDates } from '../lib/dateResolver';
import pool from '../db';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const ALLOWED_MIMETYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const mimetype = req.file.mimetype;
  const originalname = req.file.originalname.toLowerCase();

  const isCSV = mimetype === 'text/csv' || originalname.endsWith('.csv');
  const isXLS = originalname.endsWith('.xls') || originalname.endsWith('.xlsx') ||
    ALLOWED_MIMETYPES.slice(1).includes(mimetype);

  if (!isCSV && !isXLS) {
    return res.status(400).json({ error: 'Unsupported file format. Upload a CSV, XLS, or XLSX file.' });
  }

  const planStartDate = req.body.planStartDate;
  if (!planStartDate) return res.status(400).json({ error: 'planStartDate is required' });

  const startDate = new Date(planStartDate + 'T12:00:00');
  if (isNaN(startDate.getTime())) return res.status(400).json({ error: 'Invalid planStartDate format' });

  try {
    const rows = isCSV ? parseCSV(req.file.buffer) : parseXLS(req.file.buffer);
    const sessions = resolveDates(rows, startDate);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM suggestions');
      await client.query('DELETE FROM plan_modifications');
      await client.query('DELETE FROM plan_sessions');
      await client.query('DELETE FROM plan_metadata');

      for (const s of sessions) {
        await client.query(
          `INSERT INTO plan_sessions (week, week_day, session_date, training, is_flexible)
           VALUES ($1, $2, $3, $4, $5)`,
          [s.week, s.weekDay, s.sessionDate.toISOString().split('T')[0], s.training, s.isFlexible]
        );
      }
      await client.query(
        `INSERT INTO plan_metadata (plan_filename, plan_start_date) VALUES ($1, $2)`,
        [req.file.originalname, planStartDate]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.json({ imported: sessions.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process file';
    res.status(400).json({ error: message });
  }
});

router.get('/sessions', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        ps.*,
        pm.suggested_training,
        pm.reason as modification_reason
      FROM plan_sessions ps
      LEFT JOIN plan_modifications pm ON pm.session_date = ps.session_date
      ORDER BY ps.session_date ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

router.get('/metadata', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT plan_filename AS "planFilename", plan_start_date AS "planStartDate" FROM plan_metadata LIMIT 1`
    );
    res.json(rows[0] ?? null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan metadata' });
  }
});

export default router;

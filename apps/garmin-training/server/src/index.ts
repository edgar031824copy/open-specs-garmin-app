import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import planRouter from './routes/plan';
import syncRouter from './routes/sync';
import suggestionsRouter from './routes/suggestions';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors(process.env.ALLOWED_ORIGIN ? { origin: process.env.ALLOWED_ORIGIN } : undefined));
app.use(express.json());

app.use('/api/plan', planRouter);
app.use('/api', syncRouter);
app.use('/api/suggestions', suggestionsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

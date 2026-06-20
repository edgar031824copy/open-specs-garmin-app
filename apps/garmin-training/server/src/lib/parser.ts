import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface PlanRow {
  week: string;
  weekDay: string;
  training: string;
}

const REQUIRED_COLUMNS = ['Week', 'Day', 'Training'];

function validateColumns(headers: string[]): void {
  const missing = REQUIRED_COLUMNS.filter(
    col => !headers.some(h => h.trim().toLowerCase() === col.toLowerCase())
  );
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`);
  }
}

function normalizeRows(records: Record<string, string>[]): PlanRow[] {
  return records
    .filter(r => r['Week'] && r['Day'] && r['Training'])
    .map(r => ({
      week: r['Week'].trim(),
      weekDay: r['Day'].trim(),
      training: r['Training'].trim(),
    }));
}

export function parseCSV(buffer: Buffer): PlanRow[] {
  const text = buffer.toString('utf-8');
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  validateColumns(result.meta.fields ?? []);
  return normalizeRows(result.data);
}

export function parseXLS(buffer: Buffer): PlanRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const records = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
  if (records.length === 0) throw new Error('Spreadsheet is empty');
  validateColumns(Object.keys(records[0]));
  return normalizeRows(records);
}

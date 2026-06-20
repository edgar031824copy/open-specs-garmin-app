import { PlanRow } from './parser';

const DAY_OFFSETS: Record<string, number> = {
  monday: 0, mon: 0,
  tuesday: 1, tue: 1,
  wednesday: 2, wed: 2,
  thursday: 3, thu: 3,
  friday: 4, fri: 4,
  saturday: 5, sat: 5,
  sunday: 6, sun: 6,
};

function parseWeekNumber(week: string): number {
  const match = week.match(/(\d+)/);
  if (!match) throw new Error(`Cannot parse week number from: "${week}"`);
  return parseInt(match[1], 10);
}

function parseDayOffset(day: string): { offset: number; isFlexible: boolean; alternateNames: string[] } {
  const normalized = day.toLowerCase().trim();
  if (normalized.includes('/')) {
    const parts = normalized.split('/').map(p => p.trim());
    const primary = parts[0];
    return { offset: DAY_OFFSETS[primary] ?? 4, isFlexible: true, alternateNames: parts.slice(1) };
  }
  const offset = DAY_OFFSETS[normalized];
  if (offset === undefined) throw new Error(`Unknown day: "${day}"`);
  return { offset, isFlexible: false, alternateNames: [] };
}

export interface ResolvedSession {
  week: string;
  weekDay: string;
  training: string;
  sessionDate: Date;
  isFlexible: boolean;
  alternateDates: Date[];
}

// Returns YYYY-MM-DD strings for each alternate date given a stored week_day like "Fri/Sat"
// and the already-resolved primary session date string.
export function getAlternateDateStrings(primaryDateStr: string, weekDay: string): string[] {
  const normalized = weekDay.toLowerCase().trim();
  if (!normalized.includes('/')) return [];
  const parts = normalized.split('/').map(p => p.trim());
  const primaryName = parts[0];
  const primaryOffset = DAY_OFFSETS[primaryName];
  if (primaryOffset === undefined) return [];

  const dateOnly = primaryDateStr.slice(0, 10);
  const primary = new Date(dateOnly + 'T12:00:00');
  return parts.slice(1).flatMap(name => {
    const altOffset = DAY_OFFSETS[name];
    if (altOffset === undefined) return [];
    const diff = altOffset - primaryOffset;
    const alt = new Date(primary);
    alt.setDate(primary.getDate() + diff);
    return [alt.toISOString().split('T')[0]];
  });
}

export function resolveDates(rows: PlanRow[], planStartDate: Date): ResolvedSession[] {
  // planStartDate must be the Monday of Week 1
  const monday = new Date(planStartDate);
  monday.setHours(0, 0, 0, 0);

  return rows.map(row => {
    const weekNum = parseWeekNumber(row.week);
    const { offset, isFlexible, alternateNames } = parseDayOffset(row.weekDay);
    const sessionDate = new Date(monday);
    sessionDate.setDate(monday.getDate() + (weekNum - 1) * 7 + offset);
    const alternateDates = alternateNames.map(name => {
      const altDate = new Date(monday);
      altDate.setDate(monday.getDate() + (weekNum - 1) * 7 + (DAY_OFFSETS[name] ?? offset));
      return altDate;
    });
    return { ...row, sessionDate, isFlexible, alternateDates };
  });
}

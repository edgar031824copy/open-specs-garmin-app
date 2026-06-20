import { PlanRow } from './parser';

const DAY_OFFSETS: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

function parseWeekNumber(week: string): number {
  const match = week.match(/(\d+)/);
  if (!match) throw new Error(`Cannot parse week number from: "${week}"`);
  return parseInt(match[1], 10);
}

function parseDayOffset(day: string): { offset: number; isFlexible: boolean } {
  const normalized = day.toLowerCase().trim();
  // Handle "Friday/Saturday" — use Friday, flag as flexible
  if (normalized.includes('/')) {
    const primary = normalized.split('/')[0].trim();
    return { offset: DAY_OFFSETS[primary] ?? 4, isFlexible: true };
  }
  const offset = DAY_OFFSETS[normalized];
  if (offset === undefined) throw new Error(`Unknown day: "${day}"`);
  return { offset, isFlexible: false };
}

export interface ResolvedSession {
  week: string;
  weekDay: string;
  training: string;
  sessionDate: Date;
  isFlexible: boolean;
}

export function resolveDates(rows: PlanRow[], planStartDate: Date): ResolvedSession[] {
  // planStartDate must be the Monday of Week 1
  const monday = new Date(planStartDate);
  monday.setHours(0, 0, 0, 0);

  return rows.map(row => {
    const weekNum = parseWeekNumber(row.week);
    const { offset, isFlexible } = parseDayOffset(row.weekDay);
    const sessionDate = new Date(monday);
    sessionDate.setDate(monday.getDate() + (weekNum - 1) * 7 + offset);
    return { ...row, sessionDate, isFlexible };
  });
}

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
});

export interface PlanSession {
  id: number;
  week: string;
  week_day: string;
  session_date: string;
  training: string;
  is_flexible: boolean;
  alignment_status: 'aligned' | 'not_aligned' | 'missed' | 'upcoming';
  actual_distance: number | null;
  actual_pace: string | null;
  deviation_reason: string | null;
  suggested_training: string | null;
  modification_reason: string | null;
}

export interface Suggestion {
  sessionDate: string;
  originalTraining: string;
  suggestedTraining: string;
  reason: string;
}

export const uploadPlan = (file: File, planStartDate: string) => {
  const form = new FormData();
  form.append('file', file);
  form.append('planStartDate', planStartDate);
  return api.post<{ imported: number }>('/api/plan/upload', form);
};

export const fetchSessions = () => api.get<PlanSession[]>('/api/plan/sessions');

export const triggerSync = () => api.post<{ synced: number }>('/api/sync');

export const fetchSuggestions = () => api.get<Suggestion[]>('/api/suggestions');

export interface PlanMetadata {
  planFilename: string;
  planStartDate: string;
}

export const fetchPlanMetadata = () => api.get<PlanMetadata | null>('/api/plan/metadata');

export const acceptSuggestion = (s: Suggestion) =>
  api.post('/api/suggestions/accept', {
    sessionDate: s.sessionDate,
    originalTraining: s.originalTraining,
    suggestedTraining: s.suggestedTraining,
    reason: s.reason,
  });

export const rejectSuggestion = () => api.post('/api/suggestions/reject');

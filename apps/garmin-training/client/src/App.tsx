import React, { useEffect, useState, useCallback } from 'react';
import UploadForm from './components/UploadForm';
import PlanView from './components/PlanView';
import SuggestionsPanel from './components/SuggestionsPanel';
import { fetchSessions, fetchSuggestions, PlanSession, Suggestion } from './api';

export default function App() {
  const [sessions, setSessions] = useState<PlanSession[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const loadData = useCallback(async () => {
    const [sessRes, sugRes] = await Promise.allSettled([fetchSessions(), fetchSuggestions()]);
    if (sessRes.status === 'fulfilled') setSessions(sessRes.value.data);
    if (sugRes.status === 'fulfilled') setSuggestions(sugRes.value.data);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <main>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0', textAlign: 'center' }}>
        Garmin Training Tracker
      </h1>
      <UploadForm onUploaded={loadData} />
      <SuggestionsPanel suggestions={suggestions} onAction={loadData} />
      <PlanView sessions={sessions} onRefresh={loadData} />
    </main>
  );
}

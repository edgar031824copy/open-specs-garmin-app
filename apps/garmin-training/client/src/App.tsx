import React, { useEffect, useState, useCallback } from 'react';
import UploadForm from './components/UploadForm';
import PlanView from './components/PlanView';
import SuggestionsPanel from './components/SuggestionsPanel';
import { fetchSessions, fetchSuggestions, generateSuggestions, fetchPlanMetadata, PlanSession, Suggestion, PlanMetadata } from './api';

export default function App() {
  const [sessions, setSessions] = useState<PlanSession[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [planMetadata, setPlanMetadata] = useState<PlanMetadata | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const loadSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    try {
      const res = await fetchSuggestions();
      setSuggestions(res.data);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleGenerateSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    try {
      const res = await generateSuggestions();
      setSuggestions(res.data);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setSessionsLoading(true);
    const [sessRes, metaRes] = await Promise.allSettled([
      fetchSessions(),
      fetchPlanMetadata(),
    ]);
    if (sessRes.status === 'fulfilled') setSessions(sessRes.value.data);
    setSessionsLoading(false);
    if (metaRes.status === 'fulfilled') setPlanMetadata(metaRes.value.data);
  }, []);

  useEffect(() => {
    loadAll();
    loadSuggestions();
  }, [loadAll, loadSuggestions]);

  return (
    <main>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0', textAlign: 'center' }}>
        Garmin Training Tracker
      </h1>
      <UploadForm onUploaded={loadAll} onBeforeUpload={() => setUploadCount(c => c + 1)} />
      <SuggestionsPanel
        suggestions={suggestions}
        sessions={sessions}
        onAccepted={() => { loadAll(); loadSuggestions(); }}
        onGenerate={handleGenerateSuggestions}
        loading={suggestionsLoading}
      />
      <PlanView key={uploadCount} sessions={sessions} onRefresh={loadAll} loading={sessionsLoading} planFilename={planMetadata?.planFilename} planStartDate={planMetadata?.planStartDate} />
    </main>
  );
}

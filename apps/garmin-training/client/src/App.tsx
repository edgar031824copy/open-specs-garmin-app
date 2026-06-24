import React, { useEffect, useState, useCallback } from 'react';
import UploadForm from './components/UploadForm';
import PlanView from './components/PlanView';
import SuggestionsPanel from './components/SuggestionsPanel';
import { fetchSessions, fetchSuggestions, fetchPlanMetadata, PlanSession, Suggestion, PlanMetadata } from './api';

export default function App() {
  const [sessions, setSessions] = useState<PlanSession[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [planMetadata, setPlanMetadata] = useState<PlanMetadata | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const loadAll = useCallback(async () => {
    setSessionsLoading(true);
    setSuggestionsLoading(true);
    const [sessRes, sugRes, metaRes] = await Promise.allSettled([
      fetchSessions(),
      fetchSuggestions(),
      fetchPlanMetadata(),
    ]);
    if (sessRes.status === 'fulfilled') setSessions(sessRes.value.data);
    setSessionsLoading(false);
    if (sugRes.status === 'fulfilled') setSuggestions(sugRes.value.data);
    setSuggestionsLoading(false);
    if (metaRes.status === 'fulfilled') setPlanMetadata(metaRes.value.data);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <main>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0', textAlign: 'center' }}>
        Garmin Training Tracker
      </h1>
      <UploadForm onUploaded={loadAll} onBeforeUpload={() => setUploadCount(c => c + 1)} />
      <SuggestionsPanel suggestions={suggestions} sessions={sessions} onAccepted={loadAll} loading={suggestionsLoading} />
      <PlanView key={uploadCount} sessions={sessions} onRefresh={loadAll} loading={sessionsLoading} planFilename={planMetadata?.planFilename} planStartDate={planMetadata?.planStartDate} />
    </main>
  );
}

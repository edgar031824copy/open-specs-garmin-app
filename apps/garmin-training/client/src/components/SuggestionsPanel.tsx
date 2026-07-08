import React, { useState, useEffect } from 'react';
import { Suggestion, acceptSuggestion, rejectSuggestion, PlanSession } from '../api';

interface Props {
  suggestions: Suggestion[];
  sessions: PlanSession[];
  onAccepted: () => void;
  onGenerate: () => void;
  loading?: boolean;
}

const appliedBadge = (
  <span style={{
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#1a7f37',
    background: '#d4edda',
    border: '1px solid #a3d9a5',
    borderRadius: 99,
    padding: '0.1rem 0.45rem',
    whiteSpace: 'nowrap',
  }}>
    ✓ Applied
  </span>
);

export default function SuggestionsPanel({ suggestions, sessions, onAccepted, onGenerate, loading }: Props) {
  const [list, setList] = useState(suggestions);

  useEffect(() => setList(suggestions), [suggestions]);

  const appliedDates = new Set(
    sessions
      .filter(s => s.suggested_training != null)
      .map(s => s.session_date.slice(0, 10))
  );

  const formatDate = (d: string) =>
    new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleAccept = async (s: Suggestion) => {
    await acceptSuggestion(s);
    setList(prev => prev.filter(x => x.sessionDate !== s.sessionDate));
    onAccepted();
  };

  const handleReject = async (s: Suggestion, index: number) => {
    setList(prev => prev.filter((_, i) => i !== index));
    await rejectSuggestion(s.sessionDate);
  };

  if (loading) {
    return (
      <section style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>🤖 Suggested Adjustments</h2>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
          <div style={{
            width: 28, height: 28,
            border: '3px solid #e0e0e0',
            borderTopColor: '#007aff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      </section>
    );
  }

  if (list.length === 0) {
    return (
      <section style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>🤖 Suggested Adjustments</h2>
        <button
          onClick={onGenerate}
          style={{ background: '#007aff', color: '#fff', width: '100%', fontSize: '0.95rem', padding: '0.6rem' }}
        >
          Get Suggestions
        </button>
      </section>
    );
  }

  return (
    <section style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>🤖 Suggested Adjustments</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {list.map((s, i) => {
          const isApplied = appliedDates.has(s.sessionDate.slice(0, 10));
          return (
            <div
              key={s.sessionDate}
              style={{
                borderLeft: `3px solid ${isApplied ? '#a3d9a5' : '#007aff'}`,
                paddingLeft: '0.75rem',
                opacity: isApplied ? 0.65 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 2 }}>
                <p style={{ fontSize: '0.85rem', color: '#555', margin: 0 }}>{formatDate(s.sessionDate)}</p>
                {isApplied && appliedBadge}
              </div>
              <p style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem' }}>{s.originalTraining}</p>
              <p style={{ fontWeight: 500 }}>{s.suggestedTraining}</p>
              {s.reason && <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 2 }}>{s.reason}</p>}
              {!isApplied && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleAccept(s)} style={{ background: '#34c759', color: '#fff', flex: 1, fontSize: '0.9rem' }}>
                    Accept
                  </button>
                  <button onClick={() => handleReject(s, i)} style={{ background: '#ff3b30', color: '#fff', flex: 1, fontSize: '0.9rem' }}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

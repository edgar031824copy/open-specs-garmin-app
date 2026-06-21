import React, { useState, useEffect } from 'react';
import { Suggestion, acceptSuggestion } from '../api';

interface Props {
  suggestions: Suggestion[];
  onAccepted: () => void;
}

export default function SuggestionsPanel({ suggestions, onAccepted }: Props) {
  const [list, setList] = useState(suggestions);

  useEffect(() => setList(suggestions), [suggestions]);

  if (list.length === 0) return null;

  const formatDate = (d: string) =>
    new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleAccept = async (s: Suggestion) => {
    await acceptSuggestion(s);
    setList(prev => prev.filter(x => x.sessionDate !== s.sessionDate));
    onAccepted();
  };

  const handleReject = (index: number) => {
    setList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>🤖 Suggested Adjustments</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {list.map((s, i) => (
          <div key={s.sessionDate} style={{ borderLeft: '3px solid #007aff', paddingLeft: '0.75rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: 2 }}>{formatDate(s.sessionDate)}</p>
            <p style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem' }}>{s.originalTraining}</p>
            <p style={{ fontWeight: 500 }}>{s.suggestedTraining}</p>
            {s.reason && <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 2 }}>{s.reason}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={() => handleAccept(s)} style={{ background: '#34c759', color: '#fff', flex: 1, fontSize: '0.9rem' }}>
                Accept
              </button>
              <button onClick={() => handleReject(i)} style={{ background: '#ff3b30', color: '#fff', flex: 1, fontSize: '0.9rem' }}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

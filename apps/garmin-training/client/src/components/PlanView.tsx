import React, { useState } from 'react';
import { PlanSession, triggerSync } from '../api';

interface Props {
  sessions: PlanSession[];
  onRefresh: () => void;
  loading?: boolean;
  planFilename?: string;
  planStartDate?: string;
}

const STATUS_COLORS: Record<string, string> = {
  aligned: '#d4edda',
  not_aligned: '#fff3cd',
  missed: '#f8d7da',
  upcoming: '#e2e3e5',
};

const STATUS_LABELS: Record<string, string> = {
  aligned: '✓ Aligned',
  not_aligned: '⚠ Not aligned',
  missed: '✗ Missed',
  upcoming: '→ Upcoming',
};

const skeletonStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)',
  backgroundSize: '200% 100%',
  borderRadius: 10,
  height: 72,
  animation: 'skeletonPulse 1.4s ease-in-out infinite',
};

export default function PlanView({ sessions, onRefresh, loading, planFilename, planStartDate }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await triggerSync();
      setSyncMsg(`✓ Synced ${res.data.synced} sessions`);
      onRefresh();
    } catch {
      setSyncMsg('Sync failed — check Garmin credentials');
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <section>
      <style>{`
        @keyframes skeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>Training Plan</h2>
        <button onClick={handleSync} disabled={syncing} style={{ background: '#34c759', color: '#fff', fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
          {syncing ? 'Syncing…' : 'Sync Garmin'}
        </button>
      </div>
      {syncMsg && <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{syncMsg}</p>}

      {planFilename && planStartDate && (
        <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.75rem', background: '#f0f0f0', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
          📄 {planFilename} · starts {new Date(planStartDate.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {loading ? (
          <>
            <div style={skeletonStyle} />
            <div style={skeletonStyle} />
            <div style={skeletonStyle} />
          </>
        ) : (
          <>
            {sessions.map(s => (
              <div key={s.id} style={{ background: STATUS_COLORS[s.alignment_status], borderRadius: 10, padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#555' }}>{formatDate(s.session_date)}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{STATUS_LABELS[s.alignment_status]}</span>
                </div>

                <p style={{ marginTop: 4 }}>
                  {s.suggested_training ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem' }}>{s.training}</span>
                      <br />
                      <span style={{ fontSize: '0.95rem' }}>🤖 {s.suggested_training}</span>
                    </>
                  ) : s.training}
                </p>

                {(s.actual_distance || s.actual_pace) && (
                  <p style={{ fontSize: '0.85rem', color: '#444', marginTop: 4 }}>
                    Actual: {s.actual_distance ? `${Number(s.actual_distance).toFixed(2)} km` : ''}
                    {s.actual_pace ? ` @ ${s.actual_pace}/km` : ''}
                  </p>
                )}
              </div>
            ))}
            {sessions.length === 0 && <p style={{ color: '#888' }}>No sessions yet. Upload a plan to get started.</p>}
          </>
        )}
      </div>
    </section>
  );
}

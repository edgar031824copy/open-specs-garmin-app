import React, { useState } from 'react';
import { uploadPlan } from '../api';

interface Props {
  onUploaded: () => void;
}

export default function UploadForm({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !startDate) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await uploadPlan(file, startDate);
      localStorage.setItem('planFilename', file.name);
      localStorage.setItem('planStartDate', startDate);
      setSuccess(`✓ Imported ${res.data.imported} sessions`);
      onUploaded();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Upload failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
      <h2 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Upload Training Plan</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>CSV or XLS file</label>
          <input type="file" accept=".csv,.xls,.xlsx" onChange={e => setFile(e.target.files?.[0] ?? null)} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>Plan start date (Monday of Week 1)</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} style={{ background: '#007aff', color: '#fff' }}>
          {loading ? 'Uploading…' : 'Upload Plan'}
        </button>
        {error && <p style={{ color: '#c00', fontSize: '0.9rem' }}>{error}</p>}
        {success && <p style={{ color: '#090', fontSize: '0.9rem' }}>{success}</p>}
      </form>
    </section>
  );
}

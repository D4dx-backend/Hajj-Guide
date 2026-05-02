import React, { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiExternalLink, FiFile, FiLoader, FiMusic, FiPlus, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ToastContainer, useToast } from '../../components/common/Toast';
import type { AudioFile, AudioType } from '../../types';
import AudioForm from './AudioForm';

const typeLabel: Record<AudioType, string> = { talbiyah: 'Talbiyah', dua: 'Dua', dhikr: 'Dhikr' };

const AudioPage: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<AudioType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AudioFile | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AudioFile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const fetchAudio = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      const response = await api.get('/audio', { params });
      setAudioFiles(response.data.data as AudioFile[]);
    } catch {
      addToast('Failed to load audio files', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, typeFilter]);

  useEffect(() => { fetchAudio(); }, [fetchAudio]);

  const handleCreate = async (formData: FormData) => {
    setFormLoading(true);
    try { await api.post('/audio', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); addToast('Audio created successfully', 'success'); setShowForm(false); fetchAudio(); }
    catch (error: unknown) { const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message; addToast(message || 'Failed to create audio', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editing) return;
    setFormLoading(true);
    try { await api.put(`/audio/${editing._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); addToast('Audio updated successfully', 'success'); setEditing(null); setShowForm(false); fetchAudio(); }
    catch (error: unknown) { const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message; addToast(message || 'Failed to update audio', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try { await api.delete(`/audio/${deleteTarget._id}`); addToast('Audio deleted', 'success'); setDeleteTarget(null); fetchAudio(); }
    catch { addToast('Failed to delete audio', 'error'); }
    finally { setDeleteLoading(false); }
  };

  const toggleActive = async (audio: AudioFile) => {
    try { await api.patch(`/audio/${audio._id}/toggle-active`); setAudioFiles((previous) => previous.map((item) => item._id === audio._id ? { ...item, isActive: !item.isActive } : item)); }
    catch { addToast('Failed to update status', 'error'); }
  };

  const filtered = audioFiles.filter((audio) => !search.trim() || audio.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-shell">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <section className="page-hero"><span className="eyebrow">Media Library</span><div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-3xl font-semibold text-slate-950">Audio</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Manage hosted audio, external sources, supporting links, and cover assets.</p></div><button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><FiPlus className="h-4 w-4" />Add audio</button></div></section>

      <section className="section-panel flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="inline-flex flex-wrap gap-2">{(['all', 'talbiyah', 'dua', 'dhikr'] as const).map((type) => <button key={type} onClick={() => setTypeFilter(type)} className={`filter-chip ${typeFilter === type ? 'filter-chip-active' : ''}`}>{type === 'all' ? 'All audio' : typeLabel[type]}</button>)}</div><input value={search} onChange={(event) => setSearch(event.target.value)} className="input-field xl:w-80" placeholder="Search audio" /></section>

      {loading ? <div className="flex justify-center py-20"><FiLoader className="h-6 w-6 animate-spin text-cyan-600" /></div> : filtered.length === 0 ? <div className="section-panel text-center text-sm text-slate-500">No audio files found.</div> : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((audio) => (
            <article key={audio._id} className="content-card space-y-4">
              <div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="icon-badge bg-rose-50 text-rose-700"><FiMusic className="h-5 w-5" /></div><div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{typeLabel[audio.type]}</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{audio.title}</h3></div></div><button onClick={() => toggleActive(audio)} className="btn-secondary px-4 py-2">{audio.isActive ? <FiToggleRight className="h-4 w-4" /> : <FiToggleLeft className="h-4 w-4" />}{audio.isActive ? 'Active' : 'Inactive'}</button></div>

              <audio controls className="w-full" src={audio.url} preload="none" />

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <a href={audio.url} target="_blank" rel="noreferrer" className="filter-chip"><FiExternalLink className="h-3.5 w-3.5" />Open source</a>
                {audio.referenceLink && <a href={audio.referenceLink} target="_blank" rel="noreferrer" className="filter-chip"><FiExternalLink className="h-3.5 w-3.5" />Reference</a>}
                {audio.attachment && <a href={audio.attachment.url} target="_blank" rel="noreferrer" className="filter-chip"><FiFile className="h-3.5 w-3.5" />Supporting asset</a>}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200/80 pt-3"><button onClick={() => { setEditing(audio); setShowForm(true); }} className="icon-action"><FiEdit2 className="h-4 w-4" /></button><button onClick={() => setDeleteTarget(audio)} className="icon-action text-rose-500"><FiTrash2 className="h-4 w-4" /></button></div>
            </article>
          ))}
        </section>
      )}

      {showForm && <AudioForm initial={editing ?? undefined} onSubmit={editing ? handleUpdate : handleCreate} onCancel={() => { setShowForm(false); setEditing(null); }} isLoading={formLoading} />}

      <ConfirmDialog isOpen={Boolean(deleteTarget)} title="Delete audio" message={`Are you sure you want to delete "${deleteTarget?.title}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isLoading={deleteLoading} variant="danger" />
    </div>
  );
};

export default AudioPage;
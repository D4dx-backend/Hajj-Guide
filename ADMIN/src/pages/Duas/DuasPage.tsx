import React, { useCallback, useEffect, useState } from 'react';
import { FiChevronDown, FiChevronRight, FiEdit2, FiExternalLink, FiFile, FiLoader, FiMusic, FiPlus, FiStar, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RitualTypeToggle from '../../components/common/RitualTypeToggle';
import { ToastContainer, useToast } from '../../components/common/Toast';
import type { Dua, DuaCategory, RitualTypeWithBoth } from '../../types';
import DuaForm from './DuaForm';

const categoryLabel: Record<DuaCategory, string> = { talbiyah: 'Talbiyah', dua: 'Dua', dhikr: 'Dhikr' };

const DuasPage: React.FC = () => {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RitualTypeWithBoth | 'all'>('all');
  const [catFilter, setCatFilter] = useState<DuaCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Dua | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Dua | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchDuas = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter !== 'all') params.ritualType = filter;
      if (catFilter !== 'all') params.category = catFilter;
      const response = await api.get('/duas', { params });
      setDuas(response.data.data as Dua[]);
    } catch {
      addToast('Failed to load duas', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, catFilter, filter]);

  useEffect(() => { fetchDuas(); }, [fetchDuas]);

  const handleCreate = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.post('/duas', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      addToast('Dua created successfully', 'success');
      setShowForm(false);
      fetchDuas();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      addToast(message || 'Failed to create dua', 'error');
    } finally { setFormLoading(false); }
  };

  const handleUpdate = async (data: FormData) => {
    if (!editing) return;
    setFormLoading(true);
    try {
      await api.put(`/duas/${editing._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      addToast('Dua updated successfully', 'success');
      setEditing(null); setShowForm(false); fetchDuas();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      addToast(message || 'Failed to update dua', 'error');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try { await api.delete(`/duas/${deleteTarget._id}`); addToast('Dua deleted', 'success'); setDeleteTarget(null); fetchDuas(); }
    catch { addToast('Failed to delete dua', 'error'); }
    finally { setDeleteLoading(false); }
  };

  const toggleHighlight = async (dua: Dua) => {
    try { await api.patch(`/duas/${dua._id}/highlight`); setDuas((previous) => previous.map((item) => item._id === dua._id ? { ...item, isHighlighted: !item.isHighlighted } : item)); }
    catch { addToast('Failed to update highlight', 'error'); }
  };

  const toggleActive = async (dua: Dua) => {
    try { await api.patch(`/duas/${dua._id}/toggle-active`); setDuas((previous) => previous.map((item) => item._id === dua._id ? { ...item, isActive: !item.isActive } : item)); }
    catch { addToast('Failed to update status', 'error'); }
  };

  const filtered = duas.filter((dua) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return dua.title.malayalam.toLowerCase().includes(query) || dua.arabicText.toLowerCase().includes(query) || dua.malayalamMeaning.toLowerCase().includes(query);
  });

  return (
    <div className="page-shell">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <section className="page-hero">
        <span className="eyebrow">Prayer Content</span>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Duas & Dhikrs</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Pair prayer text with audio links, reference URLs, and supporting media assets.</p>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><FiPlus className="h-4 w-4" />Add dua</button>
        </div>
      </section>

      <section className="section-panel space-y-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <RitualTypeToggle value={filter} onChange={(value) => setFilter(value as RitualTypeWithBoth | 'all')} includeAll includeBoth />
            <div className="inline-flex flex-wrap gap-2">
              {(['all', 'dua', 'dhikr', 'talbiyah'] as const).map((category) => (
                <button key={category} onClick={() => setCatFilter(category)} className={`filter-chip ${catFilter === category ? 'filter-chip-active' : ''}`}>{category === 'all' ? 'All types' : categoryLabel[category]}</button>
              ))}
            </div>
          </div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="input-field xl:w-80" placeholder="Search dua content" />
        </div>
        <p className="text-sm font-semibold text-slate-500">{filtered.length} item{filtered.length === 1 ? '' : 's'}</p>
      </section>

      {loading ? <div className="flex justify-center py-20"><FiLoader className="h-6 w-6 animate-spin text-cyan-600" /></div> : filtered.length === 0 ? <div className="section-panel text-center text-sm text-slate-500">No duas found.</div> : (
        <section className="space-y-4">
          {filtered.map((dua) => (
            <article key={dua._id} className="content-card space-y-4">
              <div className="flex items-start gap-4">
                <button onClick={() => setExpandedId(expandedId === dua._id ? null : dua._id)} className="icon-action shrink-0">{expandedId === dua._id ? <FiChevronDown className="h-4 w-4" /> : <FiChevronRight className="h-4 w-4" />}</button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`status-pill ${dua.ritualType === 'hajj' ? 'status-pill-hajj' : dua.ritualType === 'umrah' ? 'status-pill-umrah' : 'status-pill-both'}`}>{dua.ritualType}</span>
                    <span className="status-pill bg-slate-100 text-slate-700">{categoryLabel[dua.category]}</span>
                    {dua.isHighlighted && <span className="status-pill status-pill-highlight">Highlighted</span>}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{dua.title.malayalam}</h3>
                  <p className="mt-2 font-arabic text-lg text-slate-600">{dua.arabicText.slice(0, 88)}{dua.arabicText.length > 88 ? '...' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleHighlight(dua)} className={`icon-action ${dua.isHighlighted ? 'text-amber-600' : ''}`}><FiStar className="h-4 w-4" /></button>
                  <button onClick={() => toggleActive(dua)} className="icon-action">{dua.isActive ? <FiToggleRight className="h-4 w-4" /> : <FiToggleLeft className="h-4 w-4" />}</button>
                  <button onClick={() => { setEditing(dua); setShowForm(true); }} className="icon-action"><FiEdit2 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(dua)} className="icon-action text-rose-500"><FiTrash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {dua.audioUrl && <a href={dua.audioUrl} target="_blank" rel="noreferrer" className="filter-chip"><FiMusic className="h-3.5 w-3.5" />Audio</a>}
                {dua.referenceLink && <a href={dua.referenceLink} target="_blank" rel="noreferrer" className="filter-chip"><FiExternalLink className="h-3.5 w-3.5" />Reference</a>}
                {dua.attachment && <a href={dua.attachment.url} target="_blank" rel="noreferrer" className="filter-chip"><FiFile className="h-3.5 w-3.5" />Attachment</a>}
              </div>

              {expandedId === dua._id && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[26px] bg-slate-50/80 p-4"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Arabic text</p><p className="mt-3 font-arabic text-xl text-slate-800">{dua.arabicText}</p></div>
                  <div className="rounded-[26px] bg-slate-50/80 p-4"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Meaning</p><p className="mt-3 text-sm leading-7 text-slate-600">{dua.malayalamMeaning}</p>{dua.transliteration && <p className="mt-3 text-sm italic text-slate-500">{dua.transliteration}</p>}</div>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {showForm && <DuaForm initial={editing ?? undefined} onSubmit={editing ? handleUpdate : handleCreate} onCancel={() => { setShowForm(false); setEditing(null); }} isLoading={formLoading} />}

      <ConfirmDialog isOpen={Boolean(deleteTarget)} title="Delete dua" message={`Are you sure you want to delete "${deleteTarget?.title?.malayalam}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isLoading={deleteLoading} variant="danger" />
    </div>
  );
};

export default DuasPage;
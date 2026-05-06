import React, { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiExternalLink, FiImage, FiLink, FiLoader, FiPlus, FiStar, FiToggleLeft, FiToggleRight, FiTrash2, FiVideo } from 'react-icons/fi';
import api from '../../api/axios';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RitualTypeToggle from '../../components/common/RitualTypeToggle';
import { ToastContainer, useToast } from '../../components/common/Toast';
import type { RitualStep, RitualType } from '../../types';
import RitualStepForm from './RitualStepForm';

const RitualStepsPage: React.FC = () => {
  const [steps, setSteps] = useState<RitualStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RitualType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RitualStep | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RitualStep | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const fetchSteps = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filter !== 'all') params.ritualType = filter;
      const response = await api.get('/ritual-steps', { params });
      setSteps(response.data.data as RitualStep[]);
    } catch {
      addToast('Failed to load ritual steps', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, filter]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const handleCreate = async (data: FormData) => {
    setFormLoading(true);
    try {
      await api.post('/ritual-steps', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      addToast('Ritual step created successfully', 'success');
      setShowForm(false);
      fetchSteps();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      addToast(message || 'Failed to create ritual step', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!editing) return;
    setFormLoading(true);
    try {
      await api.put(`/ritual-steps/${editing._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      addToast('Ritual step updated successfully', 'success');
      setEditing(null);
      setShowForm(false);
      fetchSteps();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      addToast(message || 'Failed to update ritual step', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/ritual-steps/${deleteTarget._id}`);
      addToast('Ritual step deleted', 'success');
      setDeleteTarget(null);
      fetchSteps();
    } catch {
      addToast('Failed to delete ritual step', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleHighlight = async (step: RitualStep) => {
    try {
      await api.patch(`/ritual-steps/${step._id}/highlight`);
      setSteps((previous) => previous.map((item) => (item._id === step._id ? { ...item, isHighlighted: !item.isHighlighted } : item)));
    } catch {
      addToast('Failed to update highlight', 'error');
    }
  };

  const toggleActive = async (step: RitualStep) => {
    try {
      await api.patch(`/ritual-steps/${step._id}/toggle-active`);
      setSteps((previous) => previous.map((item) => (item._id === step._id ? { ...item, isActive: !item.isActive } : item)));
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const filtered = steps.filter((step) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return step.title.malayalam.toLowerCase().includes(query) || step.title.arabic.toLowerCase().includes(query) || String(step.stepNumber).includes(query);
  });

  return (
    <div className="page-shell">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <section className="page-hero">
        <span className="eyebrow">Ritual Management</span>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Ritual Steps</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Manage step copy, supporting links, and image or media attachments for each ritual stage.</p>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
            <FiPlus className="h-4 w-4" />
            Add step
          </button>
        </div>
      </section>

      <section className="section-panel flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <RitualTypeToggle value={filter} onChange={(value) => setFilter(value as RitualType | 'all')} includeAll />
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="input-field lg:w-80" placeholder="Search by title or step number" />
        </div>
        <p className="text-sm font-semibold text-slate-500">{filtered.length} step{filtered.length === 1 ? '' : 's'}</p>
      </section>

      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="h-6 w-6 animate-spin text-cyan-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="section-panel text-center text-sm text-slate-500">No ritual steps found.</div>
      ) : (
        <section className="table-stack">
          {filtered.map((step) => (
            <article key={step._id} className="content-card space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`status-pill ${step.ritualType === 'hajj' ? 'status-pill-hajj' : 'status-pill-umrah'}`}>Step {step.stepNumber}</span>
                    {step.isHighlighted && <span className="status-pill status-pill-highlight">Highlighted</span>}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{step.title.malayalam || 'Untitled step'}</h3>
                  {step.title.arabic && <p className="mt-2 font-arabic text-lg text-slate-600">{step.title.arabic}</p>}
                </div>
                <button onClick={() => toggleHighlight(step)} className={`icon-action ${step.isHighlighted ? 'text-amber-600' : ''}`}>
                  <FiStar className="h-4 w-4" />
                </button>
              </div>

              {step.description.malayalam && <p className="text-sm leading-7 text-slate-600">{step.description.malayalam}</p>}

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {step.referenceLink && (
                  <a href={step.referenceLink} target="_blank" rel="noreferrer" className="filter-chip">
                    <FiExternalLink className="h-3.5 w-3.5" />
                    Reference link
                  </a>
                )}
                {step.attachment && (
                  <a href={step.attachment.url} target="_blank" rel="noreferrer" className="filter-chip">
                    <FiImage className="h-3.5 w-3.5" />
                    {step.attachment.kind}
                  </a>
                )}
                {step.videoLink && (
                  <a href={step.videoLink} target="_blank" rel="noreferrer" className="filter-chip">
                    <FiLink className="h-3.5 w-3.5" />
                    Video link
                  </a>
                )}
                {step.video && (
                  <a href={step.video.url} target="_blank" rel="noreferrer" className="filter-chip">
                    <FiVideo className="h-3.5 w-3.5" />
                    Video
                  </a>
                )}
              </div>

              <div className="rounded-[26px] bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Instructions</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {step.instructions.map((instruction, index) => (
                    <li key={`${step._id}-${index}`}>{index + 1}. {instruction.malayalam}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
                <button onClick={() => toggleActive(step)} className="btn-secondary px-4 py-2">
                  {step.isActive ? <FiToggleRight className="h-4 w-4" /> : <FiToggleLeft className="h-4 w-4" />}
                  {step.isActive ? 'Active' : 'Inactive'}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(step); setShowForm(true); }} className="icon-action"><FiEdit2 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(step)} className="icon-action text-rose-500"><FiTrash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {showForm && (
        <RitualStepForm initial={editing ?? undefined} onSubmit={editing ? handleUpdate : handleCreate} onCancel={() => { setShowForm(false); setEditing(null); }} isLoading={formLoading} />
      )}

      <ConfirmDialog isOpen={Boolean(deleteTarget)} title="Delete ritual step" message={`Are you sure you want to delete "${deleteTarget?.title?.malayalam}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} isLoading={deleteLoading} variant="danger" />
    </div>
  );
};

export default RitualStepsPage;
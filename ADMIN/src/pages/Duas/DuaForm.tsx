import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiLoader, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import MediaAttachmentField from '../../components/common/MediaAttachmentField';
import type { Dua, DuaCategory, RitualStep, RitualTypeWithBoth } from '../../types';

interface DuaFormProps {
  initial?: Partial<Dua>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const DuaForm: React.FC<DuaFormProps> = ({ initial, onSubmit, onCancel, isLoading }) => {
  const [ritualType, setRitualType] = useState<RitualTypeWithBoth>(initial?.ritualType ?? 'hajj');
  const [ritualStepId, setRitualStepId] = useState<string>(typeof initial?.ritualStep === 'string' ? initial.ritualStep : (initial?.ritualStep as RitualStep)?._id ?? '');
  const [titleArabic, setTitleArabic] = useState(initial?.title?.arabic ?? '');
  const [titleMalayalam, setTitleMalayalam] = useState(initial?.title?.malayalam ?? '');
  const [arabicText, setArabicText] = useState(initial?.arabicText ?? '');
  const [malayalamMeaning, setMalayalamMeaning] = useState(initial?.malayalamMeaning ?? '');
  const [transliteration, setTransliteration] = useState(initial?.transliteration ?? '');
  const [category, setCategory] = useState<DuaCategory>(initial?.category ?? 'dua');
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl ?? '');
  const [referenceLink, setReferenceLink] = useState(initial?.referenceLink ?? '');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [removeExistingAttachment, setRemoveExistingAttachment] = useState(false);
  const [steps, setSteps] = useState<RitualStep[]>([]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const params: Record<string, string> = {};
        if (ritualType !== 'both') params.ritualType = ritualType;
        const response = await api.get('/ritual-steps', { params });
        setSteps(response.data.data as RitualStep[]);
      } catch {
        setSteps([]);
      }
    };

    fetchSteps();
  }, [ritualType]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('ritualType', ritualType);
    formData.append('ritualStep', ritualStepId);
    formData.append('title', JSON.stringify({ arabic: titleArabic, malayalam: titleMalayalam }));
    formData.append('arabicText', arabicText);
    formData.append('malayalamMeaning', malayalamMeaning);
    formData.append('transliteration', transliteration);
    formData.append('category', category);
    formData.append('order', String(order));
    formData.append('audioUrl', audioUrl);
    formData.append('hasAudio', String(Boolean(audioUrl)));
    formData.append('referenceLink', referenceLink);

    if (attachmentFile) formData.append('attachmentFile', attachmentFile);
    if (removeExistingAttachment) formData.append('removeAttachment', 'true');

    onSubmit(formData);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="modal-shell relative flex max-h-[90vh] w-full max-w-4xl flex-col">
        <div className="flex shrink-0 items-center justify-between rounded-t-[34px] border-b border-slate-200/80 bg-[rgb(248,250,252)] px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Dua editor</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{initial?._id ? 'Edit dua' : 'Create dua'}</h2>
          </div>
          <button onClick={onCancel} className="icon-action"><FiX className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <select value={ritualType} onChange={(event) => { setRitualType(event.target.value as RitualTypeWithBoth); setRitualStepId(''); }} className="input-field">
              <option value="hajj">Hajj</option>
              <option value="umrah">Umrah</option>
              <option value="both">Both</option>
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value as DuaCategory)} className="input-field">
              <option value="dua">Dua</option>
              <option value="dhikr">Dhikr</option>
              <option value="talbiyah">Talbiyah</option>
            </select>
            <input type="number" min={0} value={order} onChange={(event) => setOrder(Number(event.target.value))} className="input-field" placeholder="Order" />
          </div>

          <div>
            <label className="field-label">Linked ritual step</label>
            <select value={ritualStepId} onChange={(event) => setRitualStepId(event.target.value)} className="input-field">
              <option value="">Not linked</option>
              {steps.map((step) => <option key={step._id} value={step._id}>Step {step.stepNumber}: {step.title.malayalam}</option>)}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input value={titleArabic} onChange={(event) => setTitleArabic(event.target.value)} className="input-field font-arabic" dir="rtl" placeholder="Arabic title" />
            <input value={titleMalayalam} onChange={(event) => setTitleMalayalam(event.target.value)} className="input-field" placeholder="Malayalam title" required />
          </div>
          <textarea value={arabicText} onChange={(event) => setArabicText(event.target.value)} className="input-field font-arabic min-h-32" dir="rtl" placeholder="Arabic text" required />
          <textarea value={transliteration} onChange={(event) => setTransliteration(event.target.value)} className="input-field min-h-24" placeholder="Transliteration" />
          <textarea value={malayalamMeaning} onChange={(event) => setMalayalamMeaning(event.target.value)} className="input-field min-h-32" placeholder="Malayalam meaning" required />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="field-label">Audio URL</label>
                <input type="url" value={audioUrl} onChange={(event) => setAudioUrl(event.target.value)} className="input-field" placeholder="https://example.com/audio.mp3" />
              </div>
              <div>
                <label className="field-label">Reference link</label>
                <input type="url" value={referenceLink} onChange={(event) => setReferenceLink(event.target.value)} className="input-field" placeholder="https://example.com/reference" />
              </div>
            </div>
            <MediaAttachmentField file={attachmentFile} existingAsset={initial?.attachment} removeExisting={removeExistingAttachment} onFileChange={setAttachmentFile} onRemoveExistingChange={setRemoveExistingAttachment} />
          </div>

          </div>
          <div className="flex shrink-0 justify-end gap-3 rounded-b-[34px] border-t border-slate-200/80 bg-[rgb(248,250,252)] px-6 py-4 sm:px-8">
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? <><FiLoader className="h-4 w-4 animate-spin" />Saving...</> : initial?._id ? 'Update dua' : 'Create dua'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default DuaForm;
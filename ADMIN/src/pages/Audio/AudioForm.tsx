import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiLoader, FiUploadCloud, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import MediaAttachmentField from '../../components/common/MediaAttachmentField';
import type { AudioFile, AudioType, Dua } from '../../types';

interface AudioFormProps {
  initial?: Partial<AudioFile>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const AudioForm: React.FC<AudioFormProps> = ({ initial, onSubmit, onCancel, isLoading }) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [type, setType] = useState<AudioType>(initial?.type ?? 'dua');
  const [duaRefId, setDuaRefId] = useState<string>(typeof initial?.duaReference === 'string' ? initial.duaReference : (initial?.duaReference as Dua)?._id ?? '');
  const [url, setUrl] = useState(initial?.url ?? '');
  const [referenceLink, setReferenceLink] = useState(initial?.referenceLink ?? '');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [removeExistingAttachment, setRemoveExistingAttachment] = useState(false);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [useUrl, setUseUrl] = useState(!initial?.storageKey && Boolean(initial?.url));

  useEffect(() => {
    const fetchDuas = async () => {
      try {
        const response = await api.get('/duas');
        setDuas(response.data.data as Dua[]);
      } catch {
        setDuas([]);
      }
    };
    fetchDuas();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('duaReference', duaRefId);
    formData.append('referenceLink', referenceLink);

    if (audioFile) {
      formData.append('audioFile', audioFile);
    } else if (useUrl) {
      formData.append('url', url);
    }

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
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="modal-shell relative flex max-h-[90vh] w-full max-w-3xl flex-col">
        <div className="flex shrink-0 items-center justify-between rounded-t-[34px] border-b border-slate-200/80 bg-[rgb(248,250,252)] px-6 py-5 sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Audio editor</p><h2 className="mt-2 text-xl font-semibold text-slate-950">{initial?._id ? 'Edit audio' : 'Create audio'}</h2></div><button onClick={onCancel} className="icon-action"><FiX className="h-4 w-4" /></button></div>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="input-field" placeholder="Audio title" required />
            <select value={type} onChange={(event) => setType(event.target.value as AudioType)} className="input-field"><option value="talbiyah">Talbiyah</option><option value="dua">Dua</option><option value="dhikr">Dhikr</option></select>
          </div>

          <div>
            <label className="field-label">Linked dua</label>
            <select value={duaRefId} onChange={(event) => setDuaRefId(event.target.value)} className="input-field"><option value="">Not linked</option>{duas.map((dua) => <option key={dua._id} value={dua._id}>{dua.title.malayalam}</option>)}</select>
          </div>

          <div className="space-y-3">
            <div className="inline-flex gap-2">
              <button type="button" onClick={() => setUseUrl(true)} className={`filter-chip ${useUrl ? 'filter-chip-active' : ''}`}>Use URL</button>
              <button type="button" onClick={() => setUseUrl(false)} className={`filter-chip ${!useUrl ? 'filter-chip-active' : ''}`}>Upload audio</button>
            </div>
            {useUrl ? (
              <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} className="input-field" placeholder="https://example.com/audio.mp3" />
            ) : (
              <label className="dropzone block cursor-pointer"><div className="flex items-center gap-4"><div className="icon-badge icon-badge-primary"><FiUploadCloud className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-slate-900">{audioFile ? audioFile.name : 'Choose audio file'}</p><p className="text-xs text-slate-500">Upload MP3, WAV, AAC, or OGG.</p></div></div><input type="file" accept="audio/*" className="hidden" onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)} /></label>
            )}
            {!audioFile && initial?.url && <p className="text-xs text-slate-500">Current source: {initial.filename || initial.url}</p>}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div><label className="field-label">Reference link</label><input type="url" value={referenceLink} onChange={(event) => setReferenceLink(event.target.value)} className="input-field" placeholder="https://example.com/reference" /></div>
            <MediaAttachmentField label="Supporting asset" helperText="Optional artwork, video, or related supporting file." file={attachmentFile} existingAsset={initial?.attachment} removeExisting={removeExistingAttachment} onFileChange={setAttachmentFile} onRemoveExistingChange={setRemoveExistingAttachment} />
          </div>

          </div>
          <div className="flex shrink-0 justify-end gap-3 rounded-b-[34px] border-t border-slate-200/80 bg-[rgb(248,250,252)] px-6 py-4 sm:px-8"><button type="button" onClick={onCancel} className="btn-secondary">Cancel</button><button type="submit" disabled={isLoading} className="btn-primary">{isLoading ? <><FiLoader className="h-4 w-4 animate-spin" />Saving...</> : initial?._id ? 'Update audio' : 'Create audio'}</button></div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default AudioForm;
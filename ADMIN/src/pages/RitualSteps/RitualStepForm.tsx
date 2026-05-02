import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiLoader, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import MediaAttachmentField from '../../components/common/MediaAttachmentField';
import type { RitualStep, RitualType } from '../../types';

interface RitualStepFormProps {
  initial?: Partial<RitualStep>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

let instructionIdCounter = 0;
const newInstruction = () => ({ id: ++instructionIdCounter, arabic: '', malayalam: '' });

const RitualStepForm: React.FC<RitualStepFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [ritualType, setRitualType] = useState<RitualType>(initial?.ritualType ?? 'hajj');
  const [stepNumber, setStepNumber] = useState(initial?.stepNumber ?? 1);
  const [titleArabic, setTitleArabic] = useState(initial?.title?.arabic ?? '');
  const [titleMalayalam, setTitleMalayalam] = useState(initial?.title?.malayalam ?? '');
  const [descArabic, setDescArabic] = useState(initial?.description?.arabic ?? '');
  const [descMalayalam, setDescMalayalam] = useState(initial?.description?.malayalam ?? '');
  const [referenceLink, setReferenceLink] = useState(initial?.referenceLink ?? '');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [removeExistingAttachment, setRemoveExistingAttachment] = useState(false);
  const [instructions, setInstructions] = useState<{ id: number; arabic: string; malayalam: string }[]>(
    initial?.instructions?.length
      ? initial.instructions.map((inst) => ({ id: ++instructionIdCounter, ...inst }))
      : [newInstruction()]
  );

  const addInstruction = () => setInstructions((previous) => [...previous, newInstruction()]);
  const removeInstruction = (id: number) =>
    setInstructions((previous) => previous.filter((instruction) => instruction.id !== id));
  const updateInstruction = (id: number, field: 'arabic' | 'malayalam', value: string) =>
    setInstructions((previous) =>
      previous.map((instruction) =>
        instruction.id === id ? { ...instruction, [field]: value } : instruction
      )
    );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('ritualType', ritualType);
    formData.append('stepNumber', String(stepNumber));
    formData.append(
      'title',
      JSON.stringify({ arabic: titleArabic, malayalam: titleMalayalam })
    );
    formData.append(
      'description',
      JSON.stringify({ arabic: descArabic, malayalam: descMalayalam })
    );
    formData.append(
      'instructions',
      JSON.stringify(instructions.filter((instruction) => instruction.malayalam.trim()))
    );
    formData.append('referenceLink', referenceLink);

    if (attachmentFile) {
      formData.append('attachmentFile', attachmentFile);
    }
    if (removeExistingAttachment) {
      formData.append('removeAttachment', 'true');
    }

    onSubmit(formData);
  };

  const isEdit = Boolean(initial?._id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onCancel} />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-shell relative flex max-h-[90vh] w-full max-w-4xl flex-col"
      >
        <div className="flex shrink-0 items-center justify-between rounded-t-[34px] border-b border-slate-200/80 bg-[rgb(248,250,252)] px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Ritual editor
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              {isEdit ? 'Edit ritual step' : 'Create ritual step'}
            </h2>
          </div>
          <button onClick={onCancel} className="icon-action">
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Ritual type</label>
              <select value={ritualType} onChange={(event) => setRitualType(event.target.value as RitualType)} className="input-field">
                <option value="hajj">Hajj</option>
                <option value="umrah">Umrah</option>
              </select>
            </div>
            <div>
              <label className="field-label">Step number</label>
              <input type="number" min={1} value={stepNumber} onChange={(event) => setStepNumber(Number(event.target.value))} className="input-field" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Arabic title</label>
              <input type="text" value={titleArabic} onChange={(event) => setTitleArabic(event.target.value)} className="input-field font-arabic" dir="rtl" />
            </div>
            <div>
              <label className="field-label">Malayalam title</label>
              <input type="text" value={titleMalayalam} onChange={(event) => setTitleMalayalam(event.target.value)} className="input-field" required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Arabic description</label>
              <textarea value={descArabic} onChange={(event) => setDescArabic(event.target.value)} className="input-field font-arabic min-h-32" dir="rtl" />
            </div>
            <div>
              <label className="field-label">Malayalam description</label>
              <textarea value={descMalayalam} onChange={(event) => setDescMalayalam(event.target.value)} className="input-field min-h-32" />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <label className="field-label mb-0">Instructions</label>
                <p className="field-help">Add step-by-step guidance in both languages.</p>
              </div>
              <button type="button" onClick={addInstruction} className="btn-secondary px-4 py-2">
                <FiPlus className="h-4 w-4" />
                Add instruction
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={instruction.id} className="section-panel space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Instruction {index + 1}</p>
                    {instructions.length > 1 && (
                      <button type="button" onClick={() => removeInstruction(instruction.id)} className="icon-action text-rose-500">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input type="text" value={instruction.arabic} onChange={(event) => updateInstruction(instruction.id, 'arabic', event.target.value)} className="input-field font-arabic" dir="rtl" placeholder="Arabic instruction" />
                  <input type="text" value={instruction.malayalam} onChange={(event) => updateInstruction(instruction.id, 'malayalam', event.target.value)} className="input-field" placeholder="Malayalam instruction" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <label className="field-label">Reference link</label>
              <input type="url" value={referenceLink} onChange={(event) => setReferenceLink(event.target.value)} className="input-field" placeholder="https://example.com/reference" />
            </div>
            <MediaAttachmentField
              file={attachmentFile}
              existingAsset={initial?.attachment}
              removeExisting={removeExistingAttachment}
              onFileChange={setAttachmentFile}
              onRemoveExistingChange={setRemoveExistingAttachment}
            />
          </div>

          </div>
          <div className="flex shrink-0 justify-end gap-3 rounded-b-[34px] border-t border-slate-200/80 bg-[rgb(248,250,252)] px-6 py-4 sm:px-8">
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                'Update step'
              ) : (
                'Create step'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default RitualStepForm;
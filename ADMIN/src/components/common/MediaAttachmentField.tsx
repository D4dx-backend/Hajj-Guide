import React from 'react';
import { FiFile, FiImage, FiMusic, FiTrash2, FiUploadCloud, FiVideo } from 'react-icons/fi';
import type { MediaAsset } from '../../types';

interface MediaAttachmentFieldProps {
  label?: string;
  helperText?: string;
  accept?: string;
  file: File | null;
  existingAsset?: MediaAsset | null;
  removeExisting: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveExistingChange: (value: boolean) => void;
}

const assetIcon = (kind?: MediaAsset['kind']) => {
  switch (kind) {
    case 'image':
      return <FiImage className="h-4 w-4" />;
    case 'audio':
      return <FiMusic className="h-4 w-4" />;
    case 'video':
      return <FiVideo className="h-4 w-4" />;
    default:
      return <FiFile className="h-4 w-4" />;
  }
};

const MediaAttachmentField: React.FC<MediaAttachmentFieldProps> = ({
  label = 'Attachment',
  helperText = 'Upload an image, audio clip, or video asset for this content.',
  accept = 'image/*,audio/*,video/*',
  file,
  existingAsset,
  removeExisting,
  onFileChange,
  onRemoveExistingChange,
}) => {
  const showExisting = existingAsset && !removeExisting && !file;

  return (
    <div className="space-y-3">
      <div>
        <label className="field-label">{label}</label>
        <p className="field-help">{helperText}</p>
      </div>

      <label className="dropzone group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="icon-badge icon-badge-primary">
            <FiUploadCloud className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              {file ? file.name : 'Choose a file or drop it here'}
            </p>
            <p className="text-xs text-slate-500">
              Supports images, audio, and video assets.
            </p>
          </div>
        </div>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] ?? null;
            onFileChange(selectedFile);
            if (selectedFile) {
              onRemoveExistingChange(false);
            }
          }}
        />
      </label>

      {file && (
        <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="icon-badge icon-badge-muted">{assetIcon(undefined)}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="icon-action text-rose-500"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showExisting && (
        <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="icon-badge icon-badge-muted">{assetIcon(existingAsset.kind)}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {existingAsset.originalName || existingAsset.fileName}
                </p>
                <a
                  href={existingAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-700 transition hover:text-cyan-900"
                >
                  Open current asset
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemoveExistingChange(true)}
              className="icon-action text-rose-500"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaAttachmentField;
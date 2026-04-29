import { useState } from 'react';
import { cloudinaryUploadConfigured, uploadToCloudinary } from '../../lib/cloudinary';

interface Props {
  value: string;
  onChange: (publicIdOrUrl: string) => void;
}

export function ImageUploader({ value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const result = await uploadToCloudinary(file);
      onChange(result.publicId);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="rule p-3 flex items-start gap-4" style={{ borderWidth: '0.5px' }}>
          <div className="w-24 aspect-[4/5] bg-paper-deep overflow-hidden shrink-0">
            <img
              src={resolvePreview(value)}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="label">Current</p>
            <p className="font-mono text-[12px] break-all mt-1">{value}</p>
            <button
              type="button"
              className="label-strong mt-2 border-b border-ink/40 pb-0.5 hover:border-ink"
              onClick={() => onChange('')}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {cloudinaryUploadConfigured ? (
        <label className="btn-ghost cursor-pointer w-full">
          {busy ? 'Uploading…' : 'Upload image to Cloudinary'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      ) : (
        <p className="label text-stone-500">
          Direct upload disabled. Set <span className="font-mono text-[11px]">VITE_CLOUDINARY_UPLOAD_PRESET</span> and create an unsigned preset in Cloudinary. See Help.
        </p>
      )}

      <div>
        <p className="label mb-2">Or paste a Cloudinary public_id or full image URL</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="studio/still-life-no-1  or  https://…"
          className="input-line font-mono text-base"
        />
      </div>

      {error && <p className="label text-stone-500">{error}</p>}
    </div>
  );
}

function resolvePreview(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return value;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_240,ar_4:5,c_fill/${value}`;
}

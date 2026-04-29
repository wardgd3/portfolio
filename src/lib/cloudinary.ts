const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;

interface UrlOpts {
  width?: number;
  height?: number;
  /** e.g. "4:5" — when set, uses c_fill to crop to that aspect ratio */
  aspectRatio?: string;
  /** Override default f_auto,q_auto */
  format?: string;
  quality?: string | number;
}

/**
 * Build a Cloudinary delivery URL.
 * - If `src` is already a full http(s) URL, it's passed through unchanged
 *   (so the current Unsplash placeholder images keep working).
 * - Otherwise `src` is treated as a Cloudinary public_id (e.g. "studio/still-life-1").
 */
export function cldUrl(src: string, opts: UrlOpts = {}): string {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  if (!CLOUD) return src;

  const t: string[] = [];
  t.push(`f_${opts.format ?? 'auto'}`);
  t.push(`q_${opts.quality ?? 'auto'}`);
  if (opts.width) t.push(`w_${Math.round(opts.width)}`);
  if (opts.height) t.push(`h_${Math.round(opts.height)}`);
  if (opts.aspectRatio) {
    t.push(`ar_${opts.aspectRatio}`);
    t.push('c_fill');
  } else if (opts.width || opts.height) {
    t.push('c_limit');
  }

  const publicId = src.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t.join(',')}/${publicId}`;
}

export function cldSrcSet(src: string, widths: number[], opts: Omit<UrlOpts, 'width'> = {}): string | undefined {
  // No srcSet for full external URLs — the source can't be resized.
  if (!src || /^https?:\/\//i.test(src)) return undefined;
  if (!CLOUD) return undefined;
  return widths.map((w) => `${cldUrl(src, { ...opts, width: w })} ${w}w`).join(', ');
}

export const cloudinaryConfigured = Boolean(CLOUD);

const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
export const cloudinaryUploadConfigured = Boolean(CLOUD && UPLOAD_PRESET);

export interface CldUploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload a file to Cloudinary using an UNSIGNED upload preset.
 * Configure the preset in the Cloudinary console (Settings → Upload → Add upload preset → Signing Mode: Unsigned).
 * Set the preset name as VITE_CLOUDINARY_UPLOAD_PRESET.
 */
export async function uploadToCloudinary(file: File): Promise<CldUploadResult> {
  if (!CLOUD) throw new Error('Cloudinary cloud name is not configured.');
  if (!UPLOAD_PRESET) throw new Error('Cloudinary upload preset is not configured. Set VITE_CLOUDINARY_UPLOAD_PRESET.');

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
  };
  return {
    publicId: data.public_id,
    url: data.secure_url,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}

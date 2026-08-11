import { z } from "zod";

export const ALLOWED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

export type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

const extensionsByMimeType: Record<AllowedMediaType, readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "application/pdf": ["pdf"],
};

export const mediaIdSchema = z.uuid("Select a valid media item.");
export const optionalMediaIdSchema = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : value),
  mediaIdSchema.nullable(),
);
export const mediaSearchSchema = z.string().trim().max(100).default("");
export const altTextSchema = z.string().trim().max(500);
export const updateMediaSchema = z.object({ id: mediaIdSchema, altText: altTextSchema });
export const deleteMediaSchema = z.object({ id: mediaIdSchema });
export const mediaRecordSchema = z.object({
  altText: z.string(),
  createdAt: z.iso.datetime(),
  fileSize: z.number().int().positive(),
  filename: z.string().min(1),
  height: z.number().int().positive().nullable(),
  id: mediaIdSchema,
  mimeType: z.enum(ALLOWED_MEDIA_TYPES),
  originalFilename: z.string().min(1),
  storageKey: z.string().min(1),
  url: z.url(),
  width: z.number().int().positive().nullable(),
});

export interface UploadMetadata {
  name: string;
  size: number;
  type: string;
}

export interface SelectedMediaType {
  id: string;
  mimeType: string;
}

export function isCompleteImageMediaSelection(
  selectedIds: readonly string[],
  records: readonly SelectedMediaType[],
): boolean {
  return records.length === selectedIds.length
    && records.every((record) => selectedIds.includes(record.id) && record.mimeType.startsWith("image/"));
}

export class UploadValidationError extends Error {}

export function validateUploadMetadata(
  metadata: UploadMetadata,
  maximumBytes: number,
): { extension: string; mimeType: AllowedMediaType; originalFilename: string } {
  const mimeType = z.enum(ALLOWED_MEDIA_TYPES).safeParse(metadata.type);
  if (!mimeType.success) {
    throw new UploadValidationError("Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or PDF.");
  }
  if (!Number.isSafeInteger(metadata.size) || metadata.size <= 0) {
    throw new UploadValidationError("The selected file is empty.");
  }
  if (metadata.size > maximumBytes) {
    throw new UploadValidationError(`The selected file exceeds the ${Math.floor(maximumBytes / 1024 / 1024)} MB upload limit.`);
  }

  const originalFilename = metadata.name.split(/[\\/]/).at(-1)?.trim().slice(0, 255) ?? "";
  const extension = originalFilename.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "";
  if (!originalFilename || !extensionsByMimeType[mimeType.data].includes(extension)) {
    throw new UploadValidationError("The file extension does not match its declared media type.");
  }

  return { extension: mimeType.data === "image/jpeg" ? "jpg" : extension, mimeType: mimeType.data, originalFilename };
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((value, index) => bytes[index] === value);
}

export function hasValidFileSignature(bytes: Uint8Array, mimeType: AllowedMediaType): boolean {
  if (mimeType === "image/jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]);
  if (mimeType === "image/png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (mimeType === "image/gif") {
    const header = new TextDecoder("ascii").decode(bytes.slice(0, 6));
    return header === "GIF87a" || header === "GIF89a";
  }
  if (mimeType === "image/webp") {
    return new TextDecoder("ascii").decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder("ascii").decode(bytes.slice(8, 12)) === "WEBP";
  }
  return new TextDecoder("ascii").decode(bytes.slice(0, 5)) === "%PDF-";
}

export interface ImageDimensions { height: number; width: number }

function uint16BigEndian(bytes: Uint8Array, offset: number): number {
  return ((bytes[offset] ?? 0) << 8) | (bytes[offset + 1] ?? 0);
}

function uint16LittleEndian(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
}

function uint24LittleEndian(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8) | ((bytes[offset + 2] ?? 0) << 16);
}

function jpegDimensions(bytes: Uint8Array): ImageDimensions | null {
  const startOfFrameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset];
    if (marker === undefined || marker === 0xd9 || marker === 0xda) return null;
    if (startOfFrameMarkers.has(marker)) {
      return { height: uint16BigEndian(bytes, offset + 4), width: uint16BigEndian(bytes, offset + 6) };
    }
    const segmentLength = uint16BigEndian(bytes, offset + 1);
    if (segmentLength < 2 || offset + segmentLength >= bytes.length) return null;
    offset += segmentLength + 1;
  }
  return null;
}

function webpDimensions(bytes: Uint8Array): ImageDimensions | null {
  const variant = new TextDecoder("ascii").decode(bytes.slice(12, 16));
  if (variant === "VP8X" && bytes.length >= 30) {
    return { width: uint24LittleEndian(bytes, 24) + 1, height: uint24LittleEndian(bytes, 27) + 1 };
  }
  if (variant === "VP8L" && bytes.length >= 25 && bytes[20] === 0x2f) {
    return {
      width: ((bytes[21] ?? 0) | (((bytes[22] ?? 0) & 0x3f) << 8)) + 1,
      height: (((bytes[22] ?? 0) >> 6) | ((bytes[23] ?? 0) << 2) | (((bytes[24] ?? 0) & 0x0f) << 10)) + 1,
    };
  }
  if (variant === "VP8 " && bytes.length >= 30 && startsWith(bytes.slice(23), [0x9d, 0x01, 0x2a])) {
    return { width: uint16LittleEndian(bytes, 26) & 0x3fff, height: uint16LittleEndian(bytes, 28) & 0x3fff };
  }
  return null;
}

export function getImageDimensions(bytes: Uint8Array, mimeType: AllowedMediaType): ImageDimensions | null {
  if (mimeType === "image/png" && bytes.length >= 24) return { width: uint16BigEndian(bytes, 18) + 65536 * uint16BigEndian(bytes, 16), height: uint16BigEndian(bytes, 22) + 65536 * uint16BigEndian(bytes, 20) };
  if (mimeType === "image/gif" && bytes.length >= 10) return { width: uint16LittleEndian(bytes, 6), height: uint16LittleEndian(bytes, 8) };
  if (mimeType === "image/jpeg") return jpegDimensions(bytes);
  if (mimeType === "image/webp") return webpDimensions(bytes);
  return null;
}

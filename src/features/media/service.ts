import "server-only";

import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { media } from "@/db/schema";
import { env } from "@/lib/env/server";
import { storage } from "@/lib/storage";
import { getMediaById, type MediaRecord } from "@/features/media/queries";
import { getImageDimensions, hasValidFileSignature, isCompleteImageMediaSelection, UploadValidationError, validateUploadMetadata } from "@/features/media/validation";

function createStorageIdentity(extension: string): { filename: string; storageKey: string } {
  const now = new Date();
  const filename = `${randomUUID()}.${extension}`;
  return {
    filename,
    storageKey: `uploads/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${filename}`,
  };
}

export async function uploadMedia(file: File): Promise<MediaRecord> {
  const maximumBytes = env.MAX_UPLOAD_SIZE_MB * 1024 * 1024;
  const validated = validateUploadMetadata(file, maximumBytes);
  const body = new Uint8Array(await file.arrayBuffer());
  if (!hasValidFileSignature(body, validated.mimeType)) {
    throw new UploadValidationError("The file contents do not match the declared media type.");
  }

  let width: number | null = null;
  let height: number | null = null;
  if (validated.mimeType.startsWith("image/")) {
    const dimensions = getImageDimensions(body, validated.mimeType);
    if (!dimensions || !Number.isSafeInteger(dimensions.width) || !Number.isSafeInteger(dimensions.height) || dimensions.width <= 0 || dimensions.height <= 0 || dimensions.width > 100_000 || dimensions.height > 100_000) throw new UploadValidationError("The uploaded image has invalid dimensions.");
    width = dimensions.width;
    height = dimensions.height;
  }

  const identity = createStorageIdentity(validated.extension);
  await storage.upload({ body, contentLength: file.size, contentType: validated.mimeType, key: identity.storageKey });

  try {
    const [created] = await db.insert(media).values({
      storageKey: identity.storageKey,
      filename: identity.filename,
      originalFilename: validated.originalFilename,
      mimeType: validated.mimeType,
      fileSize: file.size,
      width,
      height,
    }).returning();
    if (!created) throw new Error("Media record was not created.");
    const result = await getMediaById(created.id);
    if (!result) throw new Error("Media record was not found after creation.");
    return result;
  } catch (error) {
    await storage.delete(identity.storageKey).catch((cleanupError: unknown) => {
      console.error("Failed to clean up an object after media persistence failed.", cleanupError);
    });
    throw error;
  }
}

export async function updateMediaAltText(id: string, altText: string): Promise<void> {
  await db.update(media).set({ altText, updatedAt: new Date() }).where(eq(media.id, id));
}

export class InvalidImageMediaError extends Error {
  constructor() {
    super("Select an uploaded image for managed image fields.");
    this.name = "InvalidImageMediaError";
  }
}

export async function assertImageMediaIds(ids: Array<string | null>): Promise<void> {
  const selectedIds = [...new Set(ids.filter((id): id is string => id !== null))];
  if (selectedIds.length === 0) return;
  const records = await db.select({ id: media.id, mimeType: media.mimeType }).from(media).where(inArray(media.id, selectedIds));
  if (!isCompleteImageMediaSelection(selectedIds, records)) {
    throw new InvalidImageMediaError();
  }
}

export async function assertPdfMediaId(id: string | null): Promise<void> {
  if (!id) return;
  const [record] = await db.select({ mimeType: media.mimeType }).from(media).where(eq(media.id, id)).limit(1);
  if (!record || record.mimeType !== "application/pdf") throw new Error("Select an uploaded PDF document.");
}

export async function deleteMedia(id: string): Promise<boolean> {
  const [record] = await db.select({ storageKey: media.storageKey }).from(media).where(eq(media.id, id)).limit(1);
  if (!record) return false;
  await storage.delete(record.storageKey);
  await db.delete(media).where(eq(media.id, id));
  return true;
}

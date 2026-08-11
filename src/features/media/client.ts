import { mediaRecordSchema } from "@/features/media/validation";
import type { MediaRecord } from "@/features/media/queries";

export function findFirstImageFile<T extends { type: string }>(files: Iterable<T>): T | undefined {
  return Array.from(files).find((file) => file.type.startsWith("image/"));
}

export async function uploadMediaFile(file: File): Promise<MediaRecord> {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/api/admin/media", { method: "POST", body });
  const payload: unknown = await response.json();
  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
      ? payload.message
      : "The file could not be uploaded.";
    throw new Error(message);
  }
  const parsed = mediaRecordSchema.safeParse(typeof payload === "object" && payload !== null && "media" in payload ? payload.media : null);
  if (!parsed.success) throw new Error("The upload returned an invalid media record.");
  return parsed.data;
}

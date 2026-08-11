import { getMediaById } from "@/features/media/queries";
import { mediaIdSchema } from "@/features/media/validation";
import { storage } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const parsed = mediaIdSchema.safeParse((await params).id);
  if (!parsed.success) return new Response("Not found", { status: 404 });
  const media = await getMediaById(parsed.data);
  if (!media) return new Response("Not found", { status: 404 });
  try {
    const object = await storage.read(media.storageKey);
    return new Response(Buffer.from(object.body), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(media.originalFilename)}`,
        "Content-Length": String(object.contentLength),
        "Content-Type": media.mimeType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to read a stored media object.", error);
    return new Response("Media unavailable", { status: 503 });
  }
}

import { getCurrentSession } from "@/features/auth/session";
import { listMedia } from "@/features/media/queries";
import { uploadMedia } from "@/features/media/service";
import { mediaSearchSchema, UploadValidationError } from "@/features/media/validation";
import { env } from "@/lib/env/server";

export async function GET(request: Request): Promise<Response> {
  if (!(await getCurrentSession())) return Response.json({ message: "Authentication required." }, { status: 401 });
  const parsed = mediaSearchSchema.safeParse(new URL(request.url).searchParams.get("search") ?? "");
  if (!parsed.success) return Response.json({ message: "Search is too long." }, { status: 400 });
  return Response.json({ media: await listMedia(parsed.data) });
}

export async function POST(request: Request): Promise<Response> {
  if (!(await getCurrentSession())) return Response.json({ message: "Authentication required." }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length"));
  const maximumRequestBytes = env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 + 1024 * 1024;
  if (Number.isFinite(contentLength) && contentLength > maximumRequestBytes) {
    return Response.json({ message: `The upload request exceeds the ${env.MAX_UPLOAD_SIZE_MB} MB file limit.` }, { status: 413 });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return Response.json({ message: "Choose a file to upload." }, { status: 400 });
  try {
    return Response.json({ media: await uploadMedia(file) }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadValidationError) return Response.json({ message: error.message }, { status: 400 });
    console.error("Media upload failed.", error);
    return Response.json({ message: "The file could not be uploaded." }, { status: 500 });
  }
}

"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/session";
import { CvProjectSelectionError, saveCvConfiguration } from "@/features/cv/service";
import { cvConfigurationSchema, type CvActionState } from "@/features/cv/validation";
export async function saveCvConfigurationAction(_state: CvActionState, formData: FormData): Promise<CvActionState> {
  await requireAdmin(); const serialized = formData.get("configuration"); let candidate: unknown;
  try { candidate = typeof serialized === "string" ? JSON.parse(serialized) : null; } catch { return { status: "error", message: "The CV configuration was not valid JSON." }; }
  const parsed = cvConfigurationSchema.safeParse(candidate); if (!parsed.success) return { status: "error", message: "Review the CV sections and project selections." };
  try { await saveCvConfiguration(parsed.data); revalidatePath("/admin/cv"); revalidatePath("/cv"); return { status: "success", message: "CV configuration saved." }; } catch (error) { if (error instanceof CvProjectSelectionError) return { status: "error", message: error.message }; console.error("CV configuration save failed.", error instanceof Error ? error.name : "UnknownError"); return { status: "error", message: "The CV configuration could not be saved." }; }
}

import { describe, expect, it } from "vitest";

import { getImageDimensions, hasValidFileSignature, isCompleteImageMediaSelection, UploadValidationError, validateUploadMetadata } from "@/features/media/validation";
import { findFirstImageFile } from "@/features/media/client";

describe("media upload validation", () => {
  it("accepts supported metadata and normalizes JPEG storage extensions", () => {
    expect(validateUploadMetadata({ name: "Research Portrait.JPEG", size: 2048, type: "image/jpeg" }, 4096)).toEqual({ extension: "jpg", mimeType: "image/jpeg", originalFilename: "Research Portrait.JPEG" });
  });

  it("rejects unsupported types, empty files, oversized files, and inconsistent extensions", () => {
    expect(() => validateUploadMetadata({ name: "vector.svg", size: 100, type: "image/svg+xml" }, 4096)).toThrow(UploadValidationError);
    expect(() => validateUploadMetadata({ name: "empty.png", size: 0, type: "image/png" }, 4096)).toThrow("empty");
    expect(() => validateUploadMetadata({ name: "large.png", size: 5000, type: "image/png" }, 4096)).toThrow("exceeds");
    expect(() => validateUploadMetadata({ name: "renamed.pdf", size: 100, type: "image/png" }, 4096)).toThrow("extension");
  });

  it("checks file signatures instead of trusting the browser MIME value", () => {
    expect(hasValidFileSignature(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png")).toBe(true);
    expect(hasValidFileSignature(new TextEncoder().encode("%PDF-1.7"), "application/pdf")).toBe(true);
    expect(hasValidFileSignature(new TextEncoder().encode("<script>"), "image/png")).toBe(false);
  });

  it("reads dimensions only from bounded allowlisted image headers", () => {
    const pngHeader = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 2, 0, 0, 0, 3]);
    const gifHeader = Uint8Array.from([...new TextEncoder().encode("GIF89a"), 4, 0, 5, 0]);
    expect(getImageDimensions(pngHeader, "image/png")).toEqual({ width: 2, height: 3 });
    expect(getImageDimensions(gifHeader, "image/gif")).toEqual({ width: 4, height: 5 });
    expect(getImageDimensions(new Uint8Array(), "image/jpeg")).toBeNull();
  });

  it("selects the first image from clipboard and drop file collections", () => {
    const pdf = { type: "application/pdf" };
    const png = { type: "image/png" };
    const gif = { type: "image/gif" };
    expect(findFirstImageFile([pdf, png, gif])).toBe(png);
    expect(findFirstImageFile([pdf])).toBeUndefined();
  });

  it("accepts only complete image selections for managed image fields", () => {
    const image = { id: "image-id", mimeType: "image/png" };
    expect(isCompleteImageMediaSelection([image.id], [image])).toBe(true);
    expect(isCompleteImageMediaSelection([image.id], [])).toBe(false);
    expect(isCompleteImageMediaSelection(["pdf-id"], [{ id: "pdf-id", mimeType: "application/pdf" }])).toBe(false);
  });
});

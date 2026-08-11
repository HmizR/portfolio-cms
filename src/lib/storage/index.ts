import "server-only";

import { S3StorageProvider } from "@/lib/storage/s3-provider";

export const storage = new S3StorageProvider();

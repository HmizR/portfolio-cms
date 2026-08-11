import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "@/lib/env/server";
import type { ReadObject, StorageProvider, StoredObject, UploadInput } from "@/lib/storage/types";

export class S3StorageProvider implements StorageProvider {
  private readonly client = new S3Client({
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE,
    region: env.S3_REGION,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });

  async upload(input: UploadInput): Promise<StoredObject> {
    await this.client.send(new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: input.key,
      Body: input.body,
      ContentLength: input.contentLength,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }));
    return { key: input.key };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
  }

  async read(key: string): Promise<ReadObject> {
    const result = await this.client.send(new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
    if (!result.Body) throw new Error("Stored object response was incomplete.");
    const body = await result.Body.transformToByteArray();
    return { body, contentLength: result.ContentLength ?? body.byteLength };
  }
}

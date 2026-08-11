export interface UploadInput {
  body: Uint8Array;
  contentLength: number;
  contentType: string;
  key: string;
}

export interface StoredObject {
  key: string;
}

export interface ReadObject {
  body: Uint8Array;
  contentLength: number;
}

export interface StorageProvider {
  delete(key: string): Promise<void>;
  read(key: string): Promise<ReadObject>;
  upload(input: UploadInput): Promise<StoredObject>;
}

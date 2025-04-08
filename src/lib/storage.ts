import type { DeleteOptions } from "node_modules/@google-cloud/storage/build/esm/src/nodejs-common/service-object";
import { type UploadOptions, Storage } from "@google-cloud/storage";
import { env } from "@/env";

const storage = new Storage({
  projectId: env.GS_PROJECT_ID,
  credentials: {
    client_email: env.GS_CLIENT_EMAIL,
    private_key: env.GS_PRIVATE_KEY,
  },
});

const bucketName = env.GS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export function createFile(fileName: string) {
  return bucket.file(fileName);
}

export async function uploadFile(name: string, options: UploadOptions = {}) {
  return await bucket.upload(name, options);
}

export async function deleteFile(fileName: string, opts?: DeleteOptions) {
  return await createFile(fileName).delete(opts);
}

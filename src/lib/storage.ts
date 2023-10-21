import { Storage, type UploadOptions } from "@google-cloud/storage";
import { env } from "@/env.mjs";

const storage = new Storage({
  projectId: env.GS_PROJECT_ID,
  credentials: {
    client_email: env.GS_CLIENT_EMAIL,
    private_key: env.GS_PRIVATE_KEY,
  },
});

const bucketName = env.GS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export async function uploadFile(name: string, options: UploadOptions = {}) {
  return await bucket.upload(name, options);
}

export async function deleteFile(fileName: string) {
  return await bucket.file(fileName).delete();
}

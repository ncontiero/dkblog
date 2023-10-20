import { Storage, type UploadOptions } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GS_PROJECT_ID,
  credentials: {
    client_email: process.env.GS_CLIENT_EMAIL,
    private_key: process.env.GS_PRIVATE_KEY,
  },
});

const bucketName = process.env.GS_BUCKET_NAME;

if (!bucketName) {
  throw new Error("Missing GS_BUCKET_NAME environment variable");
}

const bucket = storage.bucket(bucketName);

export async function uploadFile(name: string, options: UploadOptions = {}) {
  return await bucket.upload(name, options);
}

export async function deleteFile(fileName: string) {
  return await bucket.file(fileName).delete();
}

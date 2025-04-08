import { randomBytes } from "node:crypto";
import fs from "node:fs";
import { env } from "@/env";
import { createFile, uploadFile } from "@/lib/storage";

// DEV
const PUBLIC_FOLDER = "./public";
const FILES_FOLDER = "/uploads/";
const UPLOAD_FOLDER = `${PUBLIC_FOLDER}${FILES_FOLDER}`;

// PROD
const GS_FOLDER = `${env.GS_BUCKET_NAME}/`;
const GS_URL = `https://storage.googleapis.com/${GS_FOLDER}`;

interface saveFileProps {
  folder: string;
  fileName?: string;
  /**
   * Only in DEV
   */
  returnFileURLWithAbsoluteURL?: boolean;
}

export async function saveFile(file: Blob, options: saveFileProps) {
  const { returnFileURLWithAbsoluteURL } = options;
  const absoluteURL = returnFileURLWithAbsoluteURL ? env.SITE_BASEURL : "";

  const name = options.fileName || randomBytes(12).toString("hex");
  const fileExt = file.type.split("/").pop();
  const fileName = `${name}.${fileExt}`;

  let filePath = "";
  let fileURL = "";

  switch (env.NODE_ENV) {
    case "development": {
      if (!fs.existsSync(`${UPLOAD_FOLDER}${options.folder}`)) {
        fs.mkdirSync(`${UPLOAD_FOLDER}${options.folder}`, { recursive: true });
      }
      filePath = `${UPLOAD_FOLDER}${options.folder}/${fileName}`;
      fileURL = `${absoluteURL}${FILES_FOLDER}${options.folder}/${fileName}`;

      const newFile = fs.createWriteStream(filePath);
      newFile.write(Buffer.from(await file.arrayBuffer()));
      newFile.close();

      return { filePath, fileURL };
    }
    case "production": {
      const buffer = Buffer.from(await file.arrayBuffer());
      const tempPath = `temp_${fileName}`;
      await fs.promises.writeFile(tempPath, buffer);

      const dest = `${options.folder}/${fileName}`;
      await uploadFile(tempPath, {
        destination: dest,
      });

      await fs.promises.unlink(tempPath);

      fileURL = GS_URL + dest;
      filePath = fileURL;
    }
  }

  return { filePath, fileURL };
}

export async function deleteFile(filePath: string, folder: string) {
  const filename = filePath.split("/").pop();

  if (!filename) {
    throw new Error("Invalid file path");
  }

  switch (env.NODE_ENV) {
    case "development": {
      const file = `${UPLOAD_FOLDER}${folder}/${filename}`;

      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      } else {
        console.error("File not found");
      }
      return;
    }
    case "production": {
      const file = createFile(`${folder}/${filename}`);

      if (await file.exists()) {
        await file.delete();
      } else {
        console.error("File not found");
      }
      return;
    }
  }
}

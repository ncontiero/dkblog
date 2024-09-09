import { randomBytes } from "node:crypto";
import fs from "node:fs";
import { env } from "@/env.mjs";
import { uploadFile } from "@/lib/storage";

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
      const newFile = fs.createWriteStream(fileName);
      newFile.write(Buffer.from(await file.arrayBuffer()));
      newFile.close();
      const dest = `${options.folder}/${fileName}`;

      await uploadFile(newFile.path.toString(), {
        destination: dest,
      });

      fs.unlinkSync(newFile.path.toString());

      fileURL = GS_URL + dest;
      filePath = fileURL;
    }
  }

  return { filePath, fileURL };
}

import { errorResponse } from "@/utils/errorResponse";
import fs from "node:fs";
import crypto from "node:crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    const field = formData.get("field") || "posts";
    const id = crypto.randomBytes(10).toString("hex");
    let filename = formData.get("filename") || id;

    if (!file) {
      throw new Error("No file provided");
    }
    if (
      !field.toString().includes("posts") &&
      !field.toString().includes("tags")
    ) {
      throw new Error("Invalid field");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type");
    }

    const uploadFolder = "uploads";
    const outputFolder = `${process.cwd()}/public/${uploadFolder}/${field}`;
    fs.mkdirSync(outputFolder, { recursive: true });

    if (fs.existsSync(`${outputFolder}/${filename}.jpg`)) {
      filename = `${filename}-${id}`;
    }

    const newFile = fs.createWriteStream(`${outputFolder}/${filename}.jpg`);
    newFile.write(Buffer.from(await file.arrayBuffer()));
    newFile.close();

    const path = `/${uploadFolder}/${field}/${filename}.jpg`;

    return new Response(JSON.stringify({ image: path }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return errorResponse(e, [
      "No file provided",
      "Invalid file type",
      "Invalid field",
    ]);
  }
}

import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/env";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export class FileService {
  static async upload(
    fileBuffer: Buffer,
    folder: string = "resumes",
    resourceType: "auto" | "image" | "raw" | "video" = "auto",
  ) {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Cannot upload an empty buffer");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          format: resourceType === "image" ? "pdf" : undefined,
          access_mode: "public",
          type: "upload",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  static async delete(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }

  static getSignedUrl(publicId: string) {
    return cloudinary.url(publicId, { secure: true });
  }
}

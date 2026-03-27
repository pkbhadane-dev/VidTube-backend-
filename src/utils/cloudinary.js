import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (loacalFilePath) => {
  try {
    if (!loacalFilePath) return null;

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "vidtube",
          chunk_size: 6000000,
          timeout: 120000,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary stream error", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      fs.createReadStream(loacalFilePath).pipe(uploadStream);
    });

    const response = await uploadPromise;

    // const response = await cloudinary.uploader.upload(loacalFilePath, {
    //   resource_type: "auto",
    //   folder:"youtube",
    //   timeout: 120000
    // });

    if (fs.existsSync(loacalFilePath)) {
      fs.unlinkSync(loacalFilePath);
    }

    console.log("file successfully upload on cloudinary", response.url);

    return response;
  } catch (error) {
    if (fs.existsSync(loacalFilePath)) {
      fs.unlinkSync(loacalFilePath);
    }
    console.log("Cloudinary upload failed", error);
    return null;
  }
};

export const deleteOnCloudinary = async (publicId, resource_type = "image") => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type,
    });
    console.log("file deleted from cloudinary");

    return response;
  } catch (error) {
    console.log("Error while deleting from cloudinary", error);
    return null;
  }
};

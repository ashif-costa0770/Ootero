import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});




//!  Delete single file from Cloudinary

const deleteFromCloudinary = async (
    publicId,
    resourceType = "image"
  ) => {
    try {
      return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error("Failed to delete file from Cloudinary");
    }
  };

  export {cloudinary, deleteFromCloudinary  }

import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: String(process.env.CLOUD_NAME),
  api_key: String(process.env.CLOUD_KEY),
  api_secret: String(process.env.CLOUD_SECRET),
});

const ImageUpload = async (image: string) => {
  try {
    const response = await cloudinary.uploader.upload(image, {
      upload_preset: "petCares",
    });
    return response.url;
  } catch {
    console.log("error");
  }
};

export default ImageUpload;

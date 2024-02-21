import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: String(process.env.CLOUD_NAME),
  api_key: String(process.env.CLOUD_KEY),
  api_secret: String(process.env.CLOUD_SECRET),
});

const multiImageUpload = async (image: string[]) => {
  try {
    const multiImageUrl = image.map(async (image) => {
      const response = await cloudinary.uploader.upload(image, {
        upload_preset: "petCares",
      });
      return response.url;
    });
    return await multiImageUrl;
  } catch {
    console.log("error");
  }
};

export default multiImageUpload;

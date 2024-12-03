import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: String(process.env.CLOUD_NAME),
  api_key: String(process.env.CLOUD_KEY),
  api_secret: String(process.env.CLOUD_SECRET),
});

const ImageDete = async (image: string) => {
  console.log(image);
  const splitImage = image.split("/")[image.split("/").length - 1];
  const ImageName = splitImage.split(".")[0];
  try {
    await cloudinary.uploader.destroy(ImageName);
  } catch (err) {
    console.log("error", err);
  }
};

export default ImageDete;

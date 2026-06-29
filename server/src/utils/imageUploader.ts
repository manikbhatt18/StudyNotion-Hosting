import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

export const uploadImageToCloudinary = async (
  file: any,
  folder: string,
  height?: number,
  quality?: number | string
): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  console.log("OPTIONS", options);
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

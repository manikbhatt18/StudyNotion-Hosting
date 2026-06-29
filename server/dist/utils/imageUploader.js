"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    console.log("OPTIONS", options);
    return await cloudinary_1.v2.uploader.upload(file.tempFilePath, options);
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;

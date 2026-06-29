"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubSection = exports.updateSubSection = exports.createSubSection = void 0;
const Section_1 = __importDefault(require("../models/Section"));
const Subsection_1 = __importDefault(require("../models/Subsection"));
const imageUploader_1 = require("../utils/imageUploader");
// Create a new sub-section for a given section
const createSubSection = async (req, res) => {
    try {
        // Extract necessary information from the request body
        const { sectionId, title, description } = req.body;
        const video = req.files?.video;
        // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
            return res
                .status(404)
                .json({ success: false, message: "All Fields are Required" });
        }
        console.log(video);
        // Upload the video file to Cloudinary
        const uploadDetails = await (0, imageUploader_1.uploadImageToCloudinary)(video, process.env.FOLDER_NAME);
        console.log(uploadDetails);
        // Create a new sub-section with the necessary information
        const SubSectionDetails = await Subsection_1.default.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });
        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section_1.default.findByIdAndUpdate({ _id: sectionId }, { $push: { subSection: SubSectionDetails._id } }, { new: true }).populate("subSection");
        // Return the updated section in the response
        return res.status(200).json({ success: true, data: updatedSection });
    }
    catch (error) {
        // Handle any errors that may occur during the process
        console.error("Error creating new sub-section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.createSubSection = createSubSection;
const updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await Subsection_1.default.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }
        if (title !== undefined) {
            subSection.title = title;
        }
        if (description !== undefined) {
            subSection.description = description;
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await (0, imageUploader_1.uploadImageToCloudinary)(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }
        await subSection.save();
        // find updated section and return it
        const updatedSection = await Section_1.default.findById(sectionId).populate("subSection");
        console.log("updated section", updatedSection);
        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        });
    }
};
exports.updateSubSection = updateSubSection;
const deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;
        await Section_1.default.findByIdAndUpdate({ _id: sectionId }, {
            $pull: {
                subSection: subSectionId,
            },
        });
        const subSection = await Subsection_1.default.findByIdAndDelete({ _id: subSectionId });
        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" });
        }
        // find updated section and return it
        const updatedSection = await Section_1.default.findById(sectionId).populate("subSection");
        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        });
    }
};
exports.deleteSubSection = deleteSubSection;

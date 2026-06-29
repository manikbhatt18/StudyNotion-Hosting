"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSection = exports.updateSection = exports.createSection = void 0;
const Section_1 = __importDefault(require("../models/Section"));
const Course_1 = __importDefault(require("../models/Course"));
const Subsection_1 = __importDefault(require("../models/Subsection"));
// CREATE a new section
const createSection = async (req, res) => {
    try {
        // Extract the required properties from the request body
        const { sectionName, courseId } = req.body;
        // Validate the input
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required properties",
            });
        }
        // Create a new section with the given name
        const newSection = await Section_1.default.create({ sectionName });
        // Add the new section to the course's content array
        const updatedCourse = await Course_1.default.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id,
            },
        }, { new: true })
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        // Return the updated course object in the response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        });
    }
    catch (error) {
        // Handle errors
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.createSection = createSection;
// UPDATE a section
const updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId, courseId } = req.body;
        const section = await Section_1.default.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        const course = await Course_1.default.findById(courseId)
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        console.log(course);
        return res.status(200).json({
            success: true,
            message: "Section updated",
            data: course,
        });
    }
    catch (error) {
        console.error("Error updating section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.updateSection = updateSection;
// DELETE a section
const deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;
        await Course_1.default.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            },
        });
        const section = await Section_1.default.findById(sectionId);
        console.log(sectionId, courseId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        // Delete the associated subsections
        await Subsection_1.default.deleteMany({ _id: { $in: section.subSection } });
        await Section_1.default.findByIdAndDelete(sectionId);
        // find the updated course and return it
        const course = await Course_1.default.findById(courseId)
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        return res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course,
        });
    }
    catch (error) {
        console.error("Error deleting section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.deleteSection = deleteSection;

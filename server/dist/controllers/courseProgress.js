"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseProgress = void 0;
const Subsection_1 = __importDefault(require("../models/Subsection"));
const CourseProgress_1 = __importDefault(require("../models/CourseProgress"));
const updateCourseProgress = async (req, res) => {
    const { courseId, subsectionId } = req.body;
    const userId = req.user?.id;
    try {
        // Check if the subsection is valid
        const subsection = await Subsection_1.default.findById(subsectionId);
        if (!subsection) {
            return res.status(404).json({ error: "Invalid subsection" });
        }
        // Find the course progress document for the user and course
        let courseProgress = await CourseProgress_1.default.findOne({
            courseID: courseId,
            userId: userId,
        });
        if (!courseProgress) {
            // If course progress doesn't exist, create a new one
            return res.status(404).json({
                success: false,
                message: "Course progress Does Not Exist",
            });
        }
        else {
            // If course progress exists, check if the subsection is already completed
            if (courseProgress.completedVideos.includes(subsectionId)) {
                return res.status(400).json({ error: "Subsection already completed" });
            }
            // Push the subsection into the completedVideos array
            courseProgress.completedVideos.push(subsectionId);
        }
        // Save the updated course progress
        await courseProgress.save();
        return res.status(200).json({ message: "Course progress updated" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateCourseProgress = updateCourseProgress;

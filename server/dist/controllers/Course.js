"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.getInstructorCourses = exports.getFullCourseDetails = exports.getCourseDetails = exports.getAllCourses = exports.editCourse = exports.createCourse = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const Category_1 = __importDefault(require("../models/Category"));
const Section_1 = __importDefault(require("../models/Section"));
const Subsection_1 = __importDefault(require("../models/Subsection"));
const User_1 = __importDefault(require("../models/User"));
const imageUploader_1 = require("../utils/imageUploader");
const CourseProgress_1 = __importDefault(require("../models/CourseProgress"));
const secToDuration_1 = require("../utils/secToDuration");
// Function to create a new course
const createCourse = async (req, res) => {
    try {
        // Get user ID from request object
        const userId = req.user?.id;
        // Get all required fields from request body
        let { courseName, courseDescription, whatYouWillLearn, price, tag: _tag, category, status, instructions: _instructions, } = req.body;
        // Get thumbnail image from request files
        const thumbnail = req.files?.thumbnailImage;
        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);
        console.log("tag", tag);
        console.log("instructions", instructions);
        // Check if any of the required fields are missing
        if (!courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category ||
            !instructions.length) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }
        if (!status || status === undefined) {
            status = "Draft";
        }
        // Check if the user is an instructor
        const instructorDetails = await User_1.default.findById(userId, {
            accountType: "Instructor",
        });
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }
        // Check if the tag given is valid
        const categoryDetails = await Category_1.default.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            });
        }
        // Upload the Thumbnail to Cloudinary
        const thumbnailImage = await (0, imageUploader_1.uploadImageToCloudinary)(thumbnail, process.env.FOLDER_NAME);
        console.log(thumbnailImage);
        // Create a new course with the given details
        const newCourse = await Course_1.default.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
        });
        // Add the new course to the User Schema of the Instructor
        await User_1.default.findByIdAndUpdate({
            _id: instructorDetails._id,
        }, {
            $push: {
                courses: newCourse._id,
            },
        }, { new: true });
        // Add the new course to the Categories
        const categoryDetails2 = await Category_1.default.findByIdAndUpdate({ _id: category }, {
            $push: {
                courses: newCourse._id,
            },
        }, { new: true });
        console.log("HEREEEEEEEE", categoryDetails2);
        // Return the new course and a success message
        return res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });
    }
    catch (error) {
        // Handle any errors that occur during the creation of the course
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};
exports.createCourse = createCourse;
// Edit Course Details
const editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        // If Thumbnail Image is found, update it
        if (req.files) {
            console.log("thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await (0, imageUploader_1.uploadImageToCloudinary)(thumbnail, process.env.FOLDER_NAME);
            course.thumbnail = thumbnailImage.secure_url;
        }
        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key]);
                }
                else {
                    course[key] = updates[key];
                }
            }
        }
        await course.save();
        const updatedCourse = await Course_1.default.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        return res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.editCourse = editCourse;
// Get Course List
const getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course_1.default.find({ status: "Published" }, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        })
            .populate("instructor")
            .exec();
        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: `Can't Fetch Course Data`,
            error: error.message,
        });
    }
};
exports.getAllCourses = getAllCourses;
const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const courseDetails = await Course_1.default.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
                select: "-videoUrl",
            },
        })
            .exec();
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            });
        }
        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });
        const totalDuration = (0, secToDuration_1.convertSecondsToDuration)(totalDurationInSeconds);
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getCourseDetails = getCourseDetails;
const getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user?.id;
        const courseDetails = await Course_1.default.findOne({
            _id: courseId,
        })
            .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
            .exec();
        let courseProgressCount = await CourseProgress_1.default.findOne({
            courseID: courseId,
            userId: userId,
        });
        console.log("courseProgressCount : ", courseProgressCount);
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            });
        }
        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });
        const totalDuration = (0, secToDuration_1.convertSecondsToDuration)(totalDurationInSeconds);
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : [],
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getFullCourseDetails = getFullCourseDetails;
// Get a list of Course for a given Instructor
const getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user?.id;
        // Find all courses belonging to the instructor
        const instructorCourses = await Course_1.default.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 });
        // Return the instructor's courses
        return res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};
exports.getInstructorCourses = getInstructorCourses;
// Delete the Course
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        // Find the course
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnroled;
        for (const studentId of studentsEnrolled) {
            await User_1.default.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            });
        }
        // Delete sections and sub-sections
        const courseSections = course.courseContent;
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section_1.default.findById(sectionId);
            if (section) {
                const subSections = section.subSection;
                for (const subSectionId of subSections) {
                    await Subsection_1.default.findByIdAndDelete(subSectionId);
                }
            }
            // Delete the section
            await Section_1.default.findByIdAndDelete(sectionId);
        }
        // Delete the course
        await Course_1.default.findByIdAndDelete(courseId);
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
exports.deleteCourse = deleteCourse;

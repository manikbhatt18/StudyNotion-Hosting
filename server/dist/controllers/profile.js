"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorDashboard = exports.getEnrolledCourses = exports.updateDisplayPicture = exports.getAllUserDetails = exports.deleteAccount = exports.updateProfile = void 0;
const Profile_1 = __importDefault(require("../models/Profile"));
const CourseProgress_1 = __importDefault(require("../models/CourseProgress"));
const Course_1 = __importDefault(require("../models/Course"));
const User_1 = __importDefault(require("../models/User"));
const imageUploader_1 = require("../utils/imageUploader");
const mongoose_1 = __importDefault(require("mongoose"));
const secToDuration_1 = require("../utils/secToDuration");
// Method for updating a profile
const updateProfile = async (req, res) => {
    try {
        const { firstName = "", lastName = "", dateOfBirth = "", about = "", contactNumber = "", gender = "", } = req.body;
        const id = req.user?.id;
        // Find the profile by id
        const userDetails = await User_1.default.findById(id);
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const profile = await Profile_1.default.findById(userDetails.additionalDetails);
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }
        const user = await User_1.default.findByIdAndUpdate(id, {
            firstName,
            lastName,
        });
        if (user) {
            await user.save();
        }
        // Update the profile fields
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;
        // Save the updated profile
        await profile.save();
        // Find the updated user details
        const updatedUserDetails = await User_1.default.findById(id)
            .populate("additionalDetails")
            .exec();
        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.updateProfile = updateProfile;
const deleteAccount = async (req, res) => {
    try {
        const id = req.user?.id;
        console.log(id);
        const user = await User_1.default.findById({ _id: id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Delete Assosiated Profile with the User
        await Profile_1.default.findByIdAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(user.additionalDetails),
        });
        for (const courseId of user.courses) {
            await Course_1.default.findByIdAndUpdate(courseId, { $pull: { studentsEnroled: id } }, { new: true });
        }
        // Now Delete User
        await User_1.default.findByIdAndDelete({ _id: id });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
        await CourseProgress_1.default.deleteMany({ userId: id });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "User Cannot be deleted successfully" });
    }
};
exports.deleteAccount = deleteAccount;
const getAllUserDetails = async (req, res) => {
    try {
        const id = req.user?.id;
        const userDetails = await User_1.default.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        return res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllUserDetails = getAllUserDetails;
const updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files?.displayPicture;
        const userId = req.user?.id;
        const image = await (0, imageUploader_1.uploadImageToCloudinary)(displayPicture, process.env.FOLDER_NAME, 1000, 1000);
        console.log(image);
        const updatedProfile = await User_1.default.findByIdAndUpdate({ _id: userId }, { image: image.secure_url }, { new: true });
        return res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateDisplayPicture = updateDisplayPicture;
const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        let userDetails = await User_1.default.findOne({
            _id: userId,
        })
            .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            },
        })
            .exec();
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            });
        }
        const userObj = userDetails.toObject();
        var SubsectionLength = 0;
        for (var i = 0; i < userObj.courses.length; i++) {
            let totalDurationInSeconds = 0;
            SubsectionLength = 0;
            for (var j = 0; j < userObj.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userObj.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
                userObj.courses[i].totalDuration = (0, secToDuration_1.convertSecondsToDuration)(totalDurationInSeconds);
                SubsectionLength +=
                    userObj.courses[i].courseContent[j].subSection.length;
            }
            let courseProgressCount = await CourseProgress_1.default.findOne({
                courseID: userObj.courses[i]._id,
                userId: userId,
            });
            const completedVideosCount = courseProgressCount?.completedVideos?.length || 0;
            if (SubsectionLength === 0) {
                userObj.courses[i].progressPercentage = 100;
            }
            else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2);
                userObj.courses[i].progressPercentage =
                    Math.round((completedVideosCount / SubsectionLength) * 100 * multiplier) / multiplier;
            }
        }
        return res.status(200).json({
            success: true,
            data: userObj.courses,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getEnrolledCourses = getEnrolledCourses;
const instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course_1.default.find({ instructor: req.user?.id });
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnroled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;
            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            };
            return courseDataWithStats;
        });
        return res.status(200).json({ courses: courseData });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.instructorDashboard = instructorDashboard;

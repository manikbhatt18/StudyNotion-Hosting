import Profile from "../models/Profile";
import CourseProgress from "../models/CourseProgress";
import Course from "../models/Course";
import User from "../models/User";
import { uploadImageToCloudinary } from "../utils/imageUploader";
import mongoose from "mongoose";
import { convertSecondsToDuration } from "../utils/secToDuration";
import { Response } from "express";
import { CustomRequest } from "../middleware/auth";

// Method for updating a profile
export const updateProfile = async (req: CustomRequest, res: Response): Promise<void | Response> => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user?.id;

    // Find the profile by id
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const user = await User.findByIdAndUpdate(id, {
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
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteAccount = async (req: CustomRequest, res: Response): Promise<void | Response> => {
  try {
    const id = req.user?.id;
    console.log(id);
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails as any),
    });
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id } },
        { new: true }
      );
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
    await CourseProgress.deleteMany({ userId: id });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

export const getAllUserDetails = async (req: CustomRequest, res: Response): Promise<void | Response> => {
  try {
    const id = req.user?.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    return res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDisplayPicture = async (req: CustomRequest, res: Response): Promise<void | Response> => {
  try {
    const displayPicture = (req as any).files?.displayPicture;
    const userId = req.user?.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME as string,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    return res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEnrolledCourses = async (req: CustomRequest, res: Response): Promise<void | Response> => {
  try {
    const userId = req.user?.id;
    let userDetails = await User.findOne({
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
      for (var j = 0; j < (userObj.courses[i] as any).courseContent.length; j++) {
        totalDurationInSeconds += (userObj.courses[i] as any).courseContent[
          j
        ].subSection.reduce((acc: any, curr: any) => acc + parseInt(curr.timeDuration), 0);
        (userObj.courses[i] as any).totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          (userObj.courses[i] as any).courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userObj.courses[i]._id,
        userId: userId,
      });
      const completedVideosCount = courseProgressCount?.completedVideos?.length || 0;
      if (SubsectionLength === 0) {
        (userObj.courses[i] as any).progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        (userObj.courses[i] as any).progressPercentage =
          Math.round(
            (completedVideosCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    return res.status(200).json({
      success: true,
      data: userObj.courses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const instructorDashboard = async (req: CustomRequest, res: Response): Promise<void | Response> => {
  try {
    const courseDetails = await Course.find({ instructor: req.user?.id });

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
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

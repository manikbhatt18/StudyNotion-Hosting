// Import the required modules
import express from "express";
const router = express.Router();

// Import the Controllers

// Course Controllers Import
import {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} from "../controllers/Course";

// Categories Controllers Import
import {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} from "../controllers/Category";

// Sections Controllers Import
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section";

// Sub-Sections Controllers Import
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/Subsection";

// Rating Controllers Import
import {
  createRating,
  getAverageRating,
  getAllRatingReview,
} from "../controllers/RatingandReview";
import {
  updateCourseProgress,
} from "../controllers/courseProgress";
// Importing Middlewares
import { auth, isInstructor, isStudent, isAdmin } from "../middleware/auth";

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteCourse", deleteCourse);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

export default router;

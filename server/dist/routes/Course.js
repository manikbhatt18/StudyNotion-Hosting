"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the required modules
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Import the Controllers
// Course Controllers Import
const Course_1 = require("../controllers/Course");
// Categories Controllers Import
const Category_1 = require("../controllers/Category");
// Sections Controllers Import
const Section_1 = require("../controllers/Section");
// Sub-Sections Controllers Import
const Subsection_1 = require("../controllers/Subsection");
// Rating Controllers Import
const RatingandReview_1 = require("../controllers/RatingandReview");
const courseProgress_1 = require("../controllers/courseProgress");
// Importing Middlewares
const auth_1 = require("../middleware/auth");
// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// Courses can Only be Created by Instructors
router.post("/createCourse", auth_1.auth, auth_1.isInstructor, Course_1.createCourse);
// Edit Course routes
router.post("/editCourse", auth_1.auth, auth_1.isInstructor, Course_1.editCourse);
//Add a Section to a Course
router.post("/addSection", auth_1.auth, auth_1.isInstructor, Section_1.createSection);
// Update a Section
router.post("/updateSection", auth_1.auth, auth_1.isInstructor, Section_1.updateSection);
// Delete a Section
router.post("/deleteSection", auth_1.auth, auth_1.isInstructor, Section_1.deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth_1.auth, auth_1.isInstructor, Subsection_1.updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth_1.auth, auth_1.isInstructor, Subsection_1.deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth_1.auth, auth_1.isInstructor, Subsection_1.createSubSection);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth_1.auth, auth_1.isInstructor, Course_1.getInstructorCourses);
// Get all Registered Courses
router.get("/getAllCourses", Course_1.getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", Course_1.getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth_1.auth, Course_1.getFullCourseDetails);
// To Update Course Progress
router.post("/updateCourseProgress", auth_1.auth, auth_1.isStudent, courseProgress_1.updateCourseProgress);
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteCourse", Course_1.deleteCourse);
// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth_1.auth, auth_1.isAdmin, Category_1.createCategory);
router.get("/showAllCategories", Category_1.showAllCategories);
router.post("/getCategoryPageDetails", Category_1.categoryPageDetails);
// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth_1.auth, auth_1.isStudent, RatingandReview_1.createRating);
router.get("/getAverageRating", RatingandReview_1.getAverageRating);
router.get("/getReviews", RatingandReview_1.getAllRatingReview);
exports.default = router;

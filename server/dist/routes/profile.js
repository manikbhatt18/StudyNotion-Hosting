"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const profile_1 = require("../controllers/profile");
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth_1.auth, profile_1.deleteAccount);
router.put("/updateProfile", auth_1.auth, profile_1.updateProfile);
router.get("/getUserDetails", auth_1.auth, profile_1.getAllUserDetails);
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth_1.auth, profile_1.getEnrolledCourses);
router.put("/updateDisplayPicture", auth_1.auth, profile_1.updateDisplayPicture);
router.get("/instructorDashboard", auth_1.auth, auth_1.isInstructor, profile_1.instructorDashboard);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the required modules
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Import the required controllers and middleware functions
const Auth_1 = require("../controllers/Auth");
const resetPassword_1 = require("../controllers/resetPassword");
const auth_1 = require("../middleware/auth");
// Routes for Login, Signup, and Authentication
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
// Route for user login
router.post("/login", Auth_1.login);
// Route for user signup
router.post("/signup", Auth_1.signup);
// Route for sending OTP to the user's email
router.post("/sendotp", Auth_1.sendotp);
// Route for Changing the password
router.post("/changepassword", auth_1.auth, Auth_1.changePassword);
// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************
// Route for generating a reset password token
router.post("/reset-password-token", resetPassword_1.resetPasswordToken);
// Route for resetting user's password after verification
router.post("/reset-password", resetPassword_1.resetPassword);
// Export the router for use in the main application
exports.default = router;

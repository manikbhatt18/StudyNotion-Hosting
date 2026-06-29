"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.sendotp = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const OTP_1 = __importDefault(require("../models/OTP"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const passwordUpdate_1 = require("../mail/templates/passwordUpdate");
const Profile_1 = __importDefault(require("../models/Profile"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Signup Controller for Registering Users
const signup = async (req, res) => {
    try {
        // Destructure fields from the request body
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp, } = req.body;
        // Check if All Details are there or not
        if (!firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }
        // Find the most recent OTP for the email
        const response = await OTP_1.default.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
        else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create the user
        let approved = true;
        if (accountType === "Instructor") {
            approved = false;
        }
        // Create the Additional Profile For User
        const profileDetails = await Profile_1.default.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });
        const user = await User_1.default.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: "",
        });
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};
exports.signup = signup;
// Login controller for authenticating users
const login = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;
        // Check if email or password is missing
        if (!email || !password) {
            // Return 400 Bad Request status code with error message
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }
        // Find user with provided email
        const user = await User_1.default.findOne({ email }).populate("additionalDetails");
        // If user not found with provided email
        if (!user) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }
        // Generate JWT token and Compare Password
        if (await bcrypt_1.default.compare(password, user.password)) {
            const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id, role: user.accountType }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            // Save token to user document in database
            user.token = token;
            user.password = undefined;
            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    }
    catch (error) {
        console.error(error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
};
exports.login = login;
// Send OTP For Email Verification
const sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user is already present
        // Find user with provided email
        const checkUserPresent = await User_1.default.findOne({ email });
        // to be used in case of signup
        // If user found with provided email
        if (checkUserPresent) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            });
        }
        let otp = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await OTP_1.default.findOne({ otp: otp });
        console.log("Result is Generate OTP Func");
        console.log("OTP", otp);
        console.log("Result", result);
        while (result) {
            otp = otp_generator_1.default.generate(6, {
                upperCaseAlphabets: false,
            });
            result = await OTP_1.default.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP_1.default.create(otpPayload);
        console.log("OTP Body", otpBody);
        return res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};
exports.sendotp = sendotp;
// Controller for Changing Password
const changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userId = req.user?.id;
        const userDetails = await User_1.default.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword } = req.body;
        // Validate old password
        const isPasswordMatch = await bcrypt_1.default.compare(oldPassword, userDetails.password);
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }
        // Update password
        const encryptedPassword = await bcrypt_1.default.hash(newPassword, 10);
        const updatedUserDetails = await User_1.default.findByIdAndUpdate(userId, { password: encryptedPassword }, { new: true });
        if (!updatedUserDetails) {
            return res.status(500).json({ success: false, message: "Failed to update password" });
        }
        // Send notification email
        try {
            const emailResponse = await (0, mailSender_1.default)(updatedUserDetails.email, "Password for your account has been updated", (0, passwordUpdate_1.passwordUpdated)(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`));
            console.log("Email sent successfully:", emailResponse);
        }
        catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }
        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    }
    catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};
exports.changePassword = changePassword;

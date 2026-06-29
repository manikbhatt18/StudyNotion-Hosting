"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.resetPasswordToken = void 0;
const User_1 = __importDefault(require("../models/User"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User_1.default.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }
        const token = crypto_1.default.randomBytes(20).toString("hex");
        const updatedDetails = await User_1.default.findOneAndUpdate({ email: email }, {
            token: token,
            resetPasswordExpires: Date.now() + 3600000,
        }, { new: true });
        console.log("DETAILS", updatedDetails);
        // const url = `http://localhost:3000/update-password/${token}`
        const url = `https://study-notion-frontend-six-gilt.vercel.app/update-password/${token}`;
        await (0, mailSender_1.default)(email, "Password Reset", `Your Link for email verification is ${url}. Please click this url to reset your password.`);
        return res.json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further",
        });
    }
    catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
        });
    }
};
exports.resetPasswordToken = resetPasswordToken;
const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;
        if (confirmPassword !== password) {
            return res.json({
                success: false,
                message: "Password and Confirm Password Does not Match",
            });
        }
        const userDetails = await User_1.default.findOne({ token: token });
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is Invalid",
            });
        }
        if (!(userDetails.resetPasswordExpires && userDetails.resetPasswordExpires.getTime() > Date.now())) {
            return res.status(403).json({
                success: false,
                message: `Token is Expired, Please Regenerate Your Token`,
            });
        }
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        await User_1.default.findOneAndUpdate({ token: token }, { password: encryptedPassword }, { new: true });
        return res.json({
            success: true,
            message: `Password Reset Successful`,
        });
    }
    catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
        });
    }
};
exports.resetPassword = resetPassword;

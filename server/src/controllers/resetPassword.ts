import User from "../models/User";
import mailSender from "../utils/mailSender";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";

export const resetPasswordToken = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    const token = crypto.randomBytes(20).toString("hex");

    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );
    console.log("DETAILS", updatedDetails);

    // const url = `http://localhost:3000/update-password/${token}`
    const url = `https://study-notion-frontend-six-gilt.vercel.app/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    return res.json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    });
  } catch (error: any) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }
    const userDetails = await User.findOne({ token: token });
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
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );
    return res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error: any) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};

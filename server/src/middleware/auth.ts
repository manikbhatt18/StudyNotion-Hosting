import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// We extend the Express Request interface to include the `user` property
// This tells TypeScript that `req.user` exists and what shape it has.
export interface CustomRequest extends Request {
  user?: any; // The decoded JWT payload
}

// This function is used as middleware to authenticate user requests
export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // Extracting JWT from request cookies, body or header
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = jwt.verify(token, process.env.JWT_SECRET as string);
      console.log(decode);
      // Storing the decoded JWT payload in the request object for further use
      req.user = decode;
    } catch (error) {
      // If JWT verification fails, return 401 Unauthorized response
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }

    // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (error) {
    // If there is an error during the authentication process, return 401 Unauthorized response
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
};

export const isStudent = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userDetails = await User.findOne({ email: req.user?.email });

    if (!userDetails || userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Students",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userDetails = await User.findOne({ email: req.user?.email });

    if (!userDetails || userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isInstructor = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userDetails = await User.findOne({ email: req.user?.email });
    console.log(userDetails);

    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(userDetails.accountType);

    if (userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Instructor",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

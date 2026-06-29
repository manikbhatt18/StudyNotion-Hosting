"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentSuccessEmail = exports.verifyPayment = exports.capturePayment = void 0;
const razorpay_1 = require("../config/razorpay");
const Course_1 = __importDefault(require("../models/Course"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const mongoose_1 = __importDefault(require("mongoose"));
const courseEnrollmentEmail_1 = require("../mail/templates/courseEnrollmentEmail");
const paymentSuccessEmail_1 = require("../mail/templates/paymentSuccessEmail");
const CourseProgress_1 = __importDefault(require("../models/CourseProgress"));
// Capture the payment and initiate the Razorpay order
const capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user?.id;
    if (!courses || courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" });
    }
    let total_amount = 0;
    for (const course_id of courses) {
        let course;
        try {
            // Find the course by its ID
            course = await Course_1.default.findById(course_id);
            // If the course is not found, return an error
            if (!course) {
                return res
                    .status(200)
                    .json({ success: false, message: "Could not find the Course" });
            }
            // Check if the user is already enrolled in the course
            const uid = new mongoose_1.default.Types.ObjectId(userId);
            if (course.studentsEnroled.includes(uid)) {
                return res
                    .status(200)
                    .json({ success: false, message: "Student is already Enrolled" });
            }
            // Add the price of the course to the total amount
            total_amount += course.price;
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random().toString(36).substring(2, 15),
    };
    try {
        // Initiate the payment using Razorpay
        const paymentResponse = await razorpay_1.instance.orders.create(options);
        console.log(paymentResponse);
        return res.json({
            success: true,
            data: paymentResponse,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Could not initiate order." });
    }
};
exports.capturePayment = capturePayment;
// verify the payment
const verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user?.id;
    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId) {
        return res.status(200).json({ success: false, message: "Payment Failed" });
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");
    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res);
        return res.status(200).json({ success: true, message: "Payment Verified" });
    }
    return res.status(200).json({ success: false, message: "Payment Failed" });
};
exports.verifyPayment = verifyPayment;
// Send Payment Success Email
const sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user?.id;
    if (!orderId || !paymentId || !amount || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide all the details" });
    }
    try {
        const enrolledStudent = await User_1.default.findById(userId);
        if (!enrolledStudent) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        await (0, mailSender_1.default)(enrolledStudent.email, `Payment Received`, (0, paymentSuccessEmail_1.paymentSuccessEmail)(`${enrolledStudent.firstName} ${enrolledStudent.lastName}`, amount / 100, orderId, paymentId));
        return res.status(200).json({ success: true, message: "Email sent" });
    }
    catch (error) {
        console.log("error in sending mail", error);
        return res
            .status(400)
            .json({ success: false, message: "Could not send email" });
    }
};
exports.sendPaymentSuccessEmail = sendPaymentSuccessEmail;
// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please Provide Course ID and User ID" });
    }
    for (const courseId of courses) {
        try {
            // Find the course and enroll the student in it
            const enrolledCourse = await Course_1.default.findOneAndUpdate({ _id: courseId }, { $push: { studentsEnroled: userId } }, { new: true });
            if (!enrolledCourse) {
                return res
                    .status(500)
                    .json({ success: false, error: "Course not found" });
            }
            console.log("Updated course: ", enrolledCourse);
            const courseProgress = await CourseProgress_1.default.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });
            // Find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User_1.default.findByIdAndUpdate(userId, {
                $push: {
                    courses: courseId,
                    courseProgress: courseProgress._id,
                },
            }, { new: true });
            if (!enrolledStudent) {
                continue;
            }
            console.log("Enrolled student: ", enrolledStudent);
            // Send an email notification to the enrolled student
            const emailResponse = await (0, mailSender_1.default)(enrolledStudent.email, `Successfully Enrolled into ${enrolledCourse.courseName}`, (0, courseEnrollmentEmail_1.courseEnrollmentEmail)(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`));
            console.log("Email sent successfully: ", emailResponse);
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ success: false, error: error.message });
        }
    }
};

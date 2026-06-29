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
const mongoose_1 = __importStar(require("mongoose"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const emailVerificationTemplate_1 = __importDefault(require("../mail/templates/emailVerificationTemplate"));
const OTPSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    },
});
// Define a function to send emails
async function sendVerificationEmail(email, otp) {
    // Send the email
    try {
        const mailResponse = await (0, mailSender_1.default)(email, "Verification Email", (0, emailVerificationTemplate_1.default)(otp));
        console.log("Email sent successfully: ", mailResponse.response);
    }
    catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}
// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
    console.log("New document saved to database");
    // Only send an email when a new document is created
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});
exports.default = mongoose_1.default.model("OTP", OTPSchema);

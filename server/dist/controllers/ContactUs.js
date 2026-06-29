"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsController = void 0;
const contactFormRes_1 = require("../mail/templates/contactFormRes");
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const contactUsController = async (req, res) => {
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
    console.log(req.body);
    try {
        const emailRes = await (0, mailSender_1.default)(email, "Your Data send successfully", (0, contactFormRes_1.contactUsEmail)(email, firstname, lastname, message, phoneNo, countrycode));
        console.log("Email Res ", emailRes);
        return res.json({
            success: true,
            message: "Email send successfully",
        });
    }
    catch (error) {
        console.log("Error", error);
        console.log("Error message :", error.message);
        return res.json({
            success: false,
            message: "Something went wrong...",
        });
    }
};
exports.contactUsController = contactUsController;

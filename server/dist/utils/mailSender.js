"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            secure: false,
        });
        let info = await transporter.sendMail({
            from: `"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`, // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, // Subject line
            html: `${body}`, // html body
        });
        console.log(info.response);
        return info;
    }
    catch (error) {
        console.log(error.message);
        return error.message;
    }
};
exports.default = mailSender;

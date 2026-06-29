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
// Importing necessary modules and packages
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const user_1 = __importDefault(require("./routes/user"));
const profile_1 = __importDefault(require("./routes/profile"));
const Course_1 = __importDefault(require("./routes/Course"));
const Payments_1 = __importDefault(require("./routes/Payments"));
const Contact_1 = __importDefault(require("./routes/Contact"));
const database_1 = require("./config/database");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("./config/cloudinary");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dotenv = __importStar(require("dotenv"));
// Loading environment variables from .env file
dotenv.config();
// Setting up port number
const PORT = process.env.PORT || 4000;
// Connecting to database
(0, database_1.connect)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    "http://localhost:3000",
    "https://study-notion-frontend-six-gilt.vercel.app"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
// Connecting to cloudinary
(0, cloudinary_1.cloudinaryConnect)();
// Setting up routes
app.use("/api/v1/auth", user_1.default);
app.use("/api/v1/profile", profile_1.default);
app.use("/api/v1/course", Course_1.default);
app.use("/api/v1/payment", Payments_1.default);
app.use("/api/v1/reach", Contact_1.default);
// Testing the server
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    });
});
// Listening to the server
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});
// End of code.

// Importing necessary modules and packages
import express, { Request, Response } from "express";
const app = express();
import userRoutes from "./routes/user";
import profileRoutes from "./routes/profile";
import courseRoutes from "./routes/Course";
import paymentRoutes from "./routes/Payments";
import contactUsRoute from "./routes/Contact";
import { connect } from "./config/database";
import cookieParser from "cookie-parser";
import cors from "cors";
import { cloudinaryConnect } from "./config/cloudinary";
import fileUpload from "express-fileupload";
import * as dotenv from "dotenv";

// Loading environment variables from .env file
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 4000;

// Connecting to database
connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://study-notion-frontend-six-gilt.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Testing the server
app.get("/", (req: Request, res: Response) => {
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

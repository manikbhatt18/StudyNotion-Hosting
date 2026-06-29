import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourse extends Document {
  courseName: string;
  courseDescription: string;
  instructor: Types.ObjectId;
  whatYouWillLearn: string;
  courseContent: Types.ObjectId[];
  ratingAndReviews: Types.ObjectId[];
  price: number;
  thumbnail: string;
  tag: string[];
  category: Types.ObjectId;
  studentsEnroled: Types.ObjectId[];
  instructions: string[];
  status: "Draft" | "Published";
  createdAt: Date;
}

const coursesSchema = new Schema<ICourse>({
  courseName: { type: String },
  courseDescription: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Category",
  },
  studentsEnroled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICourse>("Course", coursesSchema);

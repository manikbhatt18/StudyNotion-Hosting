import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRatingAndReview extends Document {
  user: Types.ObjectId;
  rating: number;
  review: string;
  course: Types.ObjectId;
}

const ratingAndReviewSchema = new Schema<IRatingAndReview>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
});

export default mongoose.model<IRatingAndReview>("RatingAndReview", ratingAndReviewSchema);

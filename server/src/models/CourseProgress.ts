import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourseProgress extends Document {
  courseID: Types.ObjectId;
  userId: Types.ObjectId;
  completedVideos: Types.ObjectId[];
}

const courseProgress = new Schema<ICourseProgress>({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export default mongoose.model<ICourseProgress>("courseProgress", courseProgress);

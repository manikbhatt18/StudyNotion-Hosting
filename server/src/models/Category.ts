import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  courses: Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  description: { type: String },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export default mongoose.model<ICategory>("Category", categorySchema);

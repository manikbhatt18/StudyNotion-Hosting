import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISection extends Document {
  sectionName?: string;
  subSection: Types.ObjectId[];
}

const sectionSchema = new Schema<ISection>({
  sectionName: {
    type: String,
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubSection",
    },
  ],
});

export default mongoose.model<ISection>("Section", sectionSchema);

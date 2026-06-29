import mongoose, { Document, Schema } from "mongoose";

export interface ISubSection extends Document {
  title?: string;
  timeDuration?: string;
  description?: string;
  videoUrl?: string;
}

const SubSectionSchema = new Schema<ISubSection>({
  title: { type: String },
  timeDuration: { type: String },
  description: { type: String },
  videoUrl: { type: String },
});

export default mongoose.model<ISubSection>("SubSection", SubSectionSchema);

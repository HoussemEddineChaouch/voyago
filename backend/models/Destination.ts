import mongoose, { Schema, Document } from "mongoose";

export interface IDestination extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
}

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
  },
  { timestamps: true },
);

export default mongoose.model<IDestination>("Destination", DestinationSchema);

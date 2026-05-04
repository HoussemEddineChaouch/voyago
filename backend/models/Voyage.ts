import mongoose, { Schema, Document } from "mongoose";

export interface IVoyage extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  date: Date;
  destination: mongoose.Types.ObjectId;
  image: string;
  rating: number;
  reviewCount: number;
  spotsLeft: number;
  includes: string[];
  featured: boolean;
}

const VoyageSchema = new Schema<IVoyage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    date: Date,
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    image: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    spotsLeft: { type: Number, default: 10 },
    includes: [String],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<IVoyage>("Voyage", VoyageSchema);

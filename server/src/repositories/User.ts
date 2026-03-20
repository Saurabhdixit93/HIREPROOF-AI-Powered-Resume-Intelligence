import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  totalTokensUsed: number;
  parsedResumes: Array<{
    fileName: string;
    text: string;
    uploadedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String },
    totalTokensUsed: { type: Number, default: 0 },
    parsedResumes: [
      {
        fileName: String,
        text: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);

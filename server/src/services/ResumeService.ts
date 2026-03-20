import { Resume, IResume } from "../repositories/Resume";
import mongoose from "mongoose";

export class ResumeService {
  static async create(userId: string, data: Partial<IResume>) {
    const resume = new Resume({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    });
    return await resume.save();
  }

  static async list(userId: string) {
    return await Resume.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ updatedAt: -1 });
  }

  static async getById(userId: string, resumeId: string) {
    const resume = await Resume.findOne({
      _id: new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!resume) throw new Error("Resume not found");
    return resume;
  }

  static async update(
    userId: string,
    resumeId: string,
    data: Partial<IResume>,
  ) {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(resumeId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      { $set: data },
      { returnDocument: "after" },
    );
    if (!resume) throw new Error("Resume not found");
    return resume;
  }

  static async delete(userId: string, resumeId: string) {
    const result = await Resume.deleteOne({
      _id: new mongoose.Types.ObjectId(resumeId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (result.deletedCount === 0) throw new Error("Resume not found");
    return { success: true };
  }

  static async duplicate(userId: string, resumeId: string) {
    const original = await this.getById(userId, resumeId);
    const newResume = new Resume({
      ...original.toObject(),
      _id: new mongoose.Types.ObjectId(),
      title: `${original.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await newResume.save();
  }
}

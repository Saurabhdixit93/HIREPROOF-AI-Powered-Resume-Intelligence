import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  isPublic: boolean;
  basics: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    website?: string;
    links: { label: string; url: string }[];
  };
  sections: {
    work: Array<{
      company: string;
      position: string;
      location?: string;
      startDate: string;
      endDate?: string;
      highlights: string[];
      isCurrent: boolean;
    }>;
    education: Array<{
      institution: string;
      area: string;
      studyType: string;
      startDate: string;
      endDate?: string;
      score?: string;
    }>;
    skills: Array<{
      name: string;
      level?: string;
      keywords: string[];
    }>;
    projects: Array<{
      name: string;
      description: string;
      highlights: string[];
      url?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
      url?: string;
    }>;
    languages: Array<{
      language: string;
      fluency: string;
    }>;
  };
  metadata: {
    templateId: string;
    layout: string[];
    theme: {
      primaryColor: string;
      fontFamily: string;
      fontSize: string;
    };
  };
  stats?: {
    readiness: number;
    atsScore: number;
    marketFit: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    basics: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      location: String,
      summary: String,
      website: String,
      links: [{ label: String, url: String }],
    },
    sections: {
      work: [
        {
          company: String,
          position: String,
          location: String,
          startDate: String,
          endDate: String,
          highlights: [String],
          isCurrent: { type: Boolean, default: false },
        },
      ],
      education: [
        {
          institution: String,
          area: String,
          studyType: String,
          startDate: String,
          endDate: String,
          score: String,
        },
      ],
      skills: [
        {
          name: String,
          level: String,
          keywords: [String],
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          highlights: [String],
          url: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: String,
          url: String,
        },
      ],
      languages: [
        {
          language: String,
          fluency: String,
        },
      ],
    },
    metadata: {
      templateId: { type: String, default: "modern-1" },
      layout: [String],
      theme: {
        primaryColor: { type: String, default: "#000000" },
        fontFamily: { type: String, default: "Inter" },
        fontSize: { type: String, default: "10pt" },
      },
    },
    stats: {
      readiness: { type: Number, default: 0 },
      atsScore: { type: Number, default: 0 },
      marketFit: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export const Resume = mongoose.model<IResume>("Resume", ResumeSchema);

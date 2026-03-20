import { Hono } from "hono";
import { AppEnv } from "../app";
import { CoverLetterService } from "../services/CoverLetterService";
import { User } from "../repositories/User";
import { authMiddleware } from "../middleware/auth";

const coverLetter = new Hono<AppEnv>();

coverLetter.use("*", authMiddleware);

// Resume Upload & Parse
coverLetter.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["resume"];

  if (!file || !(file instanceof File)) {
    return c.json({ success: false, message: "No resume file uploaded" }, 400);
  }

  const userId = c.get("userId");
  const buffer = Buffer.from(await file.arrayBuffer());
  const text = await CoverLetterService.parseResume(buffer);

  // Save to user schema
  await CoverLetterService.saveParsedResume(userId, file.name, text);

  return c.json({
    success: true,
    data: {
      text,
      fileName: file.name,
    },
  });
});

// Generate Variations
coverLetter.post("/generate", async (c) => {
  const { resumeText, jobTitle, jobDescription, provider, model } =
    await c.req.json();

  if (!resumeText || !jobTitle || !jobDescription) {
    return c.json({ success: false, message: "Missing required fields" }, 400);
  }

  const variations = await CoverLetterService.generateVariations(
    resumeText,
    jobTitle,
    jobDescription,
    provider,
    model,
  );

  return c.json({
    success: true,
    data: variations,
  });
});

// Direct PDF Download
coverLetter.post("/download", async (c) => {
  const { content, name } = await c.req.json();

  if (!content) {
    return c.json({ success: false, message: "Content is required" }, 400);
  }

  const pdfBuffer = await CoverLetterService.generatePDF(
    content,
    name || "Candidate",
  );

  c.header("Content-Type", "application/pdf");
  c.header("Content-Disposition", `attachment; filename="Cover_Letter.pdf"`);

  return c.body(pdfBuffer as any);
});

// Get User's Saved Resumes
coverLetter.get("/saved-resumes", async (c) => {
  const userId = c.get("userId");
  const user = await User.findById(userId).select("parsedResumes");

  return c.json({
    success: true,
    data: user?.parsedResumes || [],
  });
});

export default coverLetter;

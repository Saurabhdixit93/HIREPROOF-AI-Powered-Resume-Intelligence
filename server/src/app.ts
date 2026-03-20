import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

export type AppEnv = {
  Variables: {
    userId: string;
  };
};

const app = new Hono<AppEnv>().basePath("/api/v1");

// Middleware
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Error Handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      success: false,
      message: err.message || "Internal Server Error",
    },
    500,
  );
});

// Routes
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

import auth from "./controllers/AuthController";
import resumes from "./controllers/ResumeController";
import files from "./controllers/FileController";
import ai from "./controllers/AIController";
import exportController from "./controllers/ExportController";
import notificationController from "./controllers/NotificationController";
import coverLetter from "./controllers/CoverLetterController";

app.route("/auth", auth);
app.route("/resumes", resumes);
app.route("/files", files);
app.route("/ai", ai);
app.route("/exports", exportController);
app.route("/notifications", notificationController);
app.route("/cover-letter", coverLetter);

export default app;

import { Hono } from "hono";
import { AuthService } from "../services/AuthService";
import { z } from "zod";
import { AppEnv } from "../app";

const auth = new Hono();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

auth.post("/signup", async (c) => {
  const body = await c.req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, errors: parsed.error.format() }, 400);
  }

  const result = await AuthService.signup(
    parsed.data.email,
    parsed.data.password,
    parsed.data.name,
  );
  return c.json({ success: true, ...result }, 201);
});

auth.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ success: false, errors: parsed.error.format() }, 400);
  }

  const result = await AuthService.login(
    parsed.data.email,
    parsed.data.password,
  );
  return c.json({ success: true, ...result });
});

import { authMiddleware } from "../middleware/auth";

auth.get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const user = await AuthService.getUserById(userId);
  return c.json({ success: true, data: user });
});

export default auth;

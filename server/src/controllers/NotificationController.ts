import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { Notification } from "../models/Notification";
import { AppEnv } from "../app";

const notificationController = new Hono<AppEnv>();

notificationController.use("*", authMiddleware);

// Get user's recent notifications
notificationController.get("/", async (c) => {
  const userId = c.var.userId;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 50);

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  const unreadCount = await Notification.countDocuments({
    userId,
    read: false,
  });

  return c.json({
    success: true,
    data: {
      notifications,
      unreadCount,
    },
  });
});

// Mark a single notification as read
notificationController.patch("/:id/read", async (c) => {
  const userId = c.var.userId;
  const id = c.req.param("id");

  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { read: true },
    { returnDocument: "after" },
  );

  if (!notification) {
    return c.json({ success: false, message: "Notification not found" }, 404);
  }

  return c.json({ success: true, data: notification });
});

// Mark all notifications as read
notificationController.patch("/read-all", async (c) => {
  const userId = c.var.userId;

  await Notification.updateMany({ userId, read: false }, { read: true });

  return c.json({ success: true, message: "All notifications marked as read" });
});

export default notificationController;

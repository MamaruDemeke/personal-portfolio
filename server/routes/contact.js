import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { db, firestoreReady } from "../config/firebaseAdmin.js";
import { notifyOwner, sendAutoReply } from "../services/email.js";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages. Please try again later." },
});

const router = Router();

router.post(
  "/",
  contactLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required.")
      .isLength({ max: 120 }).withMessage("Name is too long."),
    body("email").trim().notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Please provide a valid email.")
      .isLength({ max: 200 }),
    body("message").trim().notEmpty().withMessage("Message is required.")
      .isLength({ min: 10, max: 5000 })
      .withMessage("Message must be between 10 and 5000 characters."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
        details: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
      });
    }

    const { name, email, message } = req.body;
    const clean = (s) => s.replace(/[\u0000-\u001F\u007F]/g, "").trim();

    try {
      const entry = {
        name: clean(name),
        email: clean(email).toLowerCase(),
        message: clean(message),
        read: false,
        ip: req.ip,
        userAgent: (req.headers["user-agent"] || "").slice(0, 300),
        createdAt: new Date().toISOString(),
      };

      let id;
      if (db && firestoreReady) {
        const docRef = await db.collection("messages").add({
          ...entry,
          createdAt: new Date(),
        });
        id = docRef.id;
      } else {
        // Fallback: append to a local JSONL file so the form still works
        id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const dataDir = path.join(process.cwd(), "data");
        fs.mkdirSync(dataDir, { recursive: true });
        fs.appendFileSync(
          path.join(dataDir, "messages.jsonl"),
          JSON.stringify({ id, ...entry }) + "\n"
        );
      }

      // Emails are best-effort — never fail the request because of SMTP
      await Promise.allSettled([
        notifyOwner({ name, email, message }),
        sendAutoReply({ name, email }),
      ]);

      return res.status(201).json({
        ok: true,
        id,
        message: "Message received.",
      });
    } catch (err) {
      console.error("[contact] failed:", err);
      return res.status(500).json({ error: "Failed to store your message. Please try again." });
    }
  }
);

export default router;

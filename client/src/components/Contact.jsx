import { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Section, { fadeUp } from "./Section.jsx";
import { db } from "../firebase.js";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";

export default function Contact() {
  const { profile, contact } = useSiteContent();
  const copy = contact || {};
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!db) {
      setStatus({
        state: "error",
        msg: "Messaging is offline — Firebase is not configured on this deployment.",
      });
      return;
    }
    setSending(true);
    setStatus({ state: "idle", msg: "" });
    try {
      // Real-time: written straight to Firestore — appears instantly in the
      // /admin dashboard's Messages tab (no backend API needed).
      await addDoc(collection(db, "messages"), {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        read: false,
        createdAt: serverTimestamp(),
      });
      setStatus({
        state: "success",
        msg: copy.successMessage || "Message sent! I'll get back to you soon.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        state: "error",
        msg: "Couldn't send your message. Please try again in a moment.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="contact" eyebrow="contact" title="Let's build" accent="something">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <motion.div variants={fadeUp} className="space-y-5">
          <p className="max-w-md leading-relaxed text-slate-400">
            {copy.intro}
          </p>

          <a
            href={`mailto:${profile.email}`}
            style={{ "--hue": "#FBBF24", "--hue-a": "#FBBF24", "--hue-b": "#FB7185" }}
            className="hue-card flex items-center gap-4 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
              <Icon name="mail" className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Email
              </span>
              <span className="block truncate text-sm text-slate-200">
                {profile.email}
              </span>
            </span>
          </a>

          <a
            href={`tel:${profile.phone}`}
            style={{ "--hue": "#A78BFA", "--hue-a": "#A78BFA", "--hue-b": "#FB7185" }}
            className="hue-card flex items-center gap-4 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet">
              <Icon name="phone" className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Phone
              </span>
              <span className="block truncate text-sm text-slate-200">
                {profile.phone}
                {profile.phoneAlt ? ` · ${profile.phoneAlt}` : ""}
              </span>
            </span>
          </a>

          <div
            style={{ "--hue": "#22D3EE", "--hue-a": "#22D3EE", "--hue-b": "#38BDF8" }}
            className="hue-card flex items-center gap-4 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
              <Icon name="pin" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Location
              </span>
              <span className="block text-sm text-slate-200">
                {profile.location}
              </span>
            </span>
          </div>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={onSubmit}
          style={{ "--hue": "#A3E635", "--hue-a": "#A3E635", "--hue-b": "#22D3EE" }}
          className="hue-card space-y-4 p-7"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-slate-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={120}
                value={form.name}
                onChange={onChange}
                placeholder="Jane Doe"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-slate-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                value={form.email}
                onChange={onChange}
                placeholder="jane@example.com"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm text-slate-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              maxLength={5000}
              value={form.message}
              onChange={onChange}
              placeholder="Tell me about your project…"
              className="input-field resize-y"
            />
          </div>

          {status.state !== "idle" && (
            <p
              role="status"
              className="rounded-lg px-4 py-2.5 text-sm"
              style={
                status.state === "success"
                  ? { background: "#10B9811F", color: "#6EE7B7" }
                  : { background: "#EF44441F", color: "#FCA5A5" }
              }
            >
              {status.msg}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="btn-primary w-full justify-center bg-gradient-to-r from-lime via-accent to-cyan disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {sending
              ? "Sending…"
              : copy.submitLabel || "Send Message"}
            <Icon name="send" className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </Section>
  );
}

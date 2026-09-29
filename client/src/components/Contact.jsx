import { useState } from "react";
import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { PROFILE } from "../data/constants.js";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ state: "idle", msg: "" });
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus({
        state: "success",
        msg: "Message sent! I'll get back to you soon.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ state: "error", msg: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="contact" eyebrow="contact" title="Get In Touch">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <motion.div variants={fadeUp} className="space-y-4 text-slate-400">
          <p className="max-w-md">
            My inbox is always open — whether you have a project in mind, a role to
            discuss, or just want to say hi. I&apos;ll do my best to reply within 24
            hours.
          </p>
          <a
            href={`mailto:${PROFILE.email}`}
            className="inline-flex items-center gap-2 font-mono text-accent hover:underline"
          >
            {PROFILE.email}
          </a>
          <p className="flex flex-col gap-1 text-sm text-slate-400">
            <a href={`tel:${PROFILE.phone}`} className="hover:text-accent">
              📞 {PROFILE.phone}
            </a>
            <a href={`tel:${PROFILE.phoneAlt}`} className="hover:text-accent">
              📞 {PROFILE.phoneAlt}
            </a>
          </p>
          <p className="text-sm text-slate-500">📍 {PROFILE.location}</p>
        </motion.div>

        <motion.form variants={fadeUp} onSubmit={onSubmit} className="glass-card space-y-4 p-6" noValidate>
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
              className={`rounded-lg px-4 py-2.5 text-sm ${
                status.state === "success"
                  ? "bg-accent/10 text-accent"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {status.msg}
            </p>
          )}

          <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {sending ? "Sending…" : "Send Message"}
          </button>
        </motion.form>
      </div>
    </Section>
  );
}

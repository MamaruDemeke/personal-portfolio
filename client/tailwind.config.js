/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#070B09",
        surface: "#101A15",
        "surface-2": "#16241D",
        accent: "#10B981",
        "accent-dark": "#059669",
        mint: "#6EE7B7",
        sage: "#8DAA91",

        /* Secondary hues used to give each section its own colour identity
           while the obsidian base stays constant. */
        violet: "#A78BFA",
        "violet-deep": "#7C3AED",
        cyan: "#22D3EE",
        "cyan-deep": "#0891B2",
        amber: "#FBBF24",
        "amber-deep": "#F59E0B",
        rose: "#FB7185",
        "rose-deep": "#E11D48",
        sky: "#38BDF8",
        lime: "#A3E635",
      },
      fontFamily: {
        sans: ["Bricolage Grotesque", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Bricolage Grotesque", "ui-sans-serif", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(16, 185, 129, 0.08)",
        "glow-accent": "0 0 24px rgba(16, 185, 129, 0.35)",
        "glow-lg": "0 0 60px rgba(16, 185, 129, 0.25)",
        "glow-violet": "0 0 28px rgba(167, 139, 250, 0.40)",
        "glow-cyan": "0 0 28px rgba(34, 211, 238, 0.40)",
        "glow-amber": "0 0 28px rgba(251, 191, 36, 0.38)",
        "glow-rose": "0 0 28px rgba(251, 113, 133, 0.38)",
      },
      backgroundImage: {
        "grad-accent": "linear-gradient(120deg, #10B981 0%, #22D3EE 100%)",
        "grad-violet": "linear-gradient(120deg, #A78BFA 0%, #FB7185 100%)",
        "grad-cyan": "linear-gradient(120deg, #22D3EE 0%, #A78BFA 100%)",
        "grad-amber": "linear-gradient(120deg, #FBBF24 0%, #FB7185 100%)",
        "grad-rose": "linear-gradient(120deg, #FB7185 0%, #A78BFA 100%)",
        "grad-lime": "linear-gradient(120deg, #A3E635 0%, #22D3EE 100%)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(4%, -6%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-5%, 4%, 0) scale(0.95)" },
        },
        "hue-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.94) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 28s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        drift: "drift 22s ease-in-out infinite",
        "hue-shift": "hue-shift 9s ease infinite",
        "pop-in": "pop-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

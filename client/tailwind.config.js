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
      },
      animation: {
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 28s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 14s linear infinite",
      },
    },
  },
  plugins: [],
};

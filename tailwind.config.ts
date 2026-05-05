import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: "#0a0a0f",
        "bg-deep": "#06060a",
        surface: "#12121e",
        "surface-2": "#181828",

        // Primary (gold)
        primary: "#c9a84c",
        "primary-light": "#e8c96a",
        "primary-dim": "#8a7434",

        // Text
        "text-main": "#f0f0f0",
        "text-muted": "#8888aa",
        "text-dim": "#555571",

        // Borders
        border: "#2a2a3e",
        "border-hair": "#1c1c2c",
      },
      fontFamily: {
        serif: ["var(--font-noto-serif)", "Noto Serif JP", "serif"],
        sans: ["var(--font-noto-sans)", "Noto Sans JP", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "ui-monospace", "monospace"],
      },
      fontFeatureSettings: {
        palt: '"palt"',
        tnum: '"tnum"',
      },
      maxWidth: {
        "frame": "1440px",
      },
      letterSpacing: {
        "wider-1": "0.12em",
        "wider-2": "0.18em",
        "wider-3": "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;

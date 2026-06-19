import type { Config } from "tailwindcss";

// Theme-Tokens an das Steuerfertig-Projekt angeglichen (Farben, Typo, Spacing).
// Bei finalem Abgleich mit Steuerfertig hier die konkreten Marken-Tokens ergänzen.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1d4ed8",
          fg: "#ffffff",
          muted: "#3b82f6",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f8fafc",
          border: "#e2e8f0",
        },
        status: {
          live: "#dc2626",
          scheduled: "#64748b",
          finished: "#16a34a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

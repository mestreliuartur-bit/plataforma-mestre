import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        // Paleta do projeto
        background: "#0a0a0f",
        surface: "#0f0f1a",
        border: "rgba(255,255,255,0.06)",
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",  // principal
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #fcd34d, #f59e0b, #fde68a)",
        "gradient-mystic": "linear-gradient(135deg, #0a0a0f, #120d1f, #0a0a0f)",
      },
      boxShadow: {
        gold: "0 0 40px rgba(245, 158, 11, 0.15)",
        "gold-lg": "0 0 80px rgba(245, 158, 11, 0.2)",
        mystic: "0 0 60px rgba(88, 28, 135, 0.2)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

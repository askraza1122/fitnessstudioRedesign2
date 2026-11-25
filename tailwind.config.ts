import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        accent: ["var(--font-accent)", "Georgia", "serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#E10600",
          dark: "#B80500",
          light: "#FDECEA",
          soft: "#FFF5F5",
        },
        ink: "#141414",
        red: {
          700: "#E10600",
          800: "#B80500",
        },
      },
    },
  },
  plugins: [],
};

export default config;

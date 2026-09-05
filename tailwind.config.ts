import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        northstar: {
          50: "#f0f4f9",
          100: "#e0eaf3",
          200: "#c7d7e8",
          300: "#9fbfd9",
          400: "#71a1c5",
          500: "#5085b1",
          600: "#3d6b94",
          700: "#325678",
          800: "#2d4964",
          900: "#293e54",
          950: "#1a2736",
        },
      },
    },
  },
  plugins: [],
};
export default config;

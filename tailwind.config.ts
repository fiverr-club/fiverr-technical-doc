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
        fiverr: {
          DEFAULT: "#1dbf73",
          hover: "#19a463",
          dark: "#0a4226",
          light: "#e9f9f0",
          charcoal: "#222325",
          slate: "#404145",
          muted: "#74767e",
          border: "#e4e5e7",
        },
      },
    },
  },
  plugins: [],
};

export default config;

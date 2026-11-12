import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212f",
        brand: "#2463eb",
        mint: "#dff7ed",
      },
      boxShadow: {
        soft: "0 12px 36px rgba(23, 33, 47, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

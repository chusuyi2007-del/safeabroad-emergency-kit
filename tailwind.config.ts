import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        calm: "#08756f",
        paper: "#f6f3ed",
        line: "#ded8ce",
        mist: "#eef7f4",
        clay: "#b85c38",
        ocean: "#315f72"
      }
    }
  },
  plugins: []
};

export default config;

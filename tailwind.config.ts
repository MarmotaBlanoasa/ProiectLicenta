import type { Config } from "tailwindcss";

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        button: "hsl(var(--primary-button))",
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1a365d',
        'light-blue': '#63b3ed',
        'light-light-blue': '#a3d5ff'
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"], // Add Poppins as a font family
      },
    },
  },
  plugins: [],
} satisfies Config;

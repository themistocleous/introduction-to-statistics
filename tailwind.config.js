// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this path matches your project structure
  ],
  theme: {
    extend: {
      // Here, we define custom color names and map them to our CSS variables.
      colors: {
        background: "var(--bg-color)",
        foreground: "var(--text-color)",
        primary: "var(--primary-color)",
        "primary-hover": "var(--primary-hover)",

        // You can also define variables for other common elements
        card: "var(--card-bg-color)",
        "card-foreground": "var(--card-text-color)",
        muted: "var(--muted-text-color)",
        border: "var(--border-color)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
  ],
};

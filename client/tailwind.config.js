// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        // semantic tokens used throughout the project
        background: "#f8fafc",     // adjust to your theme
        border: "#e6e6ea",
        foreground: "#0f172a",
        muted: "#6b7280",
        primary: "#7c3aed",
        "muted-foreground": "#9ca3af",
      },
    },
  },
  plugins: [],
};

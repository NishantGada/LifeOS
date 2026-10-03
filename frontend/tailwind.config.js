/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark-mode surfaces: soft slate with a faint blue undertone.
        // Higher number = deeper. 800 page/inputs, 700 cards/sidebar,
        // 600 borders/hover/chips, 500 dashed borders.
        navy: {
          50:  "#eef0f4",
          100: "#d5d9e1",
          200: "#b3b9c5",
          300: "#8790a0",
          400: "#5b6475",
          500: "#3a4150",
          600: "#2a303b",
          700: "#1c2028",
          800: "#161920",
          900: "#101217",
        },
        // Dark-mode text: off-white instead of pure white to cut glare.
        // 500 (muted) and up meet WCAG AA on cards; 600 is for icons/placeholders.
        mist: {
          100: "#e4e7ec",
          200: "#d0d4db",
          300: "#bcc2cc",
          400: "#9ea5b1",
          500: "#858c99",
          600: "#666d7a",
        },
        teal: {
          50:  "#e0f2f1",
          100: "#b2dfdb",
          200: "#80cbc4",
          300: "#4db6ac",
          400: "#26a69a",
          500: "#00897b",
          600: "#00796b",
          700: "#00695c",
          800: "#004d40",
          900: "#003330",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef3f2",
          100: "#fde8e4",
          200: "#fbd6ce",
          300: "#f8b4a1",
          400: "#f48970",
          500: "#ef5d3d",
          600: "#da4423",
          700: "#b5321b",
          800: "#962a1a",
          900: "#7d251b",
          950: "#460e0a",
        },
        cream: "#fffef8",
        sand: "#f5ede1",
        ink: "#1a1a1a",
        muted: "#666666",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      keyframes: {
        "fade-slide": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-down": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-slide": "fade-slide 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.3s ease-out",
        "slide-in-down": "slide-in-down 0.3s ease-out",
      },
    },
  },
  safelist: [
    // Flag icons - safelist all flag-icons classes to prevent purging
    /^fi-/,
    "fi",
  ],
  plugins: [],
};

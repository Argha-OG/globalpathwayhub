/** @type {import('tailwindcss').Config} */
const tailwindcssAnimate = require("tailwindcss-animate");

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        navy: "#144272",
        cyan: "#3FC1C9",
        offwhite: "#F5F5F5",
        yellow: "#FFD749",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#144272",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3FC1C9",
          foreground: "#144272",
        },
        destructive: {
          DEFAULT: "#144272",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#144272",
        },
        accent: {
          DEFAULT: "#FFD749",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
      },
      // Strict 8px radius across the entire system as mandated by the user
      borderRadius: {
        none: "0px",
        DEFAULT: "8px",
        xs: "8px",
        sm: "8px",
        md: "8px",
        lg: "8px",
        xl: "8px",
        "2xl": "8px",
        "3xl": "8px",
        full: "8px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shine": {
          "0%":   { transform: "translateX(-100%) skewX(-20deg)" },
          "60%":  { transform: "translateX(200%) skewX(-20deg)" },
          "100%": { transform: "translateX(200%) skewX(-20deg)" },
        },
        "heartbeat": {
          "0%,100%": { transform: "scale(1)",   boxShadow: "0 0 0 0 rgba(37,211,102,0.55)" },
          "14%":     { transform: "scale(1.07)" },
          "28%":     { transform: "scale(1)",   boxShadow: "0 0 0 8px rgba(37,211,102,0)" },
          "42%":     { transform: "scale(1.05)" },
          "70%":     { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "shine":          "shine 2.8s ease-in-out infinite",
        "heartbeat":      "heartbeat 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

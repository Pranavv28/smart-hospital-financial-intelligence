/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          base: "#F8F9FA",
          subtle: "#F1F3F5",
          surface: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          faint: "#94A3B8",
        },
        hairline: {
          DEFAULT: "#E2E8F0",
          darker: "#CBD5E1",
        },
        leakage: {
          DEFAULT: "#B45309",
          surface: "#FFFBEB",
          border: "#FDE68A",
          pill: "#FEF3C7",
        },
        surplus: {
          DEFAULT: "#047857",
          surface: "#ECFDF5",
          border: "#A7F3D0",
        },
        deficit: {
          DEFAULT: "#BE123C",
          surface: "#FFF1F2",
          border: "#FECDD3",
        },
        cobalt: {
          DEFAULT: "#2563EB",
          surface: "#EFF6FF",
          border: "#BFDBFE",
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

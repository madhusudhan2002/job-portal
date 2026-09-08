/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#132126",
        canvas: "#F7F5F0",
        panel: "#FFFFFF",
        moss: "#2F6B4F",
        mossDark: "#234F3A",
        clay: "#B4562A",
        slate: "#5B6B70",
        line: "#E4E0D6",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

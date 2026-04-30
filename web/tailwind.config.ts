import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        casino: {
          black: "#070707",
          coal: "#0d0d10",
          graphite: "#171316",
          burgundy: "#5b101b",
          red: "#941b2c",
          gold: "#d6a94f",
          amber: "#f1ca76",
          ivory: "#f5efe4",
          muted: "#b8afa3",
        },
      },
      boxShadow: {
        premium: "0 28px 120px rgba(0, 0, 0, 0.48)",
        glow: "0 0 70px rgba(214, 169, 79, 0.18)",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

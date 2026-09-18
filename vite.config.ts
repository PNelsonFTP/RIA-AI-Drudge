import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site: https://pnelsonftp.github.io/RIA-AI-Drudge/
const base = "/RIA-AI-Drudge/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    outDir: "dist",
  },
});

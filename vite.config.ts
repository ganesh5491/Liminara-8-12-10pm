import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create plugin array dynamically
const plugins = [react(), runtimeErrorOverlay()];

if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
  // Lazy load cartographer only in dev repl.it
  import("@replit/vite-plugin-cartographer").then((m) => {
    plugins.push(m.cartographer());
  });
}

export default defineConfig({
  // ✅ Use "/" for Netlify deployment
  base: "/",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

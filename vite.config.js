import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/models": {
        target: "https://d7yb14d27s1sv.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/models/, "/aws-models"),
      },
    },
    port: 3000,
    open: true,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  optimizeDeps: {
    include: ["@mkkellogg/gaussian-splats-3d"],
  },
  publicDir: "public",
});

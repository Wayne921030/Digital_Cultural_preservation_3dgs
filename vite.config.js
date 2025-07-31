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
        rewrite: (path) => path.replace(/^\/models/, "/models"),
      },
      "/img": {
        target: "https://d7yb14d27s1sv.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img/, "/img"),
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "three-vendor": ["three", "@mkkellogg/gaussian-splats-3d"],
        },
      },
    },
  },
});

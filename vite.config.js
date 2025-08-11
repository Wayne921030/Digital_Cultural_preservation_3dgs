// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/models": {
        target: "https://dr4wh7nh38tn3.cloudfront.net",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/models/, "/models"),
      },
      "/img": {
        target: "https://d7yb14d27s1sv.cloudfront.net",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/img/, "/img"),
      },
    },
  },
  optimizeDeps: { include: ["@mkkellogg/gaussian-splats-3d"] },
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
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  assetsInclude: ["**/*.spz", "**/*.ply", "**/*.splat"],
});

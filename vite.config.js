import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // GitHub Pages configuration for custom domain
  base: '/',
  
  optimizeDeps: {
    include: ["@mkkellogg/gaussian-splats-3d"],
  },
  
  publicDir: "public",
  
  // Enhanced build configuration for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Ensure compatibility with GitHub Pages
    target: 'es2015',
    
    // Handle large Gaussian Splatting assets
    assetsInlineLimit: 0, // Don't inline assets (keep .spz files separate)
    
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "three-vendor": ["three", "@mkkellogg/gaussian-splats-3d"],
        },
        
        // Ensure consistent asset naming for caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(spz|ply|splat)$/i.test(assetInfo.name)) {
            return `models/[name].[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },
      },
    },
  },
  
  // Production optimizations
  define: {
    // Enable production optimizations
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  
  // Handle special file types for Gaussian Splatting
  assetsInclude: ['**/*.spz', '**/*.ply', '**/*.splat'],
});
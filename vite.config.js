import { defineConfig } from 'vite';

export default defineConfig({
  // Development server configuration
  server: {
    port: 3000,
    open: true, // Auto-open browser on dev server start
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps for debugging
    minify: 'esbuild',
    target: 'es2022',
  },

  // Base public path
  base: './',
});

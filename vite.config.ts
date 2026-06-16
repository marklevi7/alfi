import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// base './' so the built app works from a githack CDN sub-path.
// viteSingleFile inlines all JS/CSS into one self-contained index.html.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
});
